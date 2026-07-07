import type { PropertyRow, InsightRow, FAQ, Lang } from '@/integrations/supabase/cms-types';
import { pick } from '@/integrations/supabase/cms-types';

const SITE_NAME = 'Mu SiChen';

function origin() {
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

function abs(url?: string | null) {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return origin() + url;
}

export function realEstateAgentJsonLd(opts: { name?: string; phone?: string; email?: string; address?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: opts.name || SITE_NAME,
    url: origin(),
    telephone: opts.phone,
    email: opts.email,
    address: opts.address,
    areaServed: ['Kuala Lumpur', 'Malaysia', 'Singapore'],
  };
}

export function propertyJsonLd(p: PropertyRow, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: pick(lang, p.title_en, p.title_zh),
    description: pick(lang, p.description_en, p.description_zh),
    url: `${origin()}/projects/${p.slug}`,
    image: abs(p.image_url),
    datePosted: p.created_at || undefined,
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'MYR',
      availability: p.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
    numberOfBedrooms: p.beds || undefined,
    numberOfBathroomsTotal: p.baths || undefined,
    floorSize: p.sqft ? { '@type': 'QuantitativeValue', value: p.sqft, unitCode: 'FTK' } : undefined,
    address: p.address || p.location,
  };
}

export function articleJsonLd(a: InsightRow, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pick(lang, a.title_en, a.title_zh),
    description: pick(lang, a.excerpt_en, a.excerpt_zh),
    image: abs(a.image_url),
    datePublished: a.published_at || a.created_at || undefined,
    dateModified: a.updated_at || undefined,
    author: { '@type': 'Person', name: a.author || SITE_NAME, jobTitle: a.author_title || undefined },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    articleSection: a.category || undefined,
    url: `${origin()}/insights/${a.slug}`,
  };
}

export function faqJsonLd(faqs: FAQ[], lang: Lang) {
  const valid = (faqs || []).filter((f) => (lang === 'zh' ? f.q_zh || f.q_en : f.q_en || f.q_zh));
  if (!valid.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: valid.map((f) => ({
      '@type': 'Question',
      name: pick(lang, f.q_en, f.q_zh),
      acceptedAnswer: { '@type': 'Answer', text: pick(lang, f.a_en, f.a_zh) },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: origin() + it.url,
    })),
  };
}
