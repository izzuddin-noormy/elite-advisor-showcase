-- ============================================================
-- CMS Expansion Migration
-- Adds rich property fields, insight fields, SEO/FAQ, publish
-- flags, and new tables: site_content, settings, contact_submissions
-- Idempotent: safe to re-run.
-- ============================================================

-- ---------- properties: rich fields ----------
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS property_type text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS overview_en text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS overview_zh text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS gallery jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS schools jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS other_details jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS location_lat double precision;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS location_lng double precision;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS seo jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS published boolean DEFAULT true;
-- baths may be fractional (e.g. 4.5)
ALTER TABLE public.properties ALTER COLUMN baths TYPE numeric USING baths::numeric;

-- ---------- insights: extra fields ----------
ALTER TABLE public.insights ADD COLUMN IF NOT EXISTS author_title text;
ALTER TABLE public.insights ADD COLUMN IF NOT EXISTS seo jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.insights ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.insights ADD COLUMN IF NOT EXISTS published boolean DEFAULT true;

-- ---------- pages: seo + publish ----------
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS seo jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS published boolean DEFAULT true;

-- ---------- site_content: bilingual UI strings ----------
CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  "group" text,
  label text,
  value_en text,
  value_zh text,
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- ---------- settings: global key/value ----------
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ---------- contact_submissions: inbox ----------
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ---------- RLS policies ----------
-- site_content: public read, authenticated manage
DROP POLICY IF EXISTS "Public can view site_content" ON public.site_content;
CREATE POLICY "Public can view site_content" ON public.site_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated manage site_content" ON public.site_content;
CREATE POLICY "Authenticated manage site_content" ON public.site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- settings: public read, authenticated manage
DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated manage settings" ON public.settings;
CREATE POLICY "Authenticated manage settings" ON public.settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- contact_submissions: anyone can insert, only authenticated can read/update/delete
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated read contact" ON public.contact_submissions;
CREATE POLICY "Authenticated read contact" ON public.contact_submissions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated update contact" ON public.contact_submissions;
CREATE POLICY "Authenticated update contact" ON public.contact_submissions FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated delete contact" ON public.contact_submissions;
CREATE POLICY "Authenticated delete contact" ON public.contact_submissions FOR DELETE TO authenticated USING (true);

-- ---------- updated_at triggers ----------
DROP TRIGGER IF EXISTS update_site_content_updated_at ON public.site_content;
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_settings_updated_at ON public.settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
