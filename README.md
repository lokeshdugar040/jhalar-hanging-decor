# JHALAR Hanging Decor — B2B Website

A static B2B product catalogue hosted on Netlify. Product content is edited with **Pages CMS**, which saves directly to this GitHub repository. Netlify deploys the update automatically.

## Product editor: Pages CMS

1. Go to [Pages CMS](https://pagescms.org/).
2. Click **Sign in with GitHub** and sign in as `lokeshdugar040`.
3. Authorize Pages CMS to access GitHub if asked.
4. Select the repository: `lokeshdugar040/jhalar-hanging-decor`.
5. Pages CMS reads `.pages.yml` automatically.
6. Open **Products** → **New Product**.
7. Add the product name, category, tags, descriptions, MOQ, optional price, status, and product images.
8. Choose **Published** for the product to appear on the website.
9. Click **Save** or **Publish**. Pages CMS creates/updates a Markdown file in `content/products/` and uploads images into `static/images/products/`.
10. Wait for Netlify to deploy the GitHub commit, then refresh the site.

## Important rules

- Only products with `status: published` are visible on the public website.
- **Draft** products stay hidden from visitors.
- Categories are automatically created from your published product categories. You do not need to edit the website filters manually.
- Use a clear main image for every product.
- Do not remove `.pages.yml`; it defines the editor fields.

## Website addresses

- Public website: `https://jhalar-hanging-decor.netlify.app/`
- Repository: `https://github.com/lokeshdugar040/jhalar-hanging-decor`
- Editor: `https://pagescms.org/`

## Brand kit

- KING / attention: Playfair Display
- MOGRANX / information: DM Sans
- JHALAR Red: `#C82039`
- Warm Cream: `#FFFAF1`
- Deep Navy: `#141942`

## Before launch

Update the WhatsApp number (`91XXXXXXXXXX`), email, location, product photographs, social links, and any sample product information in `index.html`.
