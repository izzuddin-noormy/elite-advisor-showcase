-- Optional video for a property. When set, the detail page shows an embedded
-- video (YouTube, Vimeo, or direct file) in place of the main hero image.
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS video_url text;
