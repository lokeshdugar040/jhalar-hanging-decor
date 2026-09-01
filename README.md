# JHALAR Hanging Decor - B2B Website

Decorative hanging solutions for events, retailers, wholesalers, and custom projects across India.

## 🚀 Quick Start

### Prerequisites
- GitHub account
- Netlify account (for hosting, forms, and CMS)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/lokeshdugar040/jhalar-hanging-decor.git
   cd jhalar-hanging-decor
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select this repository
   - Deploy settings:
     - Build command: (leave empty)
     - Publish directory: `/`
   - Click "Deploy site"

3. **Enable Netlify Forms**
   - Forms are already configured in `index.html`
   - View submissions in Netlify dashboard → Forms

4. **Access CMS (if using Netlify CMS)**
   - After deployment, visit `yoursite.netlify.app/admin`
   - Login with GitHub credentials
   - Manage products from the CMS interface

## 📁 Project Structure

```
jhalar-hanging-decor/
├─ admin/              # CMS configuration and logo
├─ assets/             # Images and static assets
├─ content/            # Product markdown files (CMS)
├─ product/            # Product data (legacy structure)
├─ index.html          # Main website
├─ script.js           # Product rendering and interactions
├─ style.css           # All styles
├─ netlify.toml        # Netlify configuration
└─ .gitignore          # Git ignore rules
```

## ✏️ Editing Content

### Adding Products

**Option 1: Using CMS (Recommended)**
1. Visit `/admin` after deployment
2. Navigate to Products
3. Click "New Product"
4. Fill in details and upload images
5. Save and publish

**Option 2: Manual Editing**
1. Create markdown file in `content/products/`
2. Use this frontmatter format:
   ```yaml
   ---
   title: "Product Name"
   category: "Pom Pom Hangings"
   description: "Product description"
   image: "/assets/images/products/product.jpg"
   b2bTag: "Bulk-ready"
   ---
   ```

### Updating Contact Information

Edit `index.html` and replace placeholders:
- `+91 XXXXX XXXXX` → Your actual WhatsApp/phone
- `hello@yourbusiness.com` → Your email
- `Business location to be added` → Your location

### Fixing WhatsApp Links

Update all WhatsApp buttons with your number:
```html
<a href="https://wa.me/919876543210?text=Hello%20JHALAR...">
```

## 🎨 Brand Guidelines

- **Primary Color**: `#C82039` (Jhalar Red)
- **Accent Color**: `#C9A84C` (Accent Gold)
- **Fonts**: Playfair Display (headings), DM Sans (body)

## 🔧 Configuration Files

### netlify.toml
- CMS routing
- Form handling
- Build settings

### .pages.yml / admin/config.yml
- CMS collection definitions
- Field configurations
- Widget settings

## 📝 Checklist Before Launch

- [ ] Replace all placeholder contact information
- [ ] Add real product images to `assets/images/products/`
- [ ] Update WhatsApp links with actual number
- [ ] Test form submissions
- [ ] Add privacy policy page
- [ ] Set up custom domain (optional)
- [ ] Add Google Analytics (optional)
- [ ] Test on mobile devices
- [ ] Verify all navigation links work

## 🚨 Common Issues

### Products not showing
- Check `script.js` is loading correctly
- Verify product data exists in `content/products/`
- Check browser console for errors

### Forms not submitting
- Ensure site is deployed on Netlify
- Verify `data-netlify="true"` attribute exists
- Check Netlify dashboard for form submissions

### CMS not accessible
- Ensure `admin/` folder is deployed
- Check `admin/config.yml` path
- Verify GitHub authentication

## 📞 Support

For questions or issues:
- Email: lokeshdugar040@gmail.com
- GitHub Issues: Create an issue in this repository

## 📄 License

All rights reserved © JHALAR Hanging Decor
