# 🚀 JHALAR Website Launch Checklist

## Critical Fixes Required Before Going Live

### ✅ COMPLETED
- [x] Added `.gitignore` file
- [x] Renamed logo file (removed space)
- [x] Updated README with instructions

### ❌ MUST FIX BEFORE LAUNCH

#### 1. Update Logo References in HTML
The logo file was renamed from `logo jhalar-02.svg` to `logo-jhalar-02.svg`. You need to update:

**File: `index.html`** (around line 162)
```html
<!-- CHANGE FROM: -->
<img class="brand-mark" src="admin/logo%20jhalar-02.svg" alt="JHALAR Hanging Decor" />

<!-- CHANGE TO: -->
<img class="brand-mark" src="admin/logo-jhalar-02.svg" alt="JHALAR Hanging Decor" />
```

**File: `admin/index.html`**
Same change needed here.

#### 2. Replace Placeholder Contact Information

**Search for and replace these in `index.html`:**

```html
<!-- WhatsApp -->
+91 XXXXX XXXXX  →  +91 98765 43210 (your actual number)

<!-- Phone -->
+91 XXXXX XXXXX  →  +91 98765 43210

<!-- Email -->
hello@yourbusiness.com  →  your-real-email@gmail.com

<!-- Location -->
Business location to be added  →  Howrah, West Bengal, India

<!-- GST -->
Details available on request / to be added  →  Your GST number or "Available on request"
```

#### 3. Fix WhatsApp Links

All WhatsApp buttons currently have `href="#"` which doesn't work. Update them:

```html
<!-- CHANGE FROM: -->
<a href="#" class="btn btn-outline whatsapp-enquiry-btn">

<!-- CHANGE TO: -->
<a href="https://wa.me/919876543210?text=Hello%20JHALAR%2C%20I%20would%20like%20a%20B2B%20quotation." class="btn btn-outline whatsapp-enquiry-btn" target="_blank" rel="noopener">
```

**Find these buttons in:**
- Hero section WhatsApp button
- CTA section WhatsApp button  
- Product modal WhatsApp button
- Footer WhatsApp link

Replace `919876543210` with your actual WhatsApp number (no spaces, no + symbol).

#### 4. Add Product Images

The `assets/` folder needs product images:

1. Create folder: `assets/images/products/`
2. Add your product photos (use `.webp` or `.jpg` format)
3. Name them clearly: `pom-pom-red.webp`, `tassel-gold.webp`, etc.
4. Update product data to reference these images

#### 5. Test the Contact Form

After deploying to Netlify:
1. Submit a test enquiry
2. Check Netlify dashboard → Forms
3. Verify you receive the submission
4. Test spam protection

#### 6. Decide on CMS System

You have TWO CMS configurations:
- `.pages.yml` (Netlify Pages CMS)
- `admin/config.yml` (Netlify CMS / Decap CMS)

**Choose ONE:**
- If using **Netlify CMS**: Keep `admin/config.yml`, remove `.pages.yml`
- If using **Pages CMS**: Keep `.pages.yml`, remove `admin/config.yml`

#### 7. Add Privacy Policy

Create `privacy.html` or add a section explaining:
- What data you collect
- How you use it
- How users can request deletion

#### 8. Mobile Testing

Test on real devices:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet
- [ ] Check all navigation works
- [ ] Verify forms work on mobile

### ⚠️ IMPORTANT NOTES

1. **The "500+ decor installs" claim** - Only keep this if you can verify it
2. **Product categories** - Make sure they match your actual inventory
3. **Shipping information** - Add details about delivery areas and costs

## 📞 Need Help?

If you need assistance with these fixes:
1. Open an issue on GitHub
2. Contact a web developer
3. Use the README.md instructions for deployment

---

**Last Updated:** September 1, 2026
**Status:** Partially Complete - Critical fixes still needed
