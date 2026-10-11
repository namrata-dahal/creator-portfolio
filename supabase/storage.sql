-- Public `media` bucket for the media kit PDF and video cover images.
-- Upload files from the Supabase dashboard (Storage > media). Files are publicly downloadable by URL,
-- but with no storage policies visitors cannot list, upload, change or delete anything.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  20971520,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
