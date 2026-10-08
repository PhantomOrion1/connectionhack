// Fetches NYT Connections puzzles into data/YYYY-MM-DD.json and rebuilds data/index.json.
// Usage: node scripts/fetch.mjs [daysBack=1] [daysForward=1]
import { readdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DATA = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
const back = Number(process.argv[2] ?? 1);
const forward = Number(process.argv[3] ?? 1);

const iso = (d) => d.toISOString().slice(0, 10);
const exists = (p) => access(p).then(() => true, () => false);

async function fetchDay(date) {
  const file = join(DATA, `${date}.json`);
  if (await exists(file)) return;
  const res = await fetch(`https://www.nytimes.com/svc/connections/v2/${date}.json`, {
    headers: { "User-Agent": "Mozilla/5.0 (connectionhack)" },
  });
  if (!res.ok) return console.log(`${date}: ${res.status}`);
  const raw = await res.json();
  if (raw.status !== "OK" || !raw.categories) return console.log(`${date}: not available`);

  const words = [];
  for (const c of raw.categories) for (const card of c.cards) words[card.position] = card.content;
  const puzzle = {
    date,
    id: raw.id,
    editor: raw.editor,
    words,
    groups: raw.categories.map((c) => ({ title: c.title, words: c.cards.map((x) => x.content) })),
  };
  await writeFile(file, JSON.stringify(puzzle, null, 2) + "\n");
  console.log(`${date}: saved #${raw.id}`);
}

const today = new Date();
for (let i = -back; i <= forward; i++) {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() + i);
  await fetchDay(iso(d));
}

const dates = (await readdir(DATA))
  .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
  .map((f) => f.slice(0, 10))
  .sort();
await writeFile(join(DATA, "index.json"), JSON.stringify({ dates }) + "\n");
console.log(`index: ${dates.length} puzzles`);
