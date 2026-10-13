# Creator websites — rollout and operating guide

The site now has a separate **/creator-websites** sales page, server-validated inquiry form, Postgres storage and asynchronous owner email notifications. Brand collaboration submissions remain in **/collaborate** and the existing inquiries table. Neither path processes payments.

## Activation sequence (must be completed before sharing the sales link)

1. Deploy a GitHub PR **preview**, test desktop/mobile layouts and navigation.
2. In the existing Supabase project, run `supabase/creator-website-leads.sql` through the SQL editor. This creates the distinct table, public **INSERT-only** access with RLS, and a notification trigger.
3. Verify the existing Supabase Vault secrets `resend_api_key`, `inquiry_notify_email`, and optional `inquiry_from_email` used by the owner notification. Don't put secret values in the repository.
4. Use preview to send **one test request**. Confirm the saved row appears in the Supabase `creator_website_leads` table and that the owner notification arrived. Repeat an invalid-form test; check no applicant details are returned by GET or displayed in public logs.
5. If abuse occurs, enable an appropriate anti-bot/rate-limit layer (WAF/challenge), since the present origin check and honeypot aren't a complete anti-spam solution.
6. Merge after verifying the preview and persistence flow. This PR does **not** change the production database automatically.

## Pricing operations and truth-in-advertising

- Standard package: **Rs. 9,999**; Dashain launch: **Rs. 4,999**, up to first 19 confirmed eligible bookings, before 2026-10-25 23:59:59 Nepal local time.
- A completed form is only a **lead**, not payment, a confirmed order or a held discount.
- The code never fabricates live spot counts. Keep your own booking ledger. **Set `CREATOR_WEBSITE_OFFER_ENABLED=false` in Vercel and redeploy when 19 bookings are confirmed** to disable the price before the time deadline. Confirm availability with every lead before invoicing.
- The fee covers a *personalized one-page portfolio*, curated intro/work/social/contact sections, mobile responsiveness, basic SEO and one consolidated revision round. Custom pages, complex backend, domain, hosting, renewal fees, premium licenses and maintenance require a separate quote.
- If the standard rate is not yet a genuine normally available price, avoid representing it as an established discount. Adjust the copy/offer before launch.
- No guaranteed views, client inquiries, sponsorships or income.

## Inbox workflow

1. New row appears in `creator_website_leads` with `status=new`; notification email goes to the configured owner's inbox.
2. Review portfolio needs, availability, domain choice, deployment arrangement and third-party expenses; move status to `reviewing`.
3. Send a clear, written scope including total price, expected timeline, revisions, ownership, and cancellation/refund terms; move to `quoted`.
4. Collect payment only after acceptance. Change status to `booked` **only for confirmed bookings**, not for free form inquiries.
5. Deliver, capture feedback and update `delivered` once complete. Do not publicize client examples without permission.

## Monitoring / manual QA

- Directly visit `/creator-websites`; verify live portrait and sample-site navigation.
- Check mobile layout at 360px, 390px, tablet and desktop; keyboard access and reduced-motion behavior.
- Confirm price switch after October 25 Nepal time and with the manual `CREATOR_WEBSITE_OFFER_ENABLED=false` flag.
- Confirm valid insert returns a reference and no sensitive records are publicly readable.
- Check invalid email, too-large request, cross-origin POST and bot honeypot rejection.
- Check email alerts and inbox response workflow, including notification provider outage.
- Verify that the existing `/collaborate` brand form still functions independently.

## Follow-up opportunities

After the first paid projects, ask permission to add finished portfolio examples and genuine testimonials. Consider tracked lead-source attribution and a searchable FAQ only after actual customer questions emerge. Treat additional functionality as a separate scoped iteration rather than introducing complexity to the launch MVP.
