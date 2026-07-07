import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  lang?: string;
  /** One or more schema.org JSON-LD objects. */
  jsonLd?: (object | null | undefined)[];
}

function absoluteUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (typeof window !== 'undefined') return window.location.origin + url;
  return url;
}

const Seo = ({ title, description, keywords, canonical, ogImage, ogType = 'website', noindex, lang, jsonLd }: SeoProps) => {
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : undefined);
  const img = absoluteUrl(ogImage);
  const blocks = (jsonLd || []).filter(Boolean);

  return (
    <Helmet>
      {lang && <html lang={lang} />}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {url && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      {url && <meta property="og:url" content={url} />}
      {img && <meta property="og:image" content={img} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {img && <meta name="twitter:image" content={img} />}

      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(b)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
