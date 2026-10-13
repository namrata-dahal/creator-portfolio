-- Creator-website leads are SEPARATE from brand collaboration inquiries.
-- Run once in the same Supabase project as supabase/schema.sql.
-- Safe to rerun. The public may INSERT only; no SELECT / UPDATE / DELETE privileges.
-- Owner alert uses the EXISTING Vault secrets from notify-new-inquiry.sql:
--   resend_api_key, inquiry_notify_email, optional inquiry_from_email.
CREATE TABLE IF NOT EXISTS public.creator_website_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  creator_handle TEXT NOT NULL CHECK (char_length(creator_handle) BETWEEN 2 AND 120),
  creator_type TEXT NOT NULL CHECK (creator_type IN (
    'Content creator', 'Photographer / videographer', 'Designer / freelancer',
    'Student creator', 'Other'
  )),
  work_url TEXT NOT NULL DEFAULT '' CHECK (char_length(work_url) <= 300),
  notes TEXT NOT NULL DEFAULT '' CHECK (char_length(notes) <= 1500),
  consent BOOLEAN NOT NULL CHECK (consent = true),
  offer_at_inquiry TEXT NOT NULL CHECK (offer_at_inquiry IN ('dashain_launch', 'standard')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'reviewing', 'quoted', 'booked', 'declined', 'delivered', 'archived'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_website_leads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.creator_website_leads FROM anon, authenticated;
GRANT INSERT (id, name, email, creator_handle, creator_type, work_url, notes, consent, offer_at_inquiry)
  ON public.creator_website_leads TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone may submit creator website leads" ON public.creator_website_leads;
CREATE POLICY "Anyone may submit creator website leads"
ON public.creator_website_leads FOR INSERT TO anon, authenticated
WITH CHECK (consent = true AND status = 'new');

CREATE INDEX IF NOT EXISTS creator_website_leads_created_idx
ON public.creator_website_leads(created_at DESC);

-- pg_net queues emails after transaction commits. An email failure does not lose a lead.
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.notify_creator_website_lead()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  resend_key TEXT;
  notify_to TEXT;
  sender TEXT;
BEGIN
  SELECT decrypted_secret INTO resend_key FROM vault.decrypted_secrets WHERE name = 'resend_api_key';
  SELECT decrypted_secret INTO notify_to FROM vault.decrypted_secrets WHERE name = 'inquiry_notify_email';
  SELECT decrypted_secret INTO sender FROM vault.decrypted_secrets WHERE name = 'inquiry_from_email';
  IF resend_key IS NULL OR notify_to IS NULL THEN RETURN NEW; END IF;

  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key, 'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', coalesce(sender, 'Portfolio inquiries <onboarding@resend.dev>'),
      'to', jsonb_build_array(notify_to),
      'reply_to', NEW.email,
      'subject', 'Creator website request — ' || NEW.name,
      'text', concat_ws(E'\n',
        'New creator-website inquiry. Reply to this email to reach the creator.',
        'Reference: ' || NEW.id,
        'Name: ' || NEW.name,
        'Email: ' || NEW.email,
        'Handle: ' || NEW.creator_handle,
        'Type: ' || NEW.creator_type,
        'Work link: ' || NEW.work_url,
        'Offer at inquiry: ' || NEW.offer_at_inquiry,
        'Status: inquiry only; no booking or discounted slot reserved.',
        '',
        NEW.notes
      )
    )
  );
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.notify_creator_website_lead() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS on_creator_website_lead_created ON public.creator_website_leads;
CREATE TRIGGER on_creator_website_lead_created
AFTER INSERT ON public.creator_website_leads
FOR EACH ROW EXECUTE FUNCTION private.notify_creator_website_lead();

NOTIFY pgrst, 'reload schema';
