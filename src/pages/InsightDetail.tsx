import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { InsightRow } from '@/integrations/supabase/cms-types';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';

const InsightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [row, setRow] = useState<InsightRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      // Try by slug first, then by id (backwards compatible with old numeric links)
      let { data } = await supabase.from('insights').select('*').eq('slug', id).eq('published', true).maybeSingle();
      if (!data && id) {
        const res = await supabase.from('insights').select('*').eq('id', id).eq('published', true).maybeSingle();
        data = res.data;
      }
      if (active) { setRow(data as unknown as InsightRow); setLoading(false); }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen"><Navigation />
        <div className="flex items-center justify-center py-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  if (!row) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-serif text-primary mb-4">{t('notFound.message')}</h1>
          <button onClick={() => navigate('/')} className="text-primary hover:text-gold transition-colors">{t('notFound.returnHome')}</button>
        </div>
        <Footer />
      </div>
    );
  }

  const title = pick(language, row.title_en, row.title_zh);
  const excerpt = pick(language, row.excerpt_en, row.excerpt_zh);
  const content = pick(language, row.content_en, row.content_zh);
  const author = row.author || 'Mu SiChen';
  const authorTitle = row.author_title || '';
  const initials = author.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const dateStr = row.published_at
    ? new Date(row.published_at).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
  const category = row.category || '';
  const catLabel =
    category === 'Market Analysis' ? t('insights.categories.marketAnalysis') :
    category === 'Strategy' ? t('insights.categories.strategy') :
    category === 'Investment' ? t('insights.categories.investment') : category;
  const seo = row.seo || {};

  return (
    <div className="min-h-screen">
      <Seo
        title={pick(language, seo.meta_title_en, seo.meta_title_zh) || title}
        description={pick(language, seo.meta_description_en, seo.meta_description_zh) || excerpt}
        keywords={seo.keywords}
        ogImage={seo.og_image || row.image_url || undefined}
        ogType="article"
        noindex={seo.noindex}
        lang={language}
        jsonLd={[
          articleJsonLd(row, language),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: t('nav.insights'), url: '/#insights' },
            { name: title, url: `/insights/${row.slug}` },
          ]),
          faqJsonLd(row.faqs || [], language),
        ]}
      />
      <Navigation />

      <article className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <button onClick={() => navigate('/#insights')} className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-body text-sm">{t('insights.backToInsights')}</span>
          </button>

          <header className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              {catLabel && <span className="px-3 py-1 bg-gold-light text-primary text-xs font-body font-light tracking-wide">{catLabel}</span>}
              <div className="flex items-center text-sm text-muted-foreground font-body font-light space-x-4">
                {dateStr && <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{dateStr}</div>}
                {row.read_time && <div className="flex items-center"><Clock className="w-4 h-4 mr-1" />{row.read_time} min read</div>}
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-primary mb-6 leading-tight">{title}</h1>
            {excerpt && <p className="font-body text-lg text-muted-foreground font-light leading-relaxed mb-8">{excerpt}</p>}

            <div className="flex items-center">
              <div className="w-10 h-10 bg-gold-light rounded-full flex items-center justify-center mr-3">
                <span className="font-serif text-primary font-medium">{initials}</span>
              </div>
              <div>
                <div className="font-body text-sm font-medium text-primary">{author}</div>
                {authorTitle && <div className="font-body text-xs text-muted-foreground">{authorTitle}</div>}
              </div>
            </div>
          </header>

          {row.image_url && (
            <img src={row.image_url} alt={title} className="w-full h-72 md:h-96 object-cover mb-10 rounded-sm" />
          )}

          <div className="prose prose-lg max-w-none font-body text-muted-foreground" dangerouslySetInnerHTML={{ __html: content }} style={{ lineHeight: '1.7' }} />

          {(row.faqs || []).filter((q) => (language === 'zh' ? q.q_zh : q.q_en)).length > 0 && (
            <div className="mt-16 pt-8 border-t border-border space-y-4">
              <h2 className="font-serif text-2xl font-light text-primary">FAQ</h2>
              {(row.faqs || []).map((q, i) => {
                const question = pick(language, q.q_en, q.q_zh);
                if (!question) return null;
                return (
                  <div key={i} className="border-b border-border pb-4">
                    <h3 className="font-body font-medium text-primary mb-1">{question}</h3>
                    <p className="font-body text-muted-foreground">{pick(language, q.a_en, q.a_zh)}</p>
                  </div>
                );
              })}
            </div>
          )}

          <footer className="mt-16 pt-8 border-t border-border text-center">
            <button onClick={() => navigate('/#insights')} className="inline-flex items-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide">
              {t('insights.viewMore')}
            </button>
          </footer>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default InsightDetail;
