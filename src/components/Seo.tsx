'use client';

/**
 * In the Next.js App Router, page <title>/meta/OG tags are set via the
 * Metadata API in each route's server component. This component now only
 * emits schema.org JSON-LD (structured data), which is safe to render in the
 * document body and is included in the server-rendered HTML.
 * The extra props are accepted (and ignored) so existing call sites keep working.
 */
interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  lang?: string;
  jsonLd?: (object | null | undefined)[];
}

const Seo = ({ jsonLd }: SeoProps) => {
  const blocks = (jsonLd || []).filter(Boolean) as object[];
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }} />
      ))}
    </>
  );
};

export default Seo;
