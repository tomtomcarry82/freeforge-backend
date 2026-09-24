# AdSense readiness — FreeForge

## Domain swap (one line, run at deploy)

```bash
sed -i 's|https://example.com|https://REAL-DOMAIN|g' ../app.py index.html pages/*.html pages/blog/*.html   # run from frontend/; also update SITE_URL in app.py (same swap covers it)
```

Replace `https://REAL-DOMAIN` with the real domain. Every canonical, OG/Twitter URL, JSON-LD url, sitemap loc and JS/SITE_URL constant uses the same placeholder, so this one command covers all pages. Verify with `grep -r 'example.com' --include='*.html' --include='*.js' --include='*.xml' .` afterwards — only third-party URLs (e.g. ESPN API) may remain.


Publisher-ID swap note: in `ads.txt`, replace `pub-0000000000000000` with your real AdSense publisher ID **after** approval. Keep the `f5c85fc` token as-is.

Contact-email swap note: `contact.html` uses a mailto form addressed to `tomtomcarry82@gmail.com` (see the `CONTACT-EMAIL` HTML comment at the top). Swap in the real support inbox at deploy.

## Pre-submission checklist
- [ ] Original content: 3 original 600+ word blog articles published, all pages have real site-specific copy
- [ ] about.html / contact.html / privacy.html / terms.html all present and linked
- [ ] No placeholder text anywhere (no lorem ipsum, no example.com URLs left, no TODO notes)
- [ ] Mobile-friendly: responsive layout, viewport meta, tap targets ≥ 44px
- [ ] ads.txt live at the site root with the real publisher ID
