-- Use the hp-041426 showcase clip as the Aurelia hero video. Idempotent.
UPDATE public.developments
  SET hero_video_url = '/videos/hp-041426.mp4'
  WHERE slug = 'aurelia-damansara-heights';
