# 🔍 Audit — JHALAR Hanging Decor Website

**Audited:** September 1, 2026 · Branch `arena/01a05c6c-jhalar-hanging-decor` · Commit `03d53fd`
**Repo size:** ~21 MiB packed (35 product JPEGs ≈ 22 MB dominate it)

---

## 1. What this project is

A **static, no-build B2B lead-generation website** for *JHALAR Hanging Decor* — an Indian manufacturer/supplier of traditional decorative hangings (**jhalars, torans, pom-pom, bead, bell, tassel hangings**) aimed at event planners, wholesalers, retailers and organisations. Owner contact in docs: `lokeshdugar040@gmail.com`, location Howrah, West Bengal.

### The business goal
Not e-commerce — the entire site funnels visitors into **two conversion paths**:
1. A Netlify-hosted **B2B enquiry form** (`name="b2b-enquiry"`, qualified by buyer type, category, quantity, required-by date)
2. **WhatsApp deep links** (`wa.me/…`) on the hero, CTA banner, footer, and product modal

### Tech stack (deliberately minimal)
| Layer | Choice |
|---|---|
| Hosting | Netlify (`netlify.toml`, publish `/`, no build step) |
| Frontend | Hand-written HTML + CSS (`style.css`, 1,411 lines) + vanilla JS (`script.js`) |
| Product data | `content/products.json` (8 sample products), fetched client-side |
| Forms | Netlify Forms (`data-netlify="true"`) |
| CMS | Decap CMS at `/admin` (git-gateway backend → GitHub) |
| SEO | Meta tags, OG tags, canonical, `sitemap.xml`, `robots.txt`, `404.html`, `privacy.html` |

