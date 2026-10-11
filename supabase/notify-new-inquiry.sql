-- Emails the owner through Resend whenever a row is added to public.inquiries.
-- Run supabase/schema.sql first. Secrets live in Supabase Vault, never in this file:
--   select vault.create_secret('re_...', 'resend_api_key');
--   select vault.create_secret('you@gmail.com', 'inquiry_notify_email');
--   select vault.create_secret('Namrata Dahal <hello@yourdomain.com>', 'inquiry_from_email'); -- optional

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.notify_new_inquiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  resend_key text;
  notify_to text;
  sender text;
BEGIN
  SELECT decrypted_secret INTO resend_key FROM vault.decrypted_secrets WHERE name = 'resend_api_key';
  SELECT decrypted_secret INTO notify_to FROM vault.decrypted_secrets WHERE name = 'inquiry_notify_email';
  SELECT decrypted_secret INTO sender FROM vault.decrypted_secrets WHERE name = 'inquiry_from_email';

  IF resend_key IS NULL OR notify_to IS NULL THEN
    RETURN NEW;
  END IF;

  -- pg_net sends after the insert commits, so a Resend outage never blocks a submission.
  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', coalesce(sender, 'Portfolio inquiries <onboarding@resend.dev>'),
      'to', jsonb_build_array(notify_to),
      'reply_to', NEW.email,
      'subject', 'New collaboration request: ' || NEW.brand,
      'text', concat_ws(E'\n',
        'A new collaboration request arrived from your portfolio. Reply to this email to answer ' || NEW.name || ' directly.',
        '',
        'Brand: ' || NEW.brand,
        'Name: ' || NEW.name,
        'Email: ' || NEW.email,
        'Website: ' || coalesce(nullif(NEW.website, ''), '—'),
        'Goal: ' || NEW.objective,
        'Format: ' || NEW.format,
        'Platforms: ' || array_to_string(NEW.platforms, ', '),
        'Budget: ' || NEW.budget,
        'Timing: ' || NEW.timeline,
        'Usage: ' || NEW.usage,
        'Reference: ' || NEW.id,
        '',
        NEW.details
      )
    )
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_inquiry_created ON public.inquiries;
CREATE TRIGGER on_inquiry_created
  AFTER INSERT ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_inquiry();
