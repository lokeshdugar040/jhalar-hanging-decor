# JHALAR Hanging Decor — B2B Website

**Netlify CMS-powered product catalog for B2B decorative hanging solutions.**

## Quick Start

### 1. Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and log in
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and choose `lokeshdugar040/jhalar-hanging-decor`
4. Build settings:
   - **Build command:** Leave empty (static site)
   - **Publish directory:** `/`
5. Click **"Deploy site"**

### 2. Enable Netlify Identity & Git Gateway

1. In Netlify dashboard → **Site settings** → **Identity**
2. Click **"Enable Identity"**
3. Under **Registration preferences**, select **"Invite only"** (recommended for B2B)
4. Go to **Site settings** → **Git Gateway** → **"Enable Git Gateway"**
5. (Optional) Add team members: **Identity** → **"Invite users"** → enter emails

### 3. Access Admin Dashboard

Once deployed, your admin is at:
```
https://YOUR-SITE-NAME.netlify.app/admin
```

Login with your Netlify Identity credentials.

### 4. Add Your First Product

1. Go to `/admin`
2. Click **"Products"** → **"New Product"**
3. Fill in:
   - Name (e.g., "Artisan Bead Garland")
   - Category (select from dropdown)
   - Tags (optional)
   - Short Description (for product cards)
   - Full Description (Markdown supported)
   - Main Image (upload via Media Library)
   - MOQ (Minimum Order Quantity)
   - Price (₹)
   - Featured (checkbox for homepage)
   - Status (Published/Draft)
4. Click **"Publish"**

### 5. Update Contact Details

Edit `index.html` and update:
- WhatsApp number (search for `91XXXXXXXXXX`)
- Email address
- Physical location

## File Structure

```
├── admin/
│   ├── index.html          # CMS entry point
│   └── config.yml          # CMS configuration
├── content/
│   └── products/           # Product markdown files
├── static/
│   └── images/
│       └── products/       # Uploaded product images
├── index.html              # Homepage
├── style.css               # Brand kit styles
├── script.js               # Product fetching & UI
└── netlify.toml            # Netlify config
```

## Brand Kit

- **KING (Playfair Display)** → Headings, navigation, buttons
- **MOGRANX (DM Sans)** → Body text, forms, descriptions
- **JHALAR Red #C82039** → Primary actions, accents
- **Warm Cream #FFFAF1** → Backgrounds
- **Deep Navy #141942** → Text, footer

## Features

✅ Product management via `/admin`
✅ Auto-generated category filters
✅ Image upload to Media Library
✅ Draft/Published status
✅ SEO fields per product
✅ Netlify Forms for enquiries
✅ WhatsApp integration
✅ Mobile responsive
✅ Accessibility (ARIA, keyboard nav)

## Next Steps

1. Add real product photography
2. Update WhatsApp number throughout
3. Add Google Analytics
4. Set up custom domain
5. Add more products via `/admin`

---

**Built with Netlify CMS (Decap CMS) · Brand Kit Compliant**
