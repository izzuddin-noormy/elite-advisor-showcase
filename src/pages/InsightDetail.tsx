import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';

const InsightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const { data, error } = await supabase
          .from('insights')
          .select('*')
          .eq('slug', id)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          navigate('/');
          return;
        }

        setArticle(data);
      } catch (error) {
        console.error('Error fetching insight:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const title = language === 'zh' ? article.title_zh : article.title_en;
  const content = language === 'zh' ? article.content_zh : article.content_en;
  const excerpt = language === 'zh' ? article.excerpt_zh : article.excerpt_en;
  const publishDate = article.published_at ? new Date(article.published_at).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US') : '';
  const readTime = `${article.read_time || 5} min read`;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <article className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back Button */}
          <button
            onClick={() => navigate('/#insights')}
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-body text-sm">{t('insights.backToInsights')}</span>
          </button>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <span className="px-3 py-1 bg-gold-light text-primary text-xs font-body font-light tracking-wide">
                {article.category || t('insights.categories.marketAnalysis')}
              </span>
              <div className="flex items-center text-sm text-muted-foreground font-body font-light space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {publishDate}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {readTime}
                </div>
              </div>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-primary mb-6 leading-tight">
              {title}
            </h1>
            
            {excerpt && (
              <p className="font-body text-lg text-muted-foreground font-light leading-relaxed mb-8">
                {excerpt}
              </p>
            )}
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gold-light rounded-full flex items-center justify-center mr-3">
                <span className="font-serif text-primary font-medium">MS</span>
              </div>
              <div>
                <div className="font-body text-sm font-medium text-primary">{article.author || 'Mu SiChen'}</div>
                <div className="font-body text-xs text-muted-foreground">Senior Real-Estate Negotiator</div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none font-body text-muted-foreground"
            style={{
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap'
            }}
          >
            {content}
          </div>
          
          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="text-center">
              <button
                onClick={() => navigate('/#insights')}
                className="inline-flex items-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide"
              >
                {t('insights.viewMore')}
              </button>
            </div>
          </footer>
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default InsightDetail;