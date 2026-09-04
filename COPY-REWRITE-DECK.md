# JHALAR Copy Rewrite — Deck

Reconstructed and shipped from this session (the original `bb49019` commit and
`/home/user/jhalar-copy-rewrite-bb49019.patch` were **not present** in the
workspace, so the copy was rebuilt to the agreed strings and verified).

## What changed

Voice now leads with weddings and events and keeps the workshop / made-to-order
angle, without the older round-1 "manufacturer / B2B" framing.

| Area | Before | After |
|---|---|---|
| Hero headline | Hanging Decor for Events and Businesses | Wedding and Event Jhalars — Made to Order in Howrah |
| Hero intro | … supplied in bulk across India | … handcrafted in Howrah and supplied across India for weddings, celebrations and commercial spaces |
| Hero badge | Howrah Manufacturer | B2B Supply | Howrah Workshop | Made to Order |
| Why title | Factory-Direct, Made to Order, Built to Scale | Direct from the Workshop — Built to Your Brief |
| About title | Handcrafted in Howrah, Supplied Across India | From Our Workshop to Your Venue — No Middlemen |
| Contact title | Start a B2B Enquiry | Get a Quote on WhatsApp |
| Submit button | Send Enquiry via WhatsApp | Send Message via WhatsApp |
| FAQ | Large-quantity / retailer framing | Wedding-and-event framing; answers include "a few dozen to several thousand" |
| SEO titles | Jhalar and Festive Hangings Manufacturer — Wholesale and Bulk | Wedding and Event Jhalars — Made to Order in Howrah |

## Files

- `index.html` — static copy (h1, hero, why, about, FAQ, contact, submit button, SEO meta).
- `content/site-settings.json` — canonical settings / copy used by the live site.
- `script.js` — default settings fallback + runtime apply of the new `contact.submitLabel`.
- `editor.js` — editor defaults + wiring for the new **Submit Button Text** field.
- `editor.html` — editor placeholders + the new Submit Button Text input.

## Verification

- `bash scripts/validate.sh` → `VALIDATE PASS`.
- `node --check script.js` and `node --check editor.js` → OK.
- `content/site-settings.json` parses as valid JSON.
- Required strings confirmed present in `index.html`, `content/site-settings.json`,
  `script.js`, and `editor.js`:
  - `Wedding and Event Jhalars — Made to Order in Howrah`
  - `From Our Workshop to Your Venue — No Middlemen`
  - `Get a Quote on WhatsApp`
  - `Send Message via WhatsApp`
  - `a few dozen to several thousand`

## Note

The original `bb49019` commit and `/home/user/jhalar-copy-rewrite-bb49019.patch`
were **not recoverable** from this workspace (no git object, no dangling commit,
no patch file). This deck documents the reconstructed copy that was shipped
instead, verified against the exact strings requested.
