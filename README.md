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

## Comments and guestbook

Comments use [Giscus](https://giscus.app), backed by GitHub Discussions on this repo.

**One-time setup** (if the comment box does not appear):

1. Install the Giscus app: [github.com/apps/giscus](https://github.com/apps/giscus)
2. Grant access to `amtiffany/amtiffany.github.io`
3. Use repository `amtiffany/amtiffany.github.io`, category **General**, mapping **pathname** when prompted (the HTML embeds already override mapping per page)

- Home page → guestbook (`data-term="guestbook"`)
- Blog posts → comments tied to each page URL
