# Alice's coding experiments

Personal blog at [https://amtiffany.github.io/](https://amtiffany.github.io/).

This site is **static HTML** (no Jekyll build). Pages:

- `index.html` — home and post list
- `2026/04/23/triangle-distributions.html` — triangle distributions post
- `css/site.css` — shared styles
- `assets/images/` — post images

The `.nojekyll` file tells GitHub Pages to serve files as-is.

## Edit locally

Open `index.html` in a browser, or use any static file server:

```bash
python3 -m http.server 4000
```

Then visit `http://127.0.0.1:4000`.

**Changing colors:** edit `css/site.css`, then bump the `?v=` query string on the stylesheet link in each HTML page (e.g. `site.css?v=2`) so browsers load the new file.

## Comments and guestbook

Messages use [GitHub Discussions](https://github.com/amtiffany/amtiffany.github.io/discussions) on this repo (no third-party app required).

- Home page → [Guestbook discussion #1](https://github.com/amtiffany/amtiffany.github.io/discussions/1)
- Triangle post → [Comments discussion #2](https://github.com/amtiffany/amtiffany.github.io/discussions/2)

Visitors click **Write in the guestbook** or **Leave a comment** to sign in on GitHub and reply. The site loads existing replies via `js/discussions.js`.
