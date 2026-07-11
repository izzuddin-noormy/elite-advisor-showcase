-- Floor plans / unit types for developments (bilingual). Idempotent.
ALTER TABLE public.developments ADD COLUMN IF NOT EXISTS floorplans jsonb DEFAULT '[]'::jsonb;

UPDATE public.developments SET floorplans = $json$[
  {"label_en":"Type A · Studio Suite","label_zh":"A 型 · 单卧套房","spec_en":"1 Bed · 1 Bath","spec_zh":"1 卧 · 1 浴","size":"549 sq ft","price":"From RM2,800,000"},
  {"label_en":"Type B · 1-Bedroom Deluxe","label_zh":"B 型 · 一卧豪华","spec_en":"1 Bed · 1 Bath","spec_zh":"1 卧 · 1 浴","size":"635 sq ft","price":"From RM3,200,000"},
  {"label_en":"Type C · 1+1 Dual Key","label_zh":"C 型 · 1+1 双钥匙","spec_en":"1+1 Bed · 2 Bath","spec_zh":"1+1 卧 · 2 浴","size":"1,098 sq ft","price":"From RM4,100,000"},
  {"label_en":"Type D · 2-Bedroom","label_zh":"D 型 · 两卧","spec_en":"2 Bed · 2 Bath","spec_zh":"2 卧 · 2 浴","size":"904 sq ft","price":"From RM4,600,000"},
  {"label_en":"Type E · 2-Bedroom Premium","label_zh":"E 型 · 两卧尊尚","spec_en":"2 Bed · 2 Bath","spec_zh":"2 卧 · 2 浴","size":"990 sq ft","price":"From RM5,200,000"},
  {"label_en":"Type F · 3-Bedroom Signature","label_zh":"F 型 · 三卧臻藏","spec_en":"3 Bed · 2 Bath","spec_zh":"3 卧 · 2 浴","size":"1,216 sq ft","price":"From RM6,400,000"}
]$json$::jsonb
WHERE slug = 'aurelia-damansara-heights';
