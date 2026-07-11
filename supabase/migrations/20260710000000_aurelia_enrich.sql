-- Enrich the Aurelia Damansara Heights development with richer bilingual
-- content and a larger gallery. Original copy (reference-inspired). Idempotent.
UPDATE public.developments SET
  overview_en = $$<p>Aurelia Damansara Heights is a boutique collection of freehold, hotel-managed residences on one of Kuala Lumpur's last low-density ridgelines. Studio to three-bedroom homes — several dual-key — are wrapped in floor-to-ceiling glass with panoramic views over the city and the green of Bukit Tunku.</p>$$,
  overview_zh = $$<p>奥雷利亚白沙罗高原是一组精品永久地契、酒店管理式住宅，坐落于吉隆坡最后几处低密度山脊之一。从单卧室到三卧室（部分为双钥匙户型），皆以落地玻璃环绕，饱览城市天际线与武吉端姑的葱郁绿意。</p>$$,
  highlights = $json$[
    {"title_en":"Hotel-Managed Living","title_zh":"酒店管理式生活","desc_en":"An international hotel partner brings 24-hour concierge, valet, housekeeping and in-residence dining to every home.","desc_zh":"国际酒店伙伴为每户带来 24 小时礼宾、代客泊车、客房清洁及入户餐饮服务。"},
    {"title_en":"Three Levels of Amenities","title_zh":"三层专属设施","desc_en":"A sky pool, floating lounge and sky dining crown the tower; wellness studios, a golf simulator and family lounges sit within.","desc_zh":"空中泳池、悬浮休息厅与空中餐厅冠绝塔顶；康养工作室、高尔夫模拟器与家庭休息厅错落其间。"},
    {"title_en":"Designer Specification","title_zh":"名家规格","desc_en":"Gaggenau kitchens, Gessi fittings and Laufen sanitaryware, with integrated smart-home and Yale digital locks as standard.","desc_zh":"Gaggenau 厨房、Gessi 卫浴配件与 Laufen 洁具，标配集成智能家居与 Yale 数码门锁。"},
    {"title_en":"Freehold & Investor-Ready","title_zh":"永久地契 · 投资首选","desc_en":"A rare freehold title with dual-key layouts and MM2H-friendly ownership for international buyers.","desc_zh":"稀有永久地契，提供双钥匙户型及适合 MM2H 的产权，欢迎国际买家。"}
  ]$json$::jsonb,
  specs = $json$[
    {"label_en":"Tenure","label_zh":"地契","value_en":"Freehold","value_zh":"永久地契"},
    {"label_en":"Unit Types","label_zh":"户型","value_en":"Studio – 3 Bedrooms & Dual-Key","value_zh":"单卧室 – 三卧室及双钥匙"},
    {"label_en":"Built-up","label_zh":"建筑面积","value_en":"549 – 1,850 sq ft","value_zh":"549 – 1,850 平方英尺"},
    {"label_en":"Residences","label_zh":"住宅数量","value_en":"128 exclusive homes","value_zh":"128 户尊尚住宅"},
    {"label_en":"Completion","label_zh":"竣工","value_en":"2028","value_zh":"2028 年"}
  ]$json$::jsonb,
  connectivity = $json$[
    {"text_en":"3 min to Pusat Bandar Damansara MRT","text_zh":"3 分钟至白沙罗中心 MRT 站"},
    {"text_en":"8 min to KLCC & the city centre","text_zh":"8 分钟至 KLCC 及市中心"},
    {"text_en":"Direct access via SPRINT & Penchala Link","text_zh":"经 SPRINT 与 Penchala Link 直达"},
    {"text_en":"Minutes to Bangsar, international schools & Gleneagles","text_zh":"数分钟至孟沙、国际学校及鹰阁医院"}
  ]$json$::jsonb,
  gallery = $json$[
    "/images/imperial-0.jpg","/images/imperial-1.jpg","/images/imperial-2.jpg","/images/imperial-3.jpg","/images/imperial-4.jpg","/images/imperial-5.jpg",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop"
  ]$json$::jsonb
WHERE slug = 'aurelia-damansara-heights';
