/**
 * Seed script for the Mu SiChen CMS.
 * Populates site_content (from locale files), settings, properties and insights.
 * Idempotent: upserts on unique keys / slugs.
 *
 * Usage:  PGURL="postgres://...:5432/postgres" node scripts/seed.mjs
 * (Use the Supabase "Session" / non-pooling connection string on port 5432.)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const en = JSON.parse(fs.readFileSync(path.join(root, 'src/locales/en.json'), 'utf8'));
const zh = JSON.parse(fs.readFileSync(path.join(root, 'src/locales/zh.json'), 'utf8'));

if (!process.env.PGURL) {
  console.error('Missing PGURL env var (Supabase Postgres connection string).');
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.PGURL, ssl: { rejectUnauthorized: false } });

// ---- flatten locale objects into dot.keys ----
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}
const flatEn = flatten(en);
const flatZh = flatten(zh);

// ---- properties ----
const properties = [
  {
    slug: 'imperial-suite',
    title_en: 'The Imperial Suite', title_zh: '帝国套房',
    property_type: 'Penthouse',
    price: 8880000, location: 'KLCC, Kuala Lumpur', address: 'Jalan Ampang, KLCC, 50450 Kuala Lumpur',
    beds: 5, baths: 4.5, sqft: 4200, status: 'available', featured: true, published: true,
    image_url: '/images/imperial-0.jpg',
    gallery: ['/images/imperial-0.jpg', '/images/imperial-1.jpg', '/images/imperial-2.jpg', '/images/imperial-5.jpg', '/images/imperial-4.jpg'],
    description_en: 'A luxury condominium set in a quiet alcove that comprises stately royal houses, embassies and official residences in the vicinity. Situated in the heart of Kuala Lumpur, it is well connected via excellent transport infrastructure and lies close to the Petronas Twin Towers and world-class amenities.',
    description_zh: '这是一座坐落于宁静角落的豪华公寓，周围环绕着庄严的皇家住宅、大使馆和官邸。位于吉隆坡市中心，交通基础设施优越，紧邻双子塔和世界级设施。',
    overview_en: 'This exceptional penthouse offers unparalleled luxury living in one of the most prestigious locations in the city. The spacious layout features floor-to-ceiling windows, premium finishes, and breathtaking city views. The gourmet kitchen is equipped with top-of-the-line appliances, while the master suite boasts a private terrace and spa-like bathroom. Additional amenities include a private elevator, smart home technology, and access to exclusive building facilities including a rooftop pool, fitness center, and concierge services.',
    overview_zh: '这套非凡的顶层公寓坐落于城市最负盛名的地段之一，提供无与伦比的奢华生活。宽敞的布局配有落地窗、高端装潢和令人惊叹的城市景观。美食厨房配备顶级电器，主人套房拥有私人露台和水疗式浴室。其他设施包括私人电梯、智能家居技术，以及屋顶泳池、健身中心和礼宾服务等专属设施。',
    features: {
      interior_en: ['Hardwood Floors', 'Granite Countertops', 'Stainless Steel Appliances', 'Walk-in Closets', 'Fireplace', 'Central Air', 'High Ceilings'],
      interior_zh: ['实木地板', '花岗岩台面', '不锈钢电器', '步入式衣橱', '壁炉', '中央空调', '高天花板'],
      exterior_en: ['Private Terrace', 'City Views', 'Balcony', 'Rooftop Access'],
      exterior_zh: ['私人露台', '城市景观', '阳台', '屋顶通道'],
      style_en: 'Contemporary', style_zh: '现代', lot_size: '0.25 acres'
    },
    schools: {
      elementary: [{ name: 'Sri Hartamas International', rating: 9, distance: '0.3 miles' }, { name: 'ISKL Primary', rating: 8, distance: '0.5 miles' }],
      high_school: [{ name: 'Garden International School', rating: 9, distance: '0.8 miles' }, { name: 'Alice Smith School', rating: 8, distance: '1.2 miles' }]
    },
    other_details: {
      days_on_market: 45, year_built: 2019,
      garage_en: '2-car covered', garage_zh: '2 车位有盖车库',
      accessibility_en: ['Elevator Access', 'Wide Doorways', 'Accessible Bathroom'], accessibility_zh: ['电梯通道', '宽门', '无障碍浴室'],
      heating_en: 'Central Heating', heating_zh: '中央供暖', cooling_en: 'Central Air Conditioning', cooling_zh: '中央空调'
    },
    location_lat: 3.1578, location_lng: 101.7123,
    seo: {
      meta_title_en: 'The Imperial Suite — Luxury KLCC Penthouse | Mu SiChen',
      meta_title_zh: '帝国套房 — KLCC 豪华顶层公寓 | Mu SiChen',
      meta_description_en: '5-bed luxury penthouse in the heart of KLCC, Kuala Lumpur. Floor-to-ceiling views, private elevator and rooftop pool.',
      meta_description_zh: '位于吉隆坡 KLCC 中心的 5 房豪华顶层公寓，落地景观、私人电梯及屋顶泳池。',
      keywords: 'KLCC penthouse, luxury property Kuala Lumpur, Petronas Towers residence', og_image: '/images/imperial-0.jpg'
    },
    faqs: [
      { q_en: 'Is the Imperial Suite pet-friendly?', q_zh: '帝国套房允许养宠物吗？', a_en: 'Yes, the building permits small pets subject to management guidelines.', a_zh: '可以，大厦允许饲养小型宠物，但须遵守管理规定。' },
      { q_en: 'What is included in the maintenance fee?', q_zh: '管理费包含哪些内容？', a_en: 'Access to the rooftop pool, fitness center, 24-hour security and concierge services.', a_zh: '包括屋顶泳池、健身中心、24 小时保安及礼宾服务。' }
    ]
  },
  {
    slug: 'georgetown-estate',
    title_en: 'Damansara Heights Estate', title_zh: '白沙罗高原庄园',
    property_type: 'Estate',
    price: 4850000, location: 'Damansara Heights, Kuala Lumpur', address: 'Jalan Setiakasih, Damansara Heights, 50490 Kuala Lumpur',
    beds: 5, baths: 4.5, sqft: 4200, status: 'available', featured: true, published: true,
    image_url: '/images/imperial-1.jpg',
    gallery: ['/images/imperial-1.jpg', '/images/imperial-2.jpg', '/images/imperial-3.jpg'],
    description_en: "Exquisite Damansara Heights estate featuring original hardwood floors, chef's kitchen, and private garden.",
    description_zh: '精致的白沙罗高原庄园，配有原装实木地板、大厨厨房和私人花园。',
    overview_en: "This magnificent estate combines timeless charm with modern luxury. The property features refined architectural details, premium finishes, and a beautifully landscaped private garden. The chef's kitchen is equipped with professional-grade appliances, while the spacious living areas offer elegant entertaining spaces.",
    overview_zh: '这座宏伟的庄园将永恒的魅力与现代奢华融为一体。房产拥有精致的建筑细节、高端装潢和精心打理的私人花园。大厨厨房配备专业级电器，宽敞的起居区提供优雅的招待空间。',
    features: {
      interior_en: ['Original Hardwood Floors', "Chef's Kitchen", 'Crown Molding', 'Marble Bathrooms', 'Wine Cellar'],
      interior_zh: ['原装实木地板', '大厨厨房', '顶角线装饰', '大理石浴室', '酒窖'],
      exterior_en: ['Private Garden', 'Covered Patio', 'Landscaped Grounds'],
      exterior_zh: ['私人花园', '有盖露台', '园林绿化'],
      style_en: 'Classic Contemporary', style_zh: '经典现代', lot_size: '0.18 acres'
    },
    schools: {
      elementary: [{ name: 'Sri Cempaka', rating: 9, distance: '0.2 miles' }],
      high_school: [{ name: 'Sekolah Sri Bestari', rating: 9, distance: '0.5 miles' }]
    },
    other_details: {
      days_on_market: 30, year_built: 2015,
      garage_en: '2-car detached', garage_zh: '2 车位独立车库',
      accessibility_en: ['Wide Doorways'], accessibility_zh: ['宽门'],
      heating_en: 'N/A', heating_zh: '不适用', cooling_en: 'Central Air', cooling_zh: '中央空调'
    },
    location_lat: 3.1478, location_lng: 101.6653,
    seo: {
      meta_title_en: 'Damansara Heights Estate | Mu SiChen', meta_title_zh: '白沙罗高原庄园 | Mu SiChen',
      meta_description_en: '5-bed luxury estate in Damansara Heights with private garden and wine cellar.',
      meta_description_zh: '白沙罗高原 5 房豪华庄园，配有私人花园和酒窖。',
      keywords: 'Damansara Heights, luxury estate Kuala Lumpur', og_image: '/images/imperial-1.jpg'
    },
    faqs: []
  },
  {
    slug: 'bethesda-contemporary',
    title_en: 'Mont Kiara Contemporary', title_zh: '满家乐现代住宅',
    property_type: 'Contemporary',
    price: 3200000, location: 'Mont Kiara, Kuala Lumpur', address: 'Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur',
    beds: 4, baths: 3.5, sqft: 3800, status: 'under_contract', featured: true, published: true,
    image_url: '/images/imperial-4.jpg',
    gallery: ['/images/imperial-4.jpg', '/images/imperial-5.jpg', '/images/imperial-0.jpg'],
    description_en: 'Modern luxury home with floor-to-ceiling windows, open concept design, and premium finishes.',
    description_zh: '现代豪华住宅，配有落地窗、开放式设计和高端装潢。',
    overview_en: 'This stunning contemporary home showcases modern design at its finest. Floor-to-ceiling windows flood the space with natural light, while the open concept layout creates seamless flow between living areas. Premium finishes and smart home technology throughout.',
    overview_zh: '这座令人惊艳的现代住宅展现了极致的现代设计。落地窗让空间充满自然光，开放式布局在各起居区之间营造出流畅的动线。全屋采用高端装潢和智能家居技术。',
    features: {
      interior_en: ['Floor-to-Ceiling Windows', 'Open Concept', 'Smart Home Technology', 'Italian Kitchen'],
      interior_zh: ['落地窗', '开放式概念', '智能家居技术', '意大利厨房'],
      exterior_en: ['Modern Architecture', 'Landscaped Yard', 'Three-Car Garage'],
      exterior_zh: ['现代建筑', '园林庭院', '三车位车库'],
      style_en: 'Contemporary', style_zh: '现代', lot_size: '0.22 acres'
    },
    schools: {
      elementary: [{ name: 'Mont Kiara International', rating: 8, distance: '0.4 miles' }],
      high_school: [{ name: 'Garden International', rating: 9, distance: '0.8 miles' }]
    },
    other_details: {
      days_on_market: 25, year_built: 2020,
      garage_en: '3-car attached', garage_zh: '3 车位连接车库',
      accessibility_en: ['Elevator', 'Accessible Entrance'], accessibility_zh: ['电梯', '无障碍入口'],
      heating_en: 'N/A', heating_zh: '不适用', cooling_en: 'Zoned HVAC', cooling_zh: '分区空调'
    },
    location_lat: 3.1712, location_lng: 101.6509,
    seo: {
      meta_title_en: 'Mont Kiara Contemporary | Mu SiChen', meta_title_zh: '满家乐现代住宅 | Mu SiChen',
      meta_description_en: '4-bed contemporary home in Mont Kiara with smart home technology and open concept living.',
      meta_description_zh: '满家乐 4 房现代住宅，配备智能家居技术和开放式起居空间。',
      keywords: 'Mont Kiara, contemporary home Kuala Lumpur', og_image: '/images/imperial-4.jpg'
    },
    faqs: []
  },
  {
    slug: 'mclean-luxury-home',
    title_en: 'Bukit Tunku Luxury Home', title_zh: '武吉端姑豪华住宅',
    property_type: 'Bungalow',
    price: 5750000, location: 'Bukit Tunku, Kuala Lumpur', address: 'Jalan Langgak Tunku, Bukit Tunku, 50480 Kuala Lumpur',
    beds: 6, baths: 5.5, sqft: 5200, status: 'available', featured: true, published: true,
    image_url: '/images/imperial-2.jpg',
    gallery: ['/images/imperial-2.jpg', '/images/imperial-3.jpg', '/images/imperial-1.jpg'],
    description_en: 'A grand bungalow in the exclusive low-density enclave of Bukit Tunku, offering privacy, mature landscaping and timeless architecture.',
    description_zh: '位于武吉端姑专属低密度住宅区的宏伟独立式洋房，提供私密性、成熟的园林景观和永恒的建筑风格。',
    overview_en: 'Set within one of Kuala Lumpur’s most prestigious and greenest enclaves, this six-bedroom residence blends grand proportions with warm, liveable spaces. Expansive reception rooms open onto a landscaped garden and pool, while the upper floors offer private family quarters with garden and city views.',
    overview_zh: '这座六卧室住宅坐落于吉隆坡最负盛名、最绿意盎然的住宅区之一，将宏大的空间比例与温馨宜居的空间融为一体。宽敞的会客厅通向园林花园和泳池，楼上则设有私人家庭区，可饱览花园和城市景观。',
    features: {
      interior_en: ['Double-Height Foyer', 'Home Theatre', 'Wine Room', 'Marble Flooring', 'Private Lift'],
      interior_zh: ['双层挑高门厅', '家庭影院', '酒室', '大理石地板', '私人电梯'],
      exterior_en: ['Swimming Pool', 'Mature Garden', 'Gated Compound', 'Covered Parking'],
      exterior_zh: ['游泳池', '成熟花园', '封闭式庭院', '有盖停车位'],
      style_en: 'Modern Classic', style_zh: '现代经典', lot_size: '0.5 acres'
    },
    schools: {
      elementary: [{ name: 'ISKL', rating: 9, distance: '1.0 miles' }],
      high_school: [{ name: 'Garden International', rating: 9, distance: '1.5 miles' }]
    },
    other_details: {
      days_on_market: 12, year_built: 2018,
      garage_en: '4-car covered', garage_zh: '4 车位有盖车库',
      accessibility_en: ['Private Lift', 'Wide Doorways'], accessibility_zh: ['私人电梯', '宽门'],
      heating_en: 'N/A', heating_zh: '不适用', cooling_en: 'Central Air Conditioning', cooling_zh: '中央空调'
    },
    location_lat: 3.1652, location_lng: 101.6841,
    seo: {
      meta_title_en: 'Bukit Tunku Luxury Bungalow | Mu SiChen', meta_title_zh: '武吉端姑豪华洋房 | Mu SiChen',
      meta_description_en: '6-bed luxury bungalow in Bukit Tunku with pool, home theatre and private lift.',
      meta_description_zh: '武吉端姑 6 房豪华洋房，配有泳池、家庭影院和私人电梯。',
      keywords: 'Bukit Tunku bungalow, luxury home Kuala Lumpur', og_image: '/images/imperial-2.jpg'
    },
    faqs: []
  }
];

// ---- insights ----
const insights = [
  {
    slug: 'kl-market-trends-luxury-buyers',
    title_en: 'Market Trends in Kuala Lumpur: What Luxury Buyers Need to Know',
    title_zh: '吉隆坡市场趋势：豪宅买家须知',
    excerpt_en: 'An in-depth analysis of the Kuala Lumpur luxury market, including recent sales data and emerging trends that discerning buyers should understand.',
    excerpt_zh: '深入分析吉隆坡豪华房地产市场，包括近期成交数据以及高端买家应了解的新兴趋势。',
    category: 'Market Analysis', author: 'Mu SiChen', author_title: 'Senior Real-Estate Negotiator',
    read_time: 6, featured: true, published: true, image_url: '/images/imperial-0.jpg',
    published_at: '2025-04-04',
    content_en: `<h3>Key Market Trends</h3><p><strong>1) Prime rents are rising faster than prices.</strong> Independent trackers report double-digit rental growth in KL's prime segment over the past year, outpacing capital value gains.</p><p><strong>2) Stabilisation with a supply squeeze at the top end.</strong> Developers have been cautious on new launches, supporting pricing and rental resilience.</p><p><strong>3) Branded, transit-linked addresses keep winning.</strong> Projects like TRX Residences and Pavilion Damansara Heights highlight demand for integrated luxury.</p><h3>Investment Outlook</h3><p>Prime residential yields hover around 3.5%, with rental growth outpacing capital appreciation. Supply discipline and a steady ringgit underpin market confidence.</p>`,
    content_zh: `<h3>主要市场趋势</h3><p><strong>1) 高端租金涨幅快于房价。</strong> 独立机构数据显示，过去一年吉隆坡高端市场租金实现两位数增长，超过资本价值涨幅。</p><p><strong>2) 高端供应收紧下的市场趋稳。</strong> 发展商对新盘持谨慎态度，支撑了价格与租金韧性。</p><p><strong>3) 品牌化、临近交通的地址持续胜出。</strong> TRX Residences 和 Pavilion Damansara Heights 等项目凸显了对综合豪宅的需求。</p><h3>投资前景</h3><p>高端住宅收益率约为 3.5%，租金增长超过资本增值。供应纪律与稳定的令吉支撑着市场信心。</p>`,
    seo: {
      meta_title_en: 'KL Luxury Market Trends for Buyers | Mu SiChen', meta_title_zh: '吉隆坡豪宅市场趋势 | Mu SiChen',
      meta_description_en: 'Recent sales data and emerging trends in the Kuala Lumpur luxury property market.',
      meta_description_zh: '吉隆坡豪华房地产市场近期成交数据与新兴趋势。',
      keywords: 'KL luxury market, Kuala Lumpur property trends', og_image: '/images/imperial-0.jpg'
    },
    faqs: [
      { q_en: 'What yields can luxury KL properties achieve?', q_zh: '吉隆坡豪宅能达到怎样的收益率？', a_en: 'Prime residential yields currently hover around 3.5%, with rental growth outpacing capital appreciation.', a_zh: '目前高端住宅收益率约为 3.5%，租金增长超过资本增值。' }
    ]
  },
  {
    slug: 'mastering-luxury-negotiations',
    title_en: 'Mastering Luxury Real Estate Negotiations',
    title_zh: '掌握豪华房地产谈判',
    excerpt_en: 'A strategic guide to negotiating luxury real estate transactions, focusing on buyer psychology, key strategies, common pitfalls, and the importance of professional representation.',
    excerpt_zh: '一份关于豪华房地产交易谈判的战略指南，聚焦买家心理、关键策略、常见误区以及专业代理的重要性。',
    category: 'Strategy', author: 'Mu SiChen', author_title: 'Senior Real-Estate Negotiator',
    read_time: 5, featured: true, published: true, image_url: '/images/imperial-1.jpg',
    published_at: '2025-07-06',
    content_en: `<p>Negotiating luxury transactions requires a blend of market knowledge, psychological insight, and strategic thinking.</p><h3>Understanding the Luxury Buyer Mindset</h3><p>Luxury buyers are typically less price-sensitive but more value-conscious. They seek exclusivity, quality, and unique features that justify premium pricing.</p><h3>Key Negotiation Strategies</h3><ul><li>Conduct thorough market analysis and review comparable sales</li><li>Understand the seller's motivations and timeline</li><li>Leverage unique property features and benefits</li><li>Structure creative deal terms beyond just price</li></ul>`,
    content_zh: `<p>豪华房地产交易谈判需要市场知识、心理洞察和战略思维的结合。</p><h3>理解豪宅买家的心态</h3><p>豪宅买家通常对价格不太敏感，但更注重价值。他们追求专属性、品质以及能够支撑溢价的独特特色。</p><h3>关键谈判策略</h3><ul><li>进行全面的市场分析并参考可比成交</li><li>了解卖家的动机与时间安排</li><li>善用房产的独特卖点与优势</li><li>设计超越价格本身的创造性交易条款</li></ul>`,
    seo: {
      meta_title_en: 'Mastering Luxury Real Estate Negotiations | Mu SiChen', meta_title_zh: '掌握豪华房地产谈判 | Mu SiChen',
      meta_description_en: 'Strategies, buyer psychology and pitfalls in luxury real estate negotiations.',
      meta_description_zh: '豪华房地产谈判中的策略、买家心理与常见误区。',
      keywords: 'real estate negotiation, luxury property strategy', og_image: '/images/imperial-1.jpg'
    },
    faqs: []
  },
  {
    slug: 'kl-luxury-boom-tech-giants-2025',
    title_en: "Kuala Lumpur's Luxury Property Boom: How Tech Giants Are Reshaping the Market in 2025",
    title_zh: '吉隆坡豪华房地产热潮：科技巨头如何在 2025 年重塑市场',
    excerpt_en: "An in-depth look at how global capital, UHNWIs, and tech giants are transforming Kuala Lumpur's luxury property market into a Southeast Asian hub for smart, sustainable living.",
    excerpt_zh: '深入探讨全球资本、超高净值人士和科技巨头如何将吉隆坡的豪华房地产市场转变为东南亚智能、可持续生活的枢纽。',
    category: 'Investment', author: 'Mu SiChen', author_title: 'Senior Real-Estate Negotiator',
    read_time: 7, featured: false, published: true, image_url: '/images/imperial-3.jpg',
    published_at: '2025-08-29',
    content_en: `<h3>Rising Demand Meets Scarcity</h3><p>Luxury property prices in Kuala Lumpur are climbing as demand outpaces supply. Inquiries from Chinese investors surged more than 40% in 2024 for properties above RM1 million, while the number of UHNWIs in Malaysia is projected to grow 34.6% between 2023 and 2028.</p><h3>Tech Giants Redefining Real Estate</h3><p>Google is investing US$2 billion into a Malaysian data centre and cloud hub, Microsoft is committing US$2.2 billion to AI and cloud services, and Arm is spearheading a US$250 million design park — driving demand for high-quality commercial and residential space.</p><h3>Smart, Sustainable Living as the New Luxury</h3><p>Nearly 70% of buyers now consider smart home features a must-have, while green certifications such as LEED and GreenRE are becoming standard.</p>`,
    content_zh: `<h3>需求上升遇上供应稀缺</h3><p>随着需求超过供应，吉隆坡豪华房产价格持续攀升。2024 年，中国投资者对 100 万令吉以上房产的咨询激增超过 40%，而马来西亚超高净值人士的数量预计在 2023 至 2028 年间增长 34.6%。</p><h3>科技巨头重塑房地产</h3><p>Google 正投资 20 亿美元建设马来西亚数据中心和云枢纽，Microsoft 承诺投入 22 亿美元发展人工智能和云服务，Arm 则牵头建设 2.5 亿美元的设计园区 —— 推动了对优质商业和住宅空间的需求。</p><h3>智能可持续生活成为新奢华</h3><p>近 70% 的买家如今将智能家居功能视为必备，而 LEED 和 GreenRE 等绿色认证正逐渐成为标准。</p>`,
    seo: {
      meta_title_en: "KL Luxury Boom & Tech Giants 2025 | Mu SiChen", meta_title_zh: '吉隆坡豪宅热潮与科技巨头 2025 | Mu SiChen',
      meta_description_en: 'How global capital and tech giants are reshaping the Kuala Lumpur luxury property market in 2025.',
      meta_description_zh: '全球资本与科技巨头如何在 2025 年重塑吉隆坡豪华房地产市场。',
      keywords: 'Kuala Lumpur property boom, tech investment Malaysia', og_image: '/images/imperial-3.jpg'
    },
    faqs: []
  }
];

// ---- global settings ----
const globalSettings = {
  brand_name: 'Mu SiChen',
  office_en: 'A-G-03 Marc Service Residence, No 3, Jalan Pinang, 50450 Kuala Lumpur, Malaysia',
  office_zh: 'A-G-03 Marc Service Residence，Jalan Pinang 3 号，50450 吉隆坡，马来西亚',
  phone: '+(60) 16-828-0399',
  email: 'musichen@propnex.com.my',
  service_areas_en: 'Malaysia • Singapore • China',
  service_areas_zh: '马来西亚 • 新加坡 • 中国',
  whatsapp: '60168280399',
  calendar_url: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3LnfJ5T5bh5HZf4-meZyUzJMux4phu9q7-RDeIgDODPYLMxSmQWW-8z5-EHXkQOseU1jE8Uhmp',
  facebook: '', instagram: '', linkedin: '',
  default_meta_title: 'Mu SiChen — Luxury Real Estate Negotiator & Advisor, Kuala Lumpur',
  default_meta_description: 'Luxury real estate advisory in Kuala Lumpur. Exclusive properties, market insights and white-glove service.',
  default_og_image: '/images/imperial-0.jpg'
};

async function main() {
  await client.connect();

  // site_content
  let scCount = 0;
  for (const key of Object.keys(flatEn)) {
    const group = key.split('.')[0];
    await client.query(
      `INSERT INTO public.site_content (key, "group", value_en, value_zh)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (key) DO UPDATE SET value_en=EXCLUDED.value_en, value_zh=EXCLUDED.value_zh, "group"=EXCLUDED."group"`,
      [key, group, String(flatEn[key] ?? ''), String(flatZh[key] ?? flatEn[key] ?? '')]
    );
    scCount++;
  }
  console.log('site_content upserted:', scCount);

  // settings
  await client.query(
    `INSERT INTO public.settings (key, value) VALUES ('global', $1::jsonb)
     ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`,
    [JSON.stringify(globalSettings)]
  );
  console.log('settings.global upserted');

  // properties
  for (const p of properties) {
    await client.query(
      `INSERT INTO public.properties
        (slug, title_en, title_zh, property_type, price, location, address, beds, baths, sqft, status, featured, published,
         image_url, gallery, description_en, description_zh, overview_en, overview_zh, features, schools, other_details,
         location_lat, location_lng, seo, faqs)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
       ON CONFLICT (slug) DO UPDATE SET
         title_en=EXCLUDED.title_en, title_zh=EXCLUDED.title_zh, property_type=EXCLUDED.property_type,
         price=EXCLUDED.price, location=EXCLUDED.location, address=EXCLUDED.address, beds=EXCLUDED.beds,
         baths=EXCLUDED.baths, sqft=EXCLUDED.sqft, status=EXCLUDED.status, featured=EXCLUDED.featured, published=EXCLUDED.published,
         image_url=EXCLUDED.image_url, gallery=EXCLUDED.gallery, description_en=EXCLUDED.description_en, description_zh=EXCLUDED.description_zh,
         overview_en=EXCLUDED.overview_en, overview_zh=EXCLUDED.overview_zh, features=EXCLUDED.features, schools=EXCLUDED.schools,
         other_details=EXCLUDED.other_details, location_lat=EXCLUDED.location_lat, location_lng=EXCLUDED.location_lng,
         seo=EXCLUDED.seo, faqs=EXCLUDED.faqs`,
      [p.slug, p.title_en, p.title_zh, p.property_type, p.price, p.location, p.address, p.beds, p.baths, p.sqft, p.status,
       p.featured, p.published, p.image_url, JSON.stringify(p.gallery), p.description_en, p.description_zh, p.overview_en,
       p.overview_zh, JSON.stringify(p.features), JSON.stringify(p.schools), JSON.stringify(p.other_details),
       p.location_lat, p.location_lng, JSON.stringify(p.seo), JSON.stringify(p.faqs)]
    );
  }
  console.log('properties upserted:', properties.length);

  // insights
  for (const a of insights) {
    await client.query(
      `INSERT INTO public.insights
        (slug, title_en, title_zh, excerpt_en, excerpt_zh, content_en, content_zh, category, author, author_title,
         read_time, featured, published, image_url, published_at, seo, faqs)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       ON CONFLICT (slug) DO UPDATE SET
         title_en=EXCLUDED.title_en, title_zh=EXCLUDED.title_zh, excerpt_en=EXCLUDED.excerpt_en, excerpt_zh=EXCLUDED.excerpt_zh,
         content_en=EXCLUDED.content_en, content_zh=EXCLUDED.content_zh, category=EXCLUDED.category, author=EXCLUDED.author,
         author_title=EXCLUDED.author_title, read_time=EXCLUDED.read_time, featured=EXCLUDED.featured, published=EXCLUDED.published,
         image_url=EXCLUDED.image_url, published_at=EXCLUDED.published_at, seo=EXCLUDED.seo, faqs=EXCLUDED.faqs`,
      [a.slug, a.title_en, a.title_zh, a.excerpt_en, a.excerpt_zh, a.content_en, a.content_zh, a.category, a.author,
       a.author_title, a.read_time, a.featured, a.published, a.image_url, a.published_at, JSON.stringify(a.seo), JSON.stringify(a.faqs)]
    );
  }
  console.log('insights upserted:', insights.length);

  await client.end();
  console.log('SEED_DONE');
}
main().catch((e) => { console.error('SEED_ERR:', e.message); process.exit(1); });
