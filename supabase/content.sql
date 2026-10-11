-- Editable site content. Edit rows in the Supabase Table Editor; the site picks up changes within 5 minutes.
-- Rows sort by sort_order (lowest first). Set visible = false to hide a row without deleting it.
-- Seed rows are only inserted into empty tables, so re-running this file never overwrites edits.

CREATE TABLE IF NOT EXISTS public.site_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  stats_date TEXT NOT NULL,
  -- Path of the media kit PDF inside the `media` storage bucket, e.g. 'media-kit.pdf'.
  media_kit_pdf TEXT,
  youtube_synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  period TEXT NOT NULL
);

-- followers is shown when filled in; highlight_value + highlight_label is the headline number.
CREATE TABLE IF NOT EXISTS public.platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  url TEXT NOT NULL,
  followers TEXT,
  highlight_value TEXT,
  highlight_label TEXT
);

-- tiktok_id is the number at the end of the TikTok video URL.
-- poster_path is an optional cover image inside the `media` storage bucket, e.g. 'posters/medstellar.jpg'.
-- links is a JSON list such as [{"label": "Watch on TikTok ↗", "url": "https://..."}].
CREATE TABLE IF NOT EXISTS public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  brand TEXT NOT NULL,
  platform TEXT NOT NULL,
  views TEXT NOT NULL,
  views_label TEXT NOT NULL,
  title TEXT NOT NULL,
  goal TEXT NOT NULL,
  made TEXT NOT NULL,
  tiktok_id TEXT,
  poster_path TEXT,
  links JSONB NOT NULL DEFAULT '[]',
  quote_text TEXT,
  quote_by TEXT
);

-- id is the YouTube video ID (the part after watch?v=). views is refreshed daily by supabase/cron.sql.
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY,
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('CEE & education', 'Nursing conversations', 'Brand content', 'Student life')),
  duration TEXT NOT NULL,
  views TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Non-sponsored TikTok highlights. id is the TikTok video ID. The section is hidden while this table is empty.
CREATE TABLE IF NOT EXISTS public.short_videos (
  id TEXT PRIMARY KEY,
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  title TEXT NOT NULL,
  views TEXT NOT NULL,
  note TEXT NOT NULL,
  poster_path TEXT
);

-- Anyone may read visible rows; only the dashboard (or the service role) can change them.
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['site_settings', 'stats', 'platforms', 'case_studies', 'videos', 'short_videos'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "Public read" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "Public read" ON public.%I FOR SELECT TO anon, authenticated USING (%s)',
      t,
      CASE WHEN t = 'site_settings' THEN 'true' ELSE 'visible' END
    );
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
  END LOOP;
END $$;

-- Seed data (copied from lib/portfolio.ts)

