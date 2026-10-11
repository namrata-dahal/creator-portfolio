# Namrata Dahal — Creator Portfolio

Multi-page Next.js portfolio using React, Motion and GSAP, with editorial photography, verified YouTube videos, a printable media kit and a persistent collaboration form.

## Run and deploy

Use Node.js 22 or newer. Run `npm install`, then `npm run dev`.
Run `npm run build` before deployment. Import `namrata-dahal/portfolio` in Vercel, choose Next.js and the main production branch. Optional NEXT_PUBLIC_SITE_URL sets the public origin; otherwise Vercel's production URL is used.

## Form and email

Submissions are validated and saved to the Supabase `inquiries` table (see supabase/schema.sql). Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.

Emails use Resend and are optional; requests are always saved.

New-request alerts to Namrata are sent by a Supabase trigger on every new `inquiries` row (see supabase/notify-new-inquiry.sql). Its settings are Supabase Vault secrets: `resend_api_key`, `inquiry_notify_email` (where alerts go; replying to an alert replies to the brand) and optional `inquiry_from_email`.

The brand's confirmation copy is sent by the app and needs these environment variables:

- RESEND_API_KEY: enables the confirmation email.
- INQUIRY_FROM_EMAIL: sender, e.g. `Namrata Dahal <hello@yourdomain.com>`, on a domain verified in Resend.
- INQUIRY_NOTIFY_EMAIL: optional reply-to address for the confirmation.

Read and manage requests in the Supabase Table Editor (`inquiries` table). The site itself has no read access: visitors can only insert rows, and no role is granted SELECT.

managed-backend/ preserves the original schema and migrations for future migration. It is excluded from the Next.js build and is not executed on Vercel. Those files require their original Cloudflare bindings and host-provided identity middleware.

## Supabase setup

Run these once in the Supabase SQL Editor, in order. Each file is safe to re-run.

1. `supabase/schema.sql`: the `inquiries` table.
2. `supabase/notify-new-inquiry.sql`: emails Namrata on every new inquiry.
3. `supabase/content.sql`: editable site content tables, seeded with the current content.
4. `supabase/storage.sql`: public `media` bucket for the media kit PDF and video covers.
5. `supabase/cron.sql`: daily YouTube views/subscriber refresh and a Monday inquiry digest email.

Secrets are stored in Supabase Vault (`select vault.create_secret('value', 'name');`): `resend_api_key`, `inquiry_notify_email`, optional `inquiry_from_email`, and `youtube_api_key` (a YouTube Data API v3 key from Google Cloud).

## Content

Stats, platforms, brand case studies, YouTube videos and TikTok highlights are edited in the Supabase Table Editor (tables `site_settings`, `stats`, `platforms`, `case_studies`, `videos`, `short_videos`). Pages pick up changes within 5 minutes. Use `sort_order` to reorder and `visible` to hide rows. To offer a downloadable media kit, upload a PDF to the `media` bucket and put its file name in `site_settings.media_kit_pdf`. Video covers can be uploaded the same way and referenced from `poster_path`.

If Supabase is unreachable or the tables don't exist yet, the site falls back to the values in lib/portfolio.ts.

Other content lives in lib/portfolio.ts: stats and their date, platform cards (add follower counts there), audience, skills, brand case studies (add a brand quote via `quote`), YouTube videos, and contact settings. Fill in `contact.email` and `contact.whatsapp` to show those buttons. Add TikTok video IDs to `shortVideos` to show the vertical video section on /work.

TikTok covers live in public/videos/tiktok, named after the video ID (the number at the end of the TikTok URL), e.g. `7636764523038297365.jpg`. JPG, PNG, WebP and AVIF all work; use a 9:16 image around 720×1280. Videos without a cover show a plain green card. `pnpm thumbs:tiktok` can try to download missing covers, but TikTok often blocks it.

Metrics are dated creator-supplied snapshots. Editorial images are in public/images and the portrait is public/namrata-portrait.jpeg. Verified video IDs are in lib/youtube-source.json. BUSINESS_PLAN.md is private planning material and is not served publicly. Keep this repository private.
