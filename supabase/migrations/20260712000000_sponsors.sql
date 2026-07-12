-- Standalone Sponsors table (replaces the sponsored.* keys in site_content).
-- Lets any number of sponsors be managed from the admin. Idempotent.

CREATE TABLE IF NOT EXISTS public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_en text NOT NULL,
  title_zh text,
  subtitle_en text,
  subtitle_zh text,
  description_en text,
  description_zh text,
  badge_en text,
  badge_zh text,
  location_en text,
  location_zh text,
  type_en text,
  type_zh text,
  price_en text,
  price_zh text,
  image_url text,
  video_url text,
  link text,
  sort_order integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view sponsors" ON public.sponsors;
CREATE POLICY "Public can view sponsors" ON public.sponsors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated manage sponsors" ON public.sponsors;
CREATE POLICY "Authenticated manage sponsors" ON public.sponsors FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_sponsors_updated_at ON public.sponsors;
CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed the two existing sponsored projects
INSERT INTO public.sponsors (slug, title_en, title_zh, subtitle_en, subtitle_zh, description_en, description_zh, badge_en, badge_zh, location_en, location_zh, type_en, type_zh, price_en, price_zh, image_url, link, sort_order, published)
VALUES
(
  'imperial-suite', 'The Imperial Suite', '帝国套房', 'Luxury Penthouse Collection', '豪华顶层公寓系列',
  'A luxury condominium set in a quiet alcove that comprises stately royal houses, embassies and official residences in the vicinity. Situated in the heart of Kuala Lumpur, it is well connected via excellent transport infrastructure and lies close to the Petronas Twin Tower and world-class amenities.',
  '这是一个位于安静角落的豪华公寓，周围环绕着庄严的皇家住宅、大使馆和官邸。位于吉隆坡市中心，交通基础设施优良，靠近双子塔和世界级设施。',
  'EXCLUSIVE PREVIEW', '独家预览', 'Kuala Lumpur - KLCC', '吉隆坡 - KLCC', 'Penthouse', '顶层公寓',
  'From $8,880,000', '起价 $8,880,000',
  'https://images.unsplash.com/photo-1433832597046-4f10e10ac764?q=80&w=1200&auto=format&fit=crop',
  '/projects/imperial-suite', 0, true
),
(
  'riverside-estate', 'Riverside Estate', '河畔庄园', 'Waterfront Luxury Living', '滨水豪华生活',
  'Premium waterfront residences with private dock access, infinity pools, and unobstructed river views. Limited collection of only 12 units.',
  '拥有私人码头通道、无边泳池和无遮挡河景的高端滨水住宅。仅限12套房源的收藏版。',
  'COMING SOON', '即将推出', 'Hudson River Valley', '哈德逊河谷', 'Waterfront Villa', '滨水别墅',
  'From $6,200,000', '起价 $6,200,000',
  'https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=1200&auto=format&fit=crop',
  '', 1, true
)
ON CONFLICT (slug) DO NOTHING;

-- Remove the per-project sponsored.* keys from site_content (now managed as Sponsors).
-- Section labels (sponsored.badge/title/viewProject) fall back to the bundled locale files.
DELETE FROM public.site_content WHERE key LIKE 'sponsored.%';