INSERT INTO public.site_settings (id, stats_date)
VALUES (1, '10 October 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.stats (sort_order, value, label, period)
SELECT * FROM (VALUES
  (1, '313.4K', 'TikTok video views', 'Last 60 days'),
  (2, '80.8K', 'YouTube views', 'Last 90 days'),
  (3, '5', 'Paid brand collaborations', 'To date'),
  (4, '3M', 'Views on my top TikTok', 'One video, lifetime')
) AS v(sort_order, value, label, period)
WHERE NOT EXISTS (SELECT 1 FROM public.stats);

INSERT INTO public.platforms (sort_order, name, handle, url, followers, highlight_value, highlight_label)
SELECT * FROM (VALUES
  (1, 'TikTok', '@namratadahal62', 'https://www.tiktok.com/@namratadahal62', NULL, '313.4K', 'views in the last 60 days'),
  (2, 'YouTube', '@namrata_dahal', 'https://www.youtube.com/@namrata_dahal', '1.43K subscribers', '80.8K', 'views in the last 90 days'),
  (3, 'Instagram', '@namrata_dahal11', 'https://www.instagram.com/namrata_dahal11', NULL, '234.8K', 'views in the last 90 days'),
  (4, 'Facebook', 'namrata.dahal.653570', 'https://www.facebook.com/namrata.dahal.653570', NULL, '50.2K', 'views in the last 90 days')
) AS v(sort_order, name, handle, url, followers, highlight_value, highlight_label)
WHERE NOT EXISTS (SELECT 1 FROM public.platforms);

INSERT INTO public.case_studies (sort_order, brand, platform, views, views_label, title, goal, made, tiktok_id, links)
SELECT * FROM (VALUES
  (1, 'MedStellar', 'TikTok', '50.2K', 'TikTok video views',
    'BSc Nursing scholarships',
    'Reach students asking how to earn a BSc Nursing scholarship.',
    'A question-led video on getting a BSc Nursing scholarship, with MedStellar introduced as the place to prepare for it.',
    '7636764523038297365',
    '[{"label": "Watch on TikTok ↗", "url": "https://www.tiktok.com/@namratadahal62/video/7636764523038297365"}]'::jsonb),
  (2, 'IndoGlobal', 'TikTok', '22.5K', 'TikTok video views',
    'CEE form-filling support',
    'Make CEE applicants aware of a free form-filling support service.',
    'A practical explainer showing students what help was available and how to use it.',
    '7672745041143647489',
    '[{"label": "Watch on TikTok ↗", "url": "https://www.tiktok.com/@namratadahal62/video/7672745041143647489"}]'::jsonb),
  (3, 'MakerHub', 'TikTok · YouTube', '12.9K', 'TikTok video views, plus a YouTube launch video',
    'Preparation platform launch',
    'Introduce a new preparation platform to nursing, MBBS and engineering aspirants.',
    'A TikTok introduction and a 4-minute YouTube launch video built around what students need before their exam.',
    '7659762819407056146',
    '[{"label": "Watch on TikTok ↗", "url": "https://www.tiktok.com/@namratadahal62/video/7659762819407056146"}, {"label": "Watch the YouTube launch ↗", "url": "https://www.youtube.com/watch?v=3DzOWLZ9ofs"}]'::jsonb),
  (4, 'Entrance Nepal', 'TikTok', '9,177', 'TikTok video views',
    'Last-month preparation',
    'Reach students in their final month before the entrance exam.',
    'A short video introducing QAD classes and concept videos around that last-month need.',
    '7660922533733993745',
    '[{"label": "Watch on TikTok ↗", "url": "https://www.tiktok.com/@namratadahal62/video/7660922533733993745"}]'::jsonb)
) AS v(sort_order, brand, platform, views, views_label, title, goal, made, tiktok_id, links)
WHERE NOT EXISTS (SELECT 1 FROM public.case_studies);

INSERT INTO public.videos (sort_order, id, title, category, duration, views, description)
SELECT * FROM (VALUES
  (1, '58OftPZoVlo', 'How I Got FULL Scholarship in BSc Nursing CEE Nepal 🇳🇵 | My Journey + Study Tips', 'CEE & education', '11:39', '14K',
    'My scholarship journey and the preparation lessons I share with aspiring nursing students.'),
  (2, 'uqbJc5KVKJg', 'Before You Choose BSc Nursing in Nepal… Watch This 🩺 | Real Student Experience', 'Nursing conversations', '19:44', '2.9K',
    'A student-to-student conversation about the experience of choosing and studying nursing.'),
  (3, '3DzOWLZ9ofs', 'Every Nursing, MBBS & Engineering Student Needs to See This Before their Exam | MakerHub Launch 🇳🇵', 'Brand content', '4:41', '798',
    'An introduction to MakerHub, presented around the needs of students preparing for entrance exams.'),
  (4, 'Ue8YgZ8UjNc', 'Only 4 Weeks Left for CEE 2026 😳 | Exact Final Preparation Strategy | BSc Nursing + MBBS', 'CEE & education', '10:44', '7.4K',
    'A focused preparation-strategy video for CEE aspirants approaching their exam.'),
  (5, 'ZfksKWzbz2A', 'BSc Nursing in Nepal | Actual Fees, Hostel Expenses | Scholarship vs Paying', 'Nursing conversations', '16:01', '8.5K',
    'A practical conversation about nursing costs, hostel expenses, and scholarship versus paying seats.'),
  (6, 'froxun4vDGc', 'A Day in the Life of a Nursing Student in Nepal | Exam Preparation, Classes & Night Duty 🩺', 'Student life', '11:16', '1.6K',
    'A look at the study, classes, and duty that shape everyday life as a nursing student.'),
  (7, 'Z21up-amqdg', 'My CEE Journey 🇳🇵 | How I Prepared, My Rank, Study Routine, Books & Strategy | CEE Nepal', 'CEE & education', '10:16', '4.3K',
    'A personal account of preparing for CEE, including routines, resources, and study strategy.'),
  (8, 'XwWTXE9ZL1Q', 'नेपालमा ३० हजार, USA, UK, Australia मा __ लाख? Nurse Salary Comparison', 'Nursing conversations', '9:39', '2.6K',
    'A nursing-career conversation comparing salary headlines across countries. Figures reflect the video’s context and may change.')
) AS v(sort_order, id, title, category, duration, views, description)
WHERE NOT EXISTS (SELECT 1 FROM public.videos);

NOTIFY pgrst, 'reload schema';
