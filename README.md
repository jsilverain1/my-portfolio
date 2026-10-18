# Joey Silverain — Portfolio

Personal portfolio site for Joey Silverain, junior software developer.

## Stack

Plain HTML, CSS and vanilla JavaScript — no build step or dependencies.

- `index.html` — page content and markup
- `styles.css` — design tokens (light/dark themes), layout and components
- `main.js` — theme toggle, mobile navigation and contact-form submission
- `assets/` — optimized photos, favicon and resume PDF

The contact form posts to [Formspree](https://formspree.io). With JavaScript enabled it submits in place and shows an inline status message; without JavaScript it falls back to a normal form post.

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Updating the photo

Export resized JPEGs from the original (macOS):

```sh
sips -s format jpeg -s formatOptions 72 --resampleWidth 480 original.jpeg --out assets/joey-silverain-480.jpg
sips -s format jpeg -s formatOptions 72 --resampleWidth 960 original.jpeg --out assets/joey-silverain-960.jpg
```