### Content & assets
- `index.html` — one-page site: hero → trust strip → features → collection (filterable grid) → custom orders → applications → CTA → process → about → FAQ accordion → enquiry form → footer + product modal
- `product/` — **35 real product photographs (~22 MB)** of artificial-flower garlands/jhalars in red, green, white, orange with gold accents. Folder names (`Products_0015_<uuid>`, `Products_0000__Linked File_`) indicate an export from a CMS/design tool. **These are the only real product data in the repo — and they are unused (see finding #1).**
- Six markdown docs (`DEPLOYMENT_GUIDE`, `FIXES_APPLIED`, `LAUNCH_SUMMARY`, `PRO_MODE_IMPROVEMENTS`, `SETUP_CHECKLIST`, `UPDATE_CONTACT_INFO`) — all dated **today**, describing a previous AI-assisted cleanup pass, all squashed into a single commit.

---

## 2. Verdict at a glance

**Design & code quality: good.** Semantic HTML, solid accessibility (`aria-expanded`, roles, autocomplete attributes), a clean CSS custom-property system, mobile nav, keyboard-dismissable modal, security headers. For a hand-rolled static site this is above average.

**Launch readiness: NOT ready.** The site cannot do its one job (generate B2B leads) because the contact details are placeholders, no real product image is wired up, and the CMS pipeline is broken end-to-end.

---

## 3. Findings

### 🔴 Critical

**F1. The 35 real product photos are completely disconnected from the site.**
`content/products.json` points every product at `/assets/images/products/*.jpg` — **none of these files exist** (verified all 8). `assets/images/products/` contains only `.gitkeep`. The actual photos sit orphaned in `/product/` with machine-generated names. Result: the live site renders grey "Image Placeholder" boxes instead of the real garlands.

**F2. All contact channels are dead placeholders.**
`index.html` contains **7 occurrences** of `91YOUR_NUMBER_HERE` and `your-email@gmail.com` (hero WhatsApp CTA, mid-page CTA, contact card, footer ×3, product modal). Every WhatsApp button currently links to `https://wa.me/91YOUR_NUMBER_HERE` — a broken number. `privacy.html` shows a different dummy number (`+91 98765 43210`).

**F3. Documentation contradicts the code.**
`LAUNCH_SUMMARY.md` claims contact info was "replaced" with `+91 98765 43210` / `lokeshdugar040@gmail.com` and the site is "✅ PRODUCTION READY". The code contains neither. Any doc claiming readiness is misleading until F1–F2 are fixed.

**F4. The CMS cannot actually update the website.**
Three separate breaks:
- `admin/config.yml` sets `media_folder: "static/images/products"` — no `static/` directory exists; the site reads images from `/assets/…`. CMS uploads would land somewhere the site never references.
- The CMS writes **markdown files** to `content/products/`, but `script.js` **only reads `content/products.json`**. Anything edited in the CMS will never appear on the site.
- Backend is `git-gateway`, which requires Netlify Identity to be enabled (and a user invited) in the Netlify UI, and typically the identity widget script in `admin/index.html` — neither is present. `/admin` will not authenticate as-is.

### 🟠 High

**F5. Catch-all redirect defeats the custom 404 page.**
`netlify.toml` maps `/* → /index.html` (status 200). Every bogus URL serves the homepage with HTTP 200: `404.html` never triggers, and search engines can index unlimited duplicate homepages. This SPA-style rule is wrong for a static brochure site — it should be removed (Netlify serves `404.html` automatically).

**F6. SEO plumbing points at a placeholder domain and fake URLs.**
Canonical + OG URLs and both `sitemap.xml` and `robots.txt` reference `https://jhalar-hanging-decor.netlify.app`. The sitemap also lists `#fragment` URLs (`/#collection` etc.), which search engines ignore — the sitemap effectively advertises one real page.

**F7. 22 MB of full-resolution JPEGs committed to Git.**
~630 KB average per image (several >1 MB), with export-artifact names containing spaces (`Products_0000__Linked File_`). Far too heavy for web delivery and bloating the repo. Needs renaming + compression (WebP ~100–250 KB) before being referenced.

**F8. Form hardening is thin.**
No honeypot or spam filter on a public Netlify form (Netlify's free tier exposes submission inboxes to bot spam); no success state — the JS only disables the button ("Sending…") and never confirms or resets.

### 🟡 Medium / minor

- **F9.** `renderProducts()` injects product data via `innerHTML` unescaped (XSS-safe today only because data is repo-controlled — but a fragile pattern once a CMS is involved).
- **F10.** `fetch('/content/products.json')` uses an absolute path — breaks if the site is ever served from a sub-path.
- **F11.** Error path double-renders: `loadProducts()`'s catch calls `showFallbackProducts()` (which renders), then `init()`'s catch calls it again.
- **F12.** Fallback products reference the same non-existent `/assets/...` images.
- **F13.** `analytics-placeholder.html` is referenced by no page — a dangling snippet.
- **F14.** No `og:image`; emoji used as feature icons (renders inconsistently across platforms).
- **F15.** Six overlapping status docs with contradictory claims should be consolidated into one; `.gitignore` doesn't exclude raw asset exports like `/product/`.

---

## 4. What's already good ✅

- Clean, semantic, accessible markup (ARIA states, `autocomplete`, labelled controls, focus-friendly modal with Escape handling)
- Well-designed B2B qualification form (buyer type, category, quantity, required-by date)
- Sensible CSS architecture (variables for colour/spacing/shadows/typography, Playfair Display + DM Sans brand fonts)
- Security headers + asset caching rules in `netlify.toml`
- Favicon, robots.txt, sitemap, privacy policy, custom 404 all present in some form

---

## 5. Recommended fix order

1. **Wire up the real photos** — rename + compress the 35 images from `/product/` into `assets/images/products/`, rewrite `products.json` to describe the *actual* 35 products (the current 8 are generic samples).
2. **Replace all 7 contact placeholders** in `index.html` (+ fix the mismatched dummy number in `privacy.html`).
3. **Fix `netlify.toml`** — drop the `/* → index.html` redirect so `404.html` works.
4. **Decide the CMS story** — either repair it (media folder → `/assets/images/products`, generate `products.json` from CMS content or drop JSON, enable Netlify Identity) or delete `/admin` until needed.
5. **SEO pass** — real domain in canonical/OG/sitemap/robots; remove `#fragment` sitemap entries; add `og:image`.
6. **Form hardening** — honeypot field, success/error message handling.
7. **Repo hygiene** — consolidate the six status docs into one `PROJECT_STATUS.md`.

---

*Generated as part of a repository audit. No code was changed.*
