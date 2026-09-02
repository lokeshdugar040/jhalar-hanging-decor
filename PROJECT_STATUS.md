# PROJECT STATUS — JHALAR Hanging Decor

**Last updated:** September 2, 2026
**State of the site:** Feature-complete and audit-fixed. **One action remains before going live — see "Before you launch" below.**

---

## Before you launch (the only manual step)

The previous WhatsApp / contact placeholders have been centralised so nothing can be missed:

1. **WhatsApp number** — open `script.js` and set the real number in **one place**:
   ```js
   const WA_NUMBER = '91XXXXXXXXXX';   // country code + number, digits only
   ```
   Every WhatsApp button on the site updates automatically from this constant.
2. **Displayed contact details** — in `index.html` (contact card + footer) and `privacy.html`,
   search-replace:
   - `+91 XXXXX XXXXX` → your real display number
   - `hello@your-domain.com` → your real email
   - `https://jhalarhangingdecor.com` → your real domain (canonical, OG tags, `sitemap.xml`, `robots.txt`) — only if you use a different domain
3. **Netlify dashboard (one-time):** Site settings → Identity → *Enable*, then
   Identity → Services → *Enable Git Gateway*, and invite yourself as a user.
   This powers the `/admin` CMS login.

---

## What was fixed in this pass (Sept 2, 2026)

### Content & assets
- **All 35 real product photos are now live on the site** — resized to 900×900, converted to WebP (+ JPG fallback), ~95% lighter (22 MB → 4 MB), renamed to SEO-friendly slugs in `assets/images/products/`.
- `content/products.json` rewritten: 35 real products (was 8 generic samples) with descriptive, keyword-rich names, categories and B2B copy.
- New branded 1200×630 `og-image.jpg` for social/AI-assistant previews.
- Hero and section images replaced placeholders with real product photography.
- Site copy rewritten to be specific (MOQ from 50 pieces, 35+ designs, same-day quotes, GST invoicing, pan-India dispatch).

### SEO / AIO (answer-engine optimisation)
- Full JSON-LD graph: `Organization`, `WebSite`, `FAQPage` (6 Q&As) and an `ItemList` of all 35 `Product` entries — the structured data that powers rich results and AI-assistant answers.
- Keyword-targeted `<title>` and meta description; `robots` max-image-preview; theme-color.
- Canonical + Open Graph + Twitter cards with absolute URLs and `og:image`.
- Sitemap cleaned (no `#fragment` URLs), `robots.txt` updated, `/admin/` excluded from crawling.

### Layout / UX / accessibility
- Sticky header with scroll state, active-section nav highlighting (scroll-spy), animated mobile menu.
- Real hero composition: product photo in a gold-ring card with floating stat chips.
- Product grid: square optimised images, hover zoom, tag badges, 3-line clamped descriptions, equal-height cards, "View Details & MOQ" per product, mobile-friendly horizontal filter bar.
- Product modal: large image, product-specific WhatsApp message, **"Add to Enquiry Form"** that pre-fills the form, focus trap, Escape/backdrop close, focus restore.
- Toast notifications, reveal-on-scroll gated behind JS (content always visible without JS), `prefers-reduced-motion` respected, visible focus rings, anchor offset via `scroll-margin-top`.

### Forms & backend
- Inline field validation with accessible error messages.
- AJAX submission to Netlify Forms with success and error states (error state offers WhatsApp fallback).
- Hidden honeypot field (`netlify-honeypot`) for spam protection.

### Infrastructure
- `netlify.toml`: **removed the catch-all `/* → index.html` redirect** that was defeating the custom 404 and serving soft-200 duplicates; added Content-Security-Policy and layered cache headers (immutable images, 5-min product JSON, revalidated HTML).
- **CMS repaired:** Decap CMS now edits `content/products.json` *directly* (file collection), uploads land in `assets/images/products`, Netlify Identity widget added to `/admin`. Site re-fetches product data, so CMS publishes appear within ~5 minutes.
- Six overlapping/outdated status docs consolidated into this file.

---

## Known placeholders (intentional)

| Placeholder | Where | Meaning |
|---|---|---|
| `91XXXXXXXXXX` / `+91 XXXXX XXXXX` | `script.js`, `index.html`, `privacy.html`, `404.html` | Replace with your real number |
| `hello@your-domain.com` | `index.html`, `privacy.html` | Replace with your real email |
| `https://jhalarhangingdecor.com` | head meta, sitemap, robots, JSON-LD | Replace if your domain differs |

The original raw product exports remain in `/product/` (not referenced by the site).
Safe to delete once the optimised copies in `assets/images/products/` are confirmed good.
