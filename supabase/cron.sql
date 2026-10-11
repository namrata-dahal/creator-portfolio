-- Scheduled jobs. Run supabase/schema.sql and supabase/content.sql first.
-- Secrets live in Supabase Vault, never in this file:
--   select vault.create_secret('AIza...', 'youtube_api_key');      -- YouTube Data API v3 key
--   resend_api_key / inquiry_notify_email / inquiry_from_email      -- shared with notify-new-inquiry.sql
-- Check runs with: select * from cron.job_run_details order by start_time desc limit 10;

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Not exposed through the Data API, so visitors cannot trigger these jobs.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

-- 798 -> '798', 2912 -> '2.9K', 14023 -> '14K', 3012345 -> '3M'
CREATE OR REPLACE FUNCTION private.compact_number(n BIGINT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT CASE
    WHEN n >= 999500 THEN trim_scale(round(n / 1000000.0, 1))::text || 'M'
    WHEN n >= 9950 THEN round(n / 1000.0)::text || 'K'
    WHEN n >= 1000 THEN trim_scale(round(n / 1000.0, 1))::text || 'K'
    ELSE n::text
  END
$$;

-- Daily: refresh per-video YouTube views and the YouTube subscriber count.
CREATE OR REPLACE FUNCTION private.refresh_youtube_stats()
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  api_key TEXT;
  video_ids TEXT;
  channel_handle TEXT;
  res extensions.http_response;
  item JSONB;
BEGIN
  SELECT decrypted_secret INTO api_key FROM vault.decrypted_secrets WHERE name = 'youtube_api_key';
  IF api_key IS NULL THEN
    RAISE EXCEPTION 'Vault secret youtube_api_key is missing';
  END IF;

  -- The YouTube API accepts at most 50 IDs per request.
  SELECT string_agg(id, ',') INTO video_ids
  FROM (SELECT id FROM public.videos ORDER BY sort_order LIMIT 50) v;

  IF video_ids IS NOT NULL THEN
    res := extensions.http_get(
      'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' || video_ids || '&key=' || api_key
    );
    IF res.status <> 200 THEN
      RAISE EXCEPTION 'YouTube videos request failed with HTTP %: %', res.status, res.content;
    END IF;
    FOR item IN SELECT jsonb_array_elements(res.content::jsonb -> 'items') LOOP
      UPDATE public.videos
      SET views = private.compact_number((item -> 'statistics' ->> 'viewCount')::bigint)
      WHERE id = item ->> 'id';
    END LOOP;
  END IF;

  SELECT handle INTO channel_handle FROM public.platforms WHERE name = 'YouTube' LIMIT 1;
  IF channel_handle IS NOT NULL THEN
    res := extensions.http_get(
      'https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle='
        || replace(channel_handle, '@', '%40') || '&key=' || api_key
    );
    IF res.status <> 200 THEN
      RAISE EXCEPTION 'YouTube channel request failed with HTTP %: %', res.status, res.content;
    END IF;
    item := res.content::jsonb -> 'items' -> 0 -> 'statistics';
    IF item IS NOT NULL AND NOT coalesce((item ->> 'hiddenSubscriberCount')::boolean, false) THEN
      UPDATE public.platforms
      SET followers = private.compact_number((item ->> 'subscriberCount')::bigint) || ' subscribers'
      WHERE name = 'YouTube';
    END IF;
  END IF;

  UPDATE public.site_settings SET youtube_synced_at = now() WHERE id = 1;
END;
$$;

-- Weekly: email a summary of the last 7 days of inquiries. Skipped when there is nothing to report.
CREATE OR REPLACE FUNCTION private.send_inquiry_digest()
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  resend_key TEXT;
  notify_to TEXT;
  sender TEXT;
  week_count INT;
  open_count INT;
  lines TEXT;
BEGIN
  SELECT decrypted_secret INTO resend_key FROM vault.decrypted_secrets WHERE name = 'resend_api_key';
  SELECT decrypted_secret INTO notify_to FROM vault.decrypted_secrets WHERE name = 'inquiry_notify_email';
  SELECT decrypted_secret INTO sender FROM vault.decrypted_secrets WHERE name = 'inquiry_from_email';
  IF resend_key IS NULL OR notify_to IS NULL THEN
    RAISE EXCEPTION 'Vault secrets resend_api_key and inquiry_notify_email are required';
  END IF;

  SELECT
    count(*),
    string_agg(
      to_char(created_at AT TIME ZONE 'Asia/Kathmandu', 'Dy DD Mon')
        || ' · ' || brand || ' · ' || name || ' <' || email || '> · ' || budget || ' · ' || status,
      E'\n' ORDER BY created_at DESC
    )
  INTO week_count, lines
  FROM public.inquiries
  WHERE created_at >= now() - interval '7 days';

  SELECT count(*) INTO open_count FROM public.inquiries WHERE status = 'new';

  IF week_count = 0 AND open_count = 0 THEN
    RETURN;
  END IF;

  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', coalesce(sender, 'Portfolio inquiries <onboarding@resend.dev>'),
      'to', jsonb_build_array(notify_to),
      'subject', format('Weekly inquiries: %s new, %s still waiting', week_count, open_count),
      'text', concat_ws(E'\n',
        format('%s collaboration request(s) arrived in the last 7 days.', week_count),
        format('%s request(s) are still marked "new". Change status in the inquiries table once you reply.', open_count),
        '',
        lines
      )
    )
  );
END;
$$;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA private FROM PUBLIC, anon, authenticated;

-- Schedules are in UTC. Re-running this file updates the existing jobs instead of duplicating them.
SELECT cron.schedule('refresh-youtube-stats', '15 0 * * *', 'SELECT private.refresh_youtube_stats()');  -- 6:00 AM Nepal time, daily
SELECT cron.schedule('weekly-inquiry-digest', '15 3 * * 1', 'SELECT private.send_inquiry_digest()');    -- 9:00 AM Nepal time, Mondays
