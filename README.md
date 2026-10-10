# Namrata Dahal — Creator Portfolio

Multi-page Next.js portfolio using React, Motion and GSAP, with original and labeled AI photographs, verified YouTube videos, a printable media kit and a persistent collaboration form.

## Run and deploy

Use Node.js 22 or newer. Run `npm install`, then `npm run dev`.
Run `npm run build` before deployment. Import `namrata-dahal/portfolio` in Vercel, choose Next.js and the main production branch. No secrets are required for this version. Optional NEXT_PUBLIC_SITE_URL sets the public origin; otherwise Vercel's production URL is used.

## Form and inbox

Only public token requests and validated submissions are forwarded to https://namrata-dahal-creator.satinypearl4.chatgpt.site. The existing backend checks signed tokens, prevents duplicate requests, applies per-email throttling and stores records in D1. Keep the existing site public and operational. This is a shared-backend deployment, not a database migration.

/inbox redirects to the existing owner-protected inbox. Vercel never trusts client-supplied identity headers and never forwards owner APIs or credentials. No automated email notifications are configured.

managed-backend/ preserves the original schema, migrations and inbox source for future migration. It is excluded from the Next.js build and is not executed on Vercel. Those files require their original Cloudflare bindings and host-provided identity middleware.

## Content

Metrics are dated creator-supplied snapshots. public/images contains labeled AI editorial variants. public/namrata-portrait.jpeg is the supplied original. Verified video IDs are in lib/youtube-source.json. BUSINESS_PLAN.md is private planning material and is not served publicly. Keep this repository private.
