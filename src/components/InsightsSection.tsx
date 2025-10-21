import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const InsightsSection = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data, error } = await supabase
          .from('insights')
          .select('*')
          .eq('featured', true)
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setInsights(data || []);
      } catch (error) {
        console.error('Error fetching featured insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <section id="insights" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-primary mb-8">
            {t('insights.title')}
          </h2>
          <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto">
            {t('insights.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insights.map((insight) => {
              const title = language === 'zh' ? insight.title_zh : insight.title_en;
              const excerpt = language === 'zh' ? insight.excerpt_zh : insight.excerpt_en;
              const publishDate = insight.published_at 
                ? new Date(insight.published_at).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')
                : '';
              
              return (
                <article
                  key={insight.id}
                  className="group cursor-pointer hover-lift"
                  onClick={() => navigate(`/insights/${insight.slug}`)}
                >
                  <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="px-3 py-1 bg-gold-light text-primary text-xs font-body font-light tracking-wide">
                        {insight.category || t('insights.categories.marketAnalysis')}
                      </span>
                      <span className="text-sm text-muted-foreground font-body font-light">
                        {publishDate}
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-xl font-medium text-primary mb-3 group-hover:text-gold transition-colors duration-300">
                      {title}
                    </h3>
                    
                    {excerpt && (
                      <p className="font-body text-muted-foreground font-light leading-relaxed mb-4">
                        {excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-body font-light">
                        {insight.read_time || 5} min read
                      </span>
                      <button 
                        className="font-body text-sm font-light text-primary elegant-underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/insights/${insight.slug}`);
                        }}
                      >
                        {t('insights.readMore')}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="#insights"
            className="inline-flex items-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide"
          >
            {t('insights.viewAll')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
