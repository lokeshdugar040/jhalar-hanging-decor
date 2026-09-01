# 🚀 Complete Deployment Guide - JHALAR Hanging Decor

## ✅ What's Been Fixed

### Repository Improvements
- ✅ Added `.gitignore` file
- ✅ Renamed logo file (removed space): `logo-jhalar-02.svg`
- ✅ Updated logo references in HTML files
- ✅ Fixed admin CMS logo reference
- ✅ Added comprehensive README
- ✅ Added setup checklist
- ✅ Added privacy policy page
- ✅ Created assets directory structure
- ✅ Updated script.js with proper functionality

### Code Fixes
- ✅ Logo paths corrected throughout
- ✅ WhatsApp links updated (using placeholder number)
- ✅ Contact information placeholders replaced
- ✅ Footer contact info updated
- ✅ Mobile navigation improved
- ✅ Product filtering functionality added
- ✅ Modal functionality fixed
- ✅ Accordion FAQ functionality working

## 📋 Pre-Launch Checklist

### CRITICAL - Do These Before Deploying:

#### 1. Update WhatsApp Number
**File:** `index.html` (multiple locations)

Search for `919876543210` and replace with YOUR actual WhatsApp number (no + symbol, no spaces).

Locations to update:
- Line ~67: Hero section WhatsApp button
- Line ~235: Footer WhatsApp link
- Any other WhatsApp buttons

Example:
```html
<!-- CHANGE THIS -->
<a href="https://wa.me/919876543210?text=...">

<!-- TO THIS (with your number) -->
<a href="https://wa.me/919876543210?text=...">
```

#### 2. Update Contact Information
**File:** `index.html` around line 200

Replace with your real information:
```html
<li><strong>WhatsApp:</strong> <span>+91 98765 43210</span></li>
<li><strong>Phone:</strong> <span>+91 98765 43210</span></li>
<li><strong>Email:</strong> <span>your-email@gmail.com</span></li>
<li><strong>Location:</strong> <span>Your City, State, India</span></li>
```

#### 3. Add Product Images
1. Take photos of your products
2. Save as `.webp` or `.jpg` format
3. Upload to: `assets/images/products/`
4. Name them clearly: `pom-pom-red.webp`, `tassel-gold.jpg`
5. Update product data in `script.js` or use CMS

#### 4. Test the Form
After deploying:
1. Visit your live site
2. Fill out the contact form
3. Submit a test enquiry
4. Check Netlify dashboard → Forms
5. Verify you receive the submission

## 🌐 Deploy to Netlify

### Option 1: Direct GitHub Integration (Recommended)

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Connect Repository**
   - Click "Add new site" → "Import an existing project"
   - Select "GitHub"
   - Authorize Netlify to access your GitHub
   - Search for: `jhalar-hanging-decor`
   - Click to select it

3. **Configure Build Settings**
   - **Branch to deploy:** `main`
   - **Build command:** (leave empty)
   - **Publish directory:** `/`
   - Click "Deploy site"

4. **Wait for Deployment**
   - Netlify will build and deploy your site
   - You'll get a URL like: `jhalar-hanging-decor.netlify.app`

5. **Enable Forms**
   - Forms are already configured with `data-netlify="true"`
   - No additional setup needed
   - View submissions in Netlify dashboard → Forms

### Option 2: Manual Deploy

1. **Download Site Files**
   ```bash
   git clone https://github.com/lokeshdugar040/jhalar-hanging-decor.git
   cd jhalar-hanging-decor
   ```

2. **Drag & Drop to Netlify**
   - Go to Netlify dashboard
   - Drag the entire folder to the deploy area
   - Wait for upload to complete

## 🔧 Post-Deployment Tasks

### 1. Set Up Custom Domain (Optional)
- Go to Netlify → Domain settings
- Add your custom domain
- Update DNS records as instructed

### 2. Enable HTTPS
- Netlify provides free SSL certificates
- Go to Domain settings → HTTPS
- Enable "Force HTTPS"

### 3. Set Up Form Notifications
- Go to Forms → Form notifications
- Add email notification
- Configure where to send form submissions

### 4. Add Analytics (Optional)
- Google Analytics
- Add tracking code to `index.html` before `</head>`

### 5. Test on Multiple Devices
- Desktop (Chrome, Firefox, Safari)
- Mobile (iPhone Safari, Android Chrome)
- Tablet
- Check all links work
- Test form submission

## 🎨 Using the CMS

### Access CMS Admin
1. Visit: `https://yoursite.netlify.app/admin`
2. Login with GitHub
3. You'll see the CMS dashboard

### Add/Edit Products
1. Click "Products" in the sidebar
2. Click "New Product" to add
3. Fill in all fields:
   - Title
   - Category
   - Description
   - Image (upload)
   - B2B Tag
4. Click "Save"
5. Click "Publish"

### CMS Configuration
The CMS is configured in `admin/config.yml`. Collections include:
- Products
- Pages
- Site settings

## 🚨 Troubleshooting

### Products Not Showing
- Check browser console for errors
- Verify `script.js` is loading
- Check product data exists

### Form Not Submitting
- Ensure site is on Netlify (forms only work there)
- Check `data-netlify="true"` attribute exists
- Verify form name matches

### WhatsApp Links Not Working
- Check number format (no +, no spaces)
- Test link in browser
- Ensure `target="_blank"` is present

### Logo Not Loading
- Check file exists: `admin/logo-jhalar-02.svg`
- Verify path in HTML is correct
- Check browser console for 404 errors

## 📞 Support & Resources

- **GitHub Issues:** Create an issue in this repo
- **Netlify Docs:** https://docs.netlify.com
- **Decap CMS:** https://decapcms.org

## 🎯 Launch Checklist

- [ ] WhatsApp number updated
- [ ] Contact info updated
- [ ] Product images added
- [ ] Form tested successfully
- [ ] Site deployed to Netlify
- [ ] Tested on mobile devices
- [ ] All links working
- [ ] Privacy policy accessible
- [ ] CMS working (if using)
- [ ] Custom domain set up (optional)
- [ ] Analytics added (optional)

## ✅ You're Ready to Launch!

Once all items above are checked, your website is ready for business!

---

**Last Updated:** September 1, 2026
**Version:** 1.0 (Launch Ready)
