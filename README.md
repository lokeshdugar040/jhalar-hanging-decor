# JHALAR Hanging Decor — B2B Website

Marketing website for JHALAR Hanging Decor, a manufacturer and wholesale supplier of handcrafted decorative hangings (pom pom garlands, floral jhalars, bell hangings, torans, tassel hangings, decorative strings and custom designs) based in Howrah, West Bengal, India.

**Stack:** plain HTML + CSS + vanilla JS. No framework, no build step.
**Hosting:** **GitHub Pages** → https://lokeshdugar040.github.io/jhalar-hanging-decor/

## Deploy on GitHub Pages

1. Repo **Settings → Pages**.
2. Source: **Deploy from a branch** → branch `main`, folder `/ (root)` → **Save**.
3. Wait 1–2 minutes; the site goes live at the URL above.

All paths in the code are relative, so the site works correctly under the `/jhalar-hanging-decor/` subpath (and under a custom domain later).

## How the enquiry form works

GitHub Pages is static (no server to receive form POSTs), so the form **composes a WhatsApp message** with every field pre-filled and opens it — the visitor just presses send. The enquiry lands at **+91 81006 56258**.

## Contact (single source of truth)

All contact details live in **`content/site-settings.json`** and are applied across the page by `script.js`:

| Field | Value |
|---|---|
| WhatsApp | `918100656258` (wa.me links) |
| Phone | `+91 81006 56258` |
| Email | `lokeshdugar040@gmail.com` |
| Location | Howrah, West Bengal, India |

> The same values are also hardcoded in `index.html` as fallback, so links work even before JS runs.

## Project structure

```
├─ index.html            # The whole site (single page)
├─ style.css             # Design system + all styles
├─ script.js             # Product grid, filters, modal, WhatsApp form, settings
├─ content/
│  ├─ products.json      # Product catalog (rendered on the site)
│  └─ site-settings.json # Contact info applied site-wide
├─ assets/
│  ├─ logo-jhalar-02.svg # Brand logo
│  └─ images/            # Optimized imagery (hero, collage, og-cover)
│     └─ products/       # Product photos used by products.json
├─ privacy.html / 404.html / sitemap.xml / robots.txt / favicon.svg
├─ .nojekyll             # Prevents Jekyll processing on GitHub Pages
└─ AUDIT.md              # Repo audit + fix log
```

## Editing the catalog

Edit `content/products.json` directly on GitHub (or in your editor). Each product:

```json
{
  "id": 17,
  "title": "New Product Name",
  "category": "Floral Jhalars",
  "description": "Short B2B-focused description.",
  "image": "assets/images/products/new-product.jpg",
  "b2bTag": "Bulk-ready"
}
```

Categories must match exactly: `Pom Pom Hangings`, `Bead Hangings`, `Bell Hangings`, `Floral Jhalars`, `Torans`, `Tassel Hangings`, `Decorative Strings`, `Custom Designs`.

> Note: the Decap/Netlify CMS was removed — it requires Netlify authentication and doesn't work on GitHub Pages. If you ever migrate to Netlify, a CMS can be re-added.

## Brand

- Primary red `#C82039`, accent gold `#C9A84C`
- Fonts: Playfair Display (headings), DM Sans (body)
- Logo: `assets/logo-jhalar-02.svg`

## Local preview

```bash
python3 -m http.server 8000   # or: npm run dev
# open http://localhost:8000
```

## License

© JHALAR Hanging Decor — All rights reserved.
