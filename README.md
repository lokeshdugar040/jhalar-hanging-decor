# JHALAR Hanging Decor — B2B Website

Decorative hanging solutions for events, retailers, wholesalers and custom projects across India.
Static site — no build step — deployed on Netlify with Decap CMS at `/admin`.

## 🚀 Quick Start

1. **Deploy to Netlify** — "Add new site" → import this repo. Build command: *(empty)*, Publish directory: `/`.
2. **Enable CMS login** — Netlify dashboard → Site settings → Identity → *Enable* → Services → *Enable Git Gateway* → invite yourself under Identity → Invite users. Then visit `/admin`.
3. **Set your contact details** — see `PROJECT_STATUS.md` → "Before you launch" (one WhatsApp constant in `script.js`, plus a search-replace for display details).

## 📁 Project Structure

```
jhalar-hanging-decor/
├─ index.html               # Main website (single page)
├─ script.js                # Rendering + interactions (WA_NUMBER config at top)
├─ style.css                # All styles (design tokens at top)
├─ content/
│  └─ products.json         # ← The product catalogue the site renders (CMS-edited)
├─ assets/images/products/  # Optimised WebP + JPG product photos
├─ admin/                   # Decap CMS — edits content/products.json directly
├─ product/                 # Raw original photo exports (unreferenced; archival)
├─ netlify.toml             # Headers, caching (no SPA redirect — 404.html works)
├─ 404.html / privacy.html  # Error + policy pages
├─ sitemap.xml / robots.txt # SEO plumbing
├─ AUDIT.md                 # Sept 2026 audit findings
└─ PROJECT_STATUS.md        # Current state + launch checklist
```

## ✏️ Managing Products

**Option 1 — CMS (recommended):** visit `/admin` after enabling Identity/Git Gateway. The "Product Catalogue" screen edits `content/products.json` directly — publish and changes appear within ~5 minutes.

**Option 2 — Manual:** edit `content/products.json`. Fields per product:

```json
{
  "id": 1,
  "title": "Rani Pink Flower Jhalar Garland",
  "category": "Floral Jhalars",
  "description": "1–2 sentences with buyer-relevant keywords.",
  "image": "/assets/images/products/rani-pink-flower-jhalar",
  "b2bTag": "Bestseller"
}
```

`image` has no extension on purpose: the site tries `.webp` first and falls back to `.jpg`. Provide both files (900×900 recommended). Categories must match the filter buttons in `index.html` (`data-filter` values).

## 📞 Contact Placeholders

| Token | Set it in |
|---|---|
| `WA_NUMBER = '91XXXXXXXXXX'` | `script.js` (top of file) — powers every WhatsApp button |
| `+91 XXXXX XXXXX`, `hello@your-domain.com` | `index.html`, `privacy.html`, `404.html` |
| Domain `jhalarhangingdecor.com` | `index.html` head, `sitemap.xml`, `robots.txt` |

## 🎨 Brand

- **Primary:** `#C82039` (Jhalar Red) · **Accent:** `#C9A84C` (Gold) · **Navy:** `#141942`
- **Fonts:** Playfair Display (headings) · DM Sans (body)
- **Product images:** square 900×900, WebP primary + JPG fallback

## 🛠 Local Preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## 📄 License

All rights reserved © JHALAR Hanging Decor
