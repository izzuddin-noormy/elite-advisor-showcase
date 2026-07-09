// Application-level types for CMS content stored in Supabase.
// These describe the JSONB shapes and rows used across the site + admin.

export type Lang = 'en' | 'zh';

export interface FAQ {
  q_en?: string;
  q_zh?: string;
  a_en?: string;
  a_zh?: string;
}

export interface SEO {
  meta_title_en?: string;
  meta_title_zh?: string;
  meta_description_en?: string;
  meta_description_zh?: string;
  keywords?: string;
  canonical?: string;
  og_image?: string;
  noindex?: boolean;
}

export interface PropertyFeatures {
  interior_en?: string[];
  interior_zh?: string[];
  exterior_en?: string[];
  exterior_zh?: string[];
  style_en?: string;
  style_zh?: string;
  lot_size?: string;
}

export interface School {
  name: string;
  rating: number;
  distance: string;
}

export interface PropertySchools {
  elementary?: School[];
  high_school?: School[];
}

export interface PropertyOtherDetails {
  days_on_market?: number;
  year_built?: number;
  garage_en?: string;
  garage_zh?: string;
  accessibility_en?: string[];
  accessibility_zh?: string[];
  heating_en?: string;
  heating_zh?: string;
  cooling_en?: string;
  cooling_zh?: string;
}

export interface PropertyRow {
  id: string;
  slug: string;
  title_en: string;
  title_zh: string;
  property_type: string | null;
  price: number;
  location: string;
  address: string | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  status: 'available' | 'under_contract' | 'sold' | 'pending' | null;
  featured: boolean | null;
  published: boolean | null;
  image_url: string | null;
  video_url: string | null;
  gallery: string[] | null;
  description_en: string;
  description_zh: string;
  overview_en: string | null;
  overview_zh: string | null;
  features: PropertyFeatures | null;
  schools: PropertySchools | null;
  other_details: PropertyOtherDetails | null;
  location_lat: number | null;
  location_lng: number | null;
  seo: SEO | null;
  faqs: FAQ[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface InsightRow {
  id: string;
  slug: string;
  title_en: string;
  title_zh: string;
  excerpt_en: string | null;
  excerpt_zh: string | null;
  content_en: string;
  content_zh: string;
  category: string | null;
  author: string | null;
  author_title: string | null;
  read_time: number | null;
  featured: boolean | null;
  published: boolean | null;
  image_url: string | null;
  published_at: string | null;
  seo: SEO | null;
  faqs: FAQ[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PageRow {
  id: string;
  slug: string;
  title_en: string;
  title_zh: string;
  content_en: string;
  content_zh: string;
  type: 'static' | 'listing' | 'insight' | null;
  featured: boolean | null;
  published: boolean | null;
  seo: SEO | null;
  faqs: FAQ[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface DevHighlight { title_en?: string; title_zh?: string; desc_en?: string; desc_zh?: string; }
export interface DevSpec { label_en?: string; label_zh?: string; value_en?: string; value_zh?: string; }
export interface DevConnectivity { text_en?: string; text_zh?: string; }

export interface DevelopmentRow {
  id: string;
  slug: string;
  name_en: string;
  name_zh: string;
  tagline_en: string | null;
  tagline_zh: string | null;
  location_en: string | null;
  location_zh: string | null;
  status_en: string | null;
  status_zh: string | null;
  price_from: string | null;
  tenure_en: string | null;
  tenure_zh: string | null;
  completion: string | null;
  developer_en: string | null;
  developer_zh: string | null;
  hero_image: string | null;
  hero_video_url: string | null;
  overview_en: string | null;
  overview_zh: string | null;
  highlights: DevHighlight[] | null;
  specs: DevSpec[] | null;
  connectivity: DevConnectivity[] | null;
  location_lat: number | null;
  location_lng: number | null;
  gallery: string[] | null;
  seo: SEO | null;
  faqs: FAQ[] | null;
  featured: boolean | null;
  published: boolean | null;
  sort_order: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SiteContentRow {
  id: string;
  key: string;
  group: string | null;
  label: string | null;
  value_en: string | null;
  value_zh: string | null;
  updated_at?: string | null;
}

export interface GlobalSettings {
  brand_name?: string;
  office_en?: string;
  office_zh?: string;
  phone?: string;
  email?: string;
  service_areas_en?: string;
  service_areas_zh?: string;
  whatsapp?: string;
  calendar_url?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  default_meta_title?: string;
  default_meta_description?: string;
  default_og_image?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean | null;
  created_at: string | null;
}

// Untyped client escape hatch for tables/columns not in the generated types.
import { supabase } from './client';
export const db = supabase as unknown as {
  from: (table: string) => any;
  storage: typeof supabase.storage;
  auth: typeof supabase.auth;
};

// Pick the language-appropriate value from a bilingual pair.
export function pick(lang: Lang, en?: string | null, zh?: string | null): string {
  if (lang === 'zh') return (zh || en || '') as string;
  return (en || zh || '') as string;
}
