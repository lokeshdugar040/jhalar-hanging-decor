import { defineConfig } from 'tinacms'

const branch = 'main'

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID!,
  token: process.env.TINA_TOKEN!,
  media: {
    tina: {
      mediaRoot: 'assets/images',
      publicFolder: 'assets/images',
    },
  },
  schema: {
    collections: [
      {
        name: 'product',
        label: 'Products',
        path: '_products',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Product Title',
            required: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
            required: true,
            options: [
              'Pom Pom Hangings',
              'Bead Hangings',
              'Bell Hangings',
              'Floral Jhalars',
              'Torans',
              'Tassel Hangings',
              'Decorative Strings',
              'Custom Designs',
            ],
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'image',
            name: 'image',
            label: 'Product Image',
          },
          {
            type: 'string',
            name: 'b2b_tag',
            label: 'B2B Tag',
            description: 'e.g., "Bulk Supply", "Custom Orders"',
          },
        ],
      },
      {
        name: 'siteSettings',
        label: 'Site Settings',
        path: '_config',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'whatsapp',
            label: 'WhatsApp Number',
            description: 'Format: 919876543210',
          },
          {
            type: 'string',
            name: 'email',
            label: 'Email Address',
          },
          {
            type: 'string',
            name: 'phone',
            label: 'Phone Number',
          },
          {
            type: 'string',
            name: 'location',
            label: 'Business Location',
          },
          {
            type: 'string',
            name: 'gst',
            label: 'GST Number',
          },
        ],
      },
    ],
  },
})
