-- YVITY Gold file uploads (selfies, gallery, intro video, verification, testimonials)
-- Applied via Yvity_Admin; Yvity_Users uploads with service role when Supabase env is set.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'selfies',
    'selfies',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'gallery',
    'gallery',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'intro-video',
    'intro-video',
    true,
    83886080,
    ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v']
  ),
  (
    'verification-docs',
    'verification-docs',
    false,
    8388608,
    ARRAY['application/pdf', 'image/jpeg', 'image/png']
  ),
  (
    'testimonials',
    'testimonials',
    true,
    26214400,
    ARRAY[
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/webm',
      'audio/ogg',
      'audio/mp4',
      'audio/x-m4a',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/ogg'
    ]
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read for visitor-facing assets
DROP POLICY IF EXISTS "Public read yvity selfies" ON storage.objects;
CREATE POLICY "Public read yvity selfies"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'selfies');

DROP POLICY IF EXISTS "Public read yvity gallery" ON storage.objects;
CREATE POLICY "Public read yvity gallery"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Public read yvity intro video" ON storage.objects;
CREATE POLICY "Public read yvity intro video"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'intro-video');

DROP POLICY IF EXISTS "Public read yvity testimonials" ON storage.objects;
CREATE POLICY "Public read yvity testimonials"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'testimonials');

-- verification-docs: no public SELECT — served via app API with service role
