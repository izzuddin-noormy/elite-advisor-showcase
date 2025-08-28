import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const InsightsSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const insights = [
    {
      id: 1,
      title: 'Market Trends in Kuala Lumpur: What Luxury Buyers Need to Know',
      excerpt: 'An in-depth analysis of the Kuala Lumpur luxury market, including recent sales data and emerging trends that discerning buyers should understand.',
      date: 'April 4, 2025',
      readTime: '6 min read',
      category: 'Market Analysis',
    },
    {
      id: 2,
      title: 'Mastering Luxury Real Estate Negotiations',
      excerpt: 'A strategic guide to negotiating luxury real estate transactions, focusing on buyer psychology, key strategies, common pitfalls, and the importance of professional representation.',
      date: 'July 6, 2025',
      readTime: '5 min read',
      category: 'Negotiation Strategies',
    },
    {
      id: 3,
      title: 'Kuala Lumpur\’s Luxury Property Boom: How Tech Giants Are Reshaping the Market in 2025',
      excerpt: 'An in-depth look at how global capital, UHNWIs, and tech giants are transforming Kuala Lumpur\’s luxury property market into a Southeast Asian hub for smart, sustainable living and high-value investments.',
      date: 'November 28, 2023',
      readTime: '6 min read',
      category: 'Investment'
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((insight) => (
            <article
              key={insight.id}
              className="group cursor-pointer hover-lift"
              onClick={() => navigate(`/insights/${insight.id}`)}
            >
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-gold-light text-primary text-xs font-body font-light tracking-wide">
                    {insight.category === 'Market Analysis' ? t('insights.categories.marketAnalysis') :
                     insight.category === 'Strategy' ? t('insights.categories.strategy') :
                     insight.category === 'Investment' ? t('insights.categories.investment') : insight.category}
                  </span>
                  <span className="text-sm text-muted-foreground font-body font-light">
                    {insight.date}
                  </span>
                </div>
                
                <h3 className="font-serif text-xl font-medium text-primary mb-3 group-hover:text-gold transition-colors duration-300">
                  {insight.title}
                </h3>
                
                <p className="font-body text-muted-foreground font-light leading-relaxed mb-4">
                  {insight.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-body font-light">
                    {insight.readTime}
                  </span>
                  <button 
                    className="font-body text-sm font-light text-primary elegant-underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/insights/${insight.id}`);
                    }}
                  >
                    {t('insights.readMore')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
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