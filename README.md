# connectionhack

A clean scratchpad for the daily [NYT Connections](https://www.nytimes.com/games/connections) puzzle. Drag words around, group them, label your guesses, and check rows when you're ready.

- **Drag** a tile onto another to swap them
- **Tap** up to 4 tiles, then **Group** to pull them into a row
- Click the row dot to color-code it, type your guess for the connection
- **Check** a row to see if you've got it (or if you're one away)

Puzzles are fetched every few hours by a GitHub Action (`scripts/fetch.mjs`) into `data/`, and the site is served as static files via GitHub Pages.

Not affiliated with The New York Times.
