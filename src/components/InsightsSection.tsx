import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { InsightRow } from '@/integrations/supabase/cms-types';

const InsightsSection = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<InsightRow[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('insights')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(3);
      setInsights((data as unknown as InsightRow[]) || []);
    })();
  }, []);

  const catLabel = (category: string | null) =>
    category === 'Market Analysis' ? t('insights.categories.marketAnalysis') :
    category === 'Strategy' ? t('insights.categories.strategy') :
    category === 'Investment' ? t('insights.categories.investment') : (category || '');

  return (
    <section id="insights" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-primary mb-8">{t('insights.title')}</h2>
          <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto">{t('insights.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((insight) => {
            const dateStr = insight.published_at
              ? new Date(insight.published_at).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              : '';
            return (
              <article key={insight.id} className="group cursor-pointer hover-lift" onClick={() => navigate(`/insights/${insight.slug}`)}>
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-gold-light text-primary text-xs font-body font-light tracking-wide">{catLabel(insight.category)}</span>
                    <span className="text-sm text-muted-foreground font-body font-light">{dateStr}</span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-primary mb-3 group-hover:text-gold transition-colors duration-300">
                    {pick(language, insight.title_en, insight.title_zh)}
                  </h3>
                  <p className="font-body text-muted-foreground font-light leading-relaxed mb-4">
                    {pick(language, insight.excerpt_en, insight.excerpt_zh)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-body font-light">{insight.read_time ? `${insight.read_time} min read` : ''}</span>
                    <button
                      className="font-body text-sm font-light text-primary elegant-underline"
                      onClick={(e) => { e.stopPropagation(); navigate(`/insights/${insight.slug}`); }}
                    >
                      {t('insights.readMore')}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/insights" className="inline-flex items-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide">
            {t('insights.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
