/**
 * Generates public/sitemap.xml, public/robots.txt and public/llms.txt
 * from the CMS content. Runs automatically before `vite build`.
 *
 * Configure the canonical site URL with the SITE_URL env var
 * (e.g. in Vercel project settings). Falls back to DEFAULT_SITE_URL.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

const DEFAULT_SITE_URL = 'https://www.musichen.com';

// --- resolve env (build env, or fall back to .env) ---
function readEnv(name) {
  if (process.env[name]) return process.env[name];
  try {
    const envFile = fs.readFileSync(path.join(root, '.env'), 'utf8');
    const m = envFile.match(new RegExp(`^${name}=["']?([^"'\\n]+)`, 'm'));
    return m ? m[1] : undefined;
  } catch {
    return undefined;
  }
}

const SITE_URL = (readEnv('SITE_URL') || DEFAULT_SITE_URL).replace(/\/$/, '');
const SUPABASE_URL = readEnv('VITE_SUPABASE_URL');
const SUPABASE_KEY = readEnv('VITE_SUPABASE_PUBLISHABLE_KEY');

const staticRoutes = ['/', '/properties', '/new-launch'];

async function fetchDynamic() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[seo] Supabase env vars missing — generating sitemap with static routes only.');
    return { properties: [], insights: [], developments: [] };
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const [{ data: properties }, { data: insights }, devRes] = await Promise.all([
    supabase.from('properties').select('slug, updated_at, title_en').eq('published', true),
    supabase.from('insights').select('slug, updated_at, title_en').eq('published', true),
    supabase.from('developments').select('slug, updated_at, name_en').eq('published', true).then((r) => r, () => ({ data: [] })),
  ]);
  return { properties: properties || [], insights: insights || [], developments: (devRes && devRes.data) || [] };
}

function urlEntry(loc, lastmod) {
  return `  <url>\n    <loc>${SITE_URL}${loc}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : ''}\n  </url>`;
}

async function main() {
  fs.mkdirSync(publicDir, { recursive: true });
  const { properties, insights, developments } = await fetchDynamic();

  // sitemap.xml
  const entries = [
    ...staticRoutes.map((r) => urlEntry(r)),
    ...developments.map((d) => urlEntry(`/new-launch/${d.slug}`, d.updated_at)),
    ...properties.map((p) => urlEntry(`/projects/${p.slug}`, p.updated_at)),
    ...insights.map((a) => urlEntry(`/insights/${a.slug}`, a.updated_at)),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

  // robots.txt
  const robots = `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);

  // llms.txt (GEO — helps AI crawlers understand the site)
  const llms = `# Mu SiChen — Luxury Real Estate Negotiator & Advisor\n\n> Luxury real estate advisory in Kuala Lumpur, Malaysia. Exclusive property listings, new-launch developments, market insights, and bilingual (English / 中文) service.\n\n## New Launch Developments\n${developments.map((d) => `- [${d.name_en}](${SITE_URL}/new-launch/${d.slug})`).join('\n') || '- (none published)'}\n\n## Properties\n${properties.map((p) => `- [${p.title_en}](${SITE_URL}/projects/${p.slug})`).join('\n') || '- (none published)'}\n\n## Insights\n${insights.map((a) => `- [${a.title_en}](${SITE_URL}/insights/${a.slug})`).join('\n') || '- (none published)'}\n\n## Contact\n- Website: ${SITE_URL}\n`;
  fs.writeFileSync(path.join(publicDir, 'llms.txt'), llms);

  console.log(`[seo] Wrote sitemap.xml (${entries.length} urls), robots.txt, llms.txt for ${SITE_URL}`);
}

main().catch((e) => {
  console.warn('[seo] generation failed (non-fatal):', e.message);
});
