# Recio Solutions LLC website

Static site, no build step. Every file in this repo deploys as-is.
Edit any page directly in the GitHub web UI and Render redeploys on commit.

## Structure

```
index.html            Home
services/             Services
compliance/           Compliance (the page that gets Yeffrey the meeting)
how-it-works/         Chain-of-custody process
service-area/         Counties and cities
about/                About (two [MONTH YEAR] placeholders to fill in)
quote/                Quote form, wired to Avolv
thank-you/            Post-submit redirect, noindex
assets/css/site.css   All styles
assets/js/site.js     Nav + Avolv form submit
render.yaml           Render static-site blueprint
robots.txt, sitemap.xml, 404.html
```

## Deploy (Render)

1. Create a new GitHub repo, upload everything in this zip to the repo root.
2. Render: New > Blueprint > pick the repo. render.yaml does the rest.
3. Point reciosolutions.com DNS at Render (same Cloudflare pattern as gilpoolservice.com).

## Avolv lead capture: DO THIS BEFORE TESTING THE FORM

The form POSTs to:

```
https://api.avolv.ai/api/marketing/lead-ingestion?business=recio-solutions
```

A Recio team must exist in Avolv with Team.slug exactly `recio-solutions`.
A wrong slug fails silently: the form looks fine, the lead vanishes.
Verify with:

```sql
SELECT id, name, slug FROM "Team" WHERE slug LIKE '%recio%' OR name ILIKE '%recio%';
```

It must return exactly `recio-solutions`. CORS needs nothing: the
lead-ingestion path is in PUBLIC_OPEN_CORS_PATHS and reflects any origin.

## Go-live checklist

- [ ] Team created in Avolv, slug confirmed `recio-solutions` via the SQL above
- [ ] Pipeline stages exist for the Recio team
- [ ] Fill both [MONTH YEAR] placeholders in about/index.html (search for "ph")
- [ ] Submit a real test lead, confirm redirect to /thank-you/
- [ ] Confirm the test lead appears in the Recio Lead Inbox
- [ ] Confirm lead alert reaches Yeffrey
