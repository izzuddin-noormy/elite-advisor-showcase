-- ============================================================
-- New Launch / Developments
-- A dedicated table for new-launch development projects rendered
-- with the "Aurelia" landing template. Bilingual (EN/中文).
-- Includes a seed row for "Aurelia Damansara Heights".
-- Idempotent.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.developments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_zh text NOT NULL,
  tagline_en text,
  tagline_zh text,
  location_en text,
  location_zh text,
  status_en text DEFAULT 'New Launch',
  status_zh text DEFAULT '全新发布',
  price_from text,
  tenure_en text,
  tenure_zh text,
  completion text,
  developer_en text,
  developer_zh text,
  hero_image text,
  hero_video_url text,
  overview_en text,
  overview_zh text,
  highlights jsonb DEFAULT '[]'::jsonb,   -- [{title_en,title_zh,desc_en,desc_zh}]
  specs jsonb DEFAULT '[]'::jsonb,        -- [{label_en,label_zh,value_en,value_zh}]
  connectivity jsonb DEFAULT '[]'::jsonb, -- [{text_en,text_zh}]
  location_lat double precision,
  location_lng double precision,
  gallery jsonb DEFAULT '[]'::jsonb,      -- [url]
  seo jsonb DEFAULT '{}'::jsonb,
  faqs jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT true,
  published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.developments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view developments" ON public.developments;
CREATE POLICY "Public can view developments" ON public.developments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated manage developments" ON public.developments;
CREATE POLICY "Authenticated manage developments" ON public.developments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_developments_updated_at ON public.developments;
CREATE TRIGGER update_developments_updated_at
  BEFORE UPDATE ON public.developments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ---------- Seed: Aurelia Damansara Heights ----------
INSERT INTO public.developments (
  slug, name_en, name_zh, tagline_en, tagline_zh, location_en, location_zh,
  status_en, status_zh, price_from, tenure_en, tenure_zh, completion, developer_en, developer_zh,
  hero_image, overview_en, overview_zh, highlights, specs, connectivity,
  location_lat, location_lng, gallery, seo, faqs, featured, published, sort_order
) VALUES (
  'aurelia-damansara-heights',
  'Aurelia Damansara Heights', '奥雷利亚白沙罗高原',
  'Elevated living above the city''s most coveted enclave', '坐落于城中最受追捧领地之上的尊崇生活',
  'Damansara Heights, Kuala Lumpur', '吉隆坡白沙罗高原',
  'New Launch', '全新发布',
  'From RM2,800,000', 'Freehold', '永久地契', 'Expected completion 2028',
  'Aurelia Development Sdn Bhd', 'Aurelia Development Sdn Bhd',
  '/images/imperial-0.jpg',
  '<p>Aurelia Damansara Heights is a limited collection of freehold residences rising above one of Kuala Lumpur''s most prestigious low-density neighbourhoods. Designed for the discerning few, every residence is crafted with floor-to-ceiling glass, private lift lobbies, and sweeping views over the KL skyline and the green ridges of Bukit Tunku.</p><p>A sanctuary of calm minutes from the city core, Aurelia pairs architectural restraint with resort-grade amenities and a level of service more often found in the world''s finest hotels.</p>',
  '<p>奥雷利亚白沙罗高原是一组数量有限的永久地契住宅，矗立于吉隆坡最负盛名的低密度社区之上。每一户都以落地玻璃、私人电梯厅以及饱览吉隆坡天际线与武吉端姑绿意山脊的开阔视野精心打造，专为少数识家而设。</p><p>距离城市核心仅数分钟之遥，奥雷利亚将简约的建筑美学与度假级设施相融合，提供媲美世界顶级酒店的尊贵服务。</p>',
  '[
    {"title_en":"Private Sky Villas","title_zh":"私人空中别墅","desc_en":"A limited collection of duplex sky villas with private plunge pools and panoramic terraces.","desc_zh":"数量有限的复式空中别墅，配有私人泳池与全景露台。"},
    {"title_en":"Resort Amenities","title_zh":"度假式设施","desc_en":"Infinity pool, sky gymnasium, spa suites, private dining and a residents'' lounge.","desc_zh":"无边泳池、云端健身房、水疗套房、私人宴会厅及住户会所。"},
    {"title_en":"Smart & Sustainable","title_zh":"智能与可持续","desc_en":"Integrated smart-home systems and GreenRE-targeted design for lower running costs.","desc_zh":"集成智能家居系统，并以 GreenRE 绿色认证为目标，降低运营成本。"},
    {"title_en":"White-Glove Service","title_zh":"顶级礼宾服务","desc_en":"24-hour concierge, valet and dedicated residence management.","desc_zh":"24 小时礼宾、代客泊车及专属住宅管理服务。"}
  ]'::jsonb,
  '[
    {"label_en":"Tenure","label_zh":"地契","value_en":"Freehold","value_zh":"永久地契"},
    {"label_en":"Unit Types","label_zh":"单位类型","value_en":"2 – 4 Bedrooms & Sky Villas","value_zh":"2 – 4 卧室及空中别墅"},
    {"label_en":"Built-up","label_zh":"建筑面积","value_en":"1,190 – 3,850 sq ft","value_zh":"1,190 – 3,850 平方英尺"},
    {"label_en":"Total Units","label_zh":"总单位数","value_en":"128 exclusive residences","value_zh":"128 户尊尚住宅"},
    {"label_en":"Completion","label_zh":"竣工","value_en":"2028","value_zh":"2028 年"}
  ]'::jsonb,
  '[
    {"text_en":"3 min to Pusat Bandar Damansara MRT","text_zh":"3 分钟至白沙罗中心 MRT 站"},
    {"text_en":"8 min to KL city centre & KLCC","text_zh":"8 分钟至吉隆坡市中心及 KLCC"},
    {"text_en":"Direct access via SPRINT & Penchala Link","text_zh":"经 SPRINT 与 Penchala Link 直达"},
    {"text_en":"Minutes to international schools & Bangsar","text_zh":"数分钟至国际学校及孟沙区"}
  ]'::jsonb,
  3.1476, 101.6640,
  '["/images/imperial-1.jpg","/images/imperial-2.jpg","/images/imperial-3.jpg","/images/imperial-4.jpg","/images/imperial-5.jpg","/images/imperial-0.jpg"]'::jsonb,
  '{"meta_title_en":"Aurelia Damansara Heights — New Launch Freehold Residences | Mu SiChen","meta_title_zh":"奥雷利亚白沙罗高原 — 全新永久地契住宅 | Mu SiChen","meta_description_en":"Aurelia Damansara Heights: limited freehold sky villas and residences in Kuala Lumpur. From RM2.8M. Register your interest.","meta_description_zh":"奥雷利亚白沙罗高原：吉隆坡数量有限的永久地契空中别墅与住宅，售价 RM2.8M 起。立即登记您的兴趣。","keywords":"Aurelia Damansara Heights, new launch Kuala Lumpur, freehold condo KL","og_image":"/images/imperial-0.jpg"}'::jsonb,
  '[
    {"q_en":"What is the tenure of Aurelia Damansara Heights?","q_zh":"奥雷利亚白沙罗高原的地契是什么？","a_en":"Aurelia is a freehold development.","a_zh":"奥雷利亚为永久地契发展项目。"},
    {"q_en":"When is completion expected?","q_zh":"预计何时竣工？","a_en":"Expected completion is 2028.","a_zh":"预计于 2028 年竣工。"}
  ]'::jsonb,
  true, true, 0
) ON CONFLICT (slug) DO NOTHING;
