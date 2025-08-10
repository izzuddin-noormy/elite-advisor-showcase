import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

const InsightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Mock article data - in a real app this would come from an API or CMS
  const articles = {
    '1': {
      id: 1,
      title: 'Market Trends in Georgetown: What Luxury Buyers Need to Know',
      excerpt: 'An in-depth analysis of the Georgetown luxury market, including recent sales data and emerging trends that discerning buyers should understand.',
      content: `
        <h2>Georgetown's Luxury Market: A Comprehensive Analysis</h2>
        
        <p>Georgetown continues to be one of the most sought-after luxury real estate markets in the Washington DC metropolitan area. Recent data shows significant shifts in buyer behavior and market dynamics that every discerning buyer should understand.</p>
        
        <h3>Key Market Trends</h3>
        
        <p>The luxury segment in Georgetown has seen remarkable resilience despite broader market fluctuations. Properties priced above $2 million have experienced a 15% increase in demand over the past quarter, with international buyers representing 30% of all transactions.</p>
        
        <h3>Buyer Demographics and Preferences</h3>
        
        <p>Today's luxury buyers in Georgetown are increasingly focused on:</p>
        <ul>
          <li>Historic charm combined with modern amenities</li>
          <li>Private outdoor spaces and gardens</li>
          <li>Home offices and flexible living spaces</li>
          <li>Proximity to cultural institutions and fine dining</li>
        </ul>
        
        <h3>Investment Outlook</h3>
        
        <p>The Georgetown luxury market shows strong fundamentals for continued growth. Limited inventory, combined with the area's historic significance and proximity to major employment centers, creates a compelling investment case for sophisticated buyers.</p>
        
        <h3>Conclusion</h3>
        
        <p>For luxury buyers considering Georgetown, the current market presents unique opportunities. Working with an experienced agent who understands the nuances of this exclusive market is essential for success.</p>
      `,
      date: 'December 15, 2023',
      readTime: '5 min read',
      category: 'Market Analysis',
      author: 'David Hassan',
      authorTitle: 'Luxury Real Estate Specialist'
    },
    '2': {
      id: 2,
      title: 'The Art of Negotiating Luxury Real Estate Transactions',
      excerpt: 'Explore the nuanced strategies and insider knowledge required to successfully navigate high-value property negotiations in today\'s market.',
      content: `
        <h2>Mastering Luxury Real Estate Negotiations</h2>
        
        <p>Negotiating luxury real estate transactions requires a unique blend of market knowledge, psychological insight, and strategic thinking. Unlike standard residential deals, luxury transactions often involve complex terms, extended timelines, and sophisticated parties.</p>
        
        <h3>Understanding the Luxury Buyer Mindset</h3>
        
        <p>Luxury buyers are typically less price-sensitive but more value-conscious. They seek exclusivity, quality, and unique features that justify premium pricing. Understanding this mindset is crucial for successful negotiations.</p>
        
        <h3>Key Negotiation Strategies</h3>
        
        <p>Successful luxury negotiations often hinge on:</p>
        <ul>
          <li>Thorough market analysis and comparable sales</li>
          <li>Understanding the seller's motivations and timeline</li>
          <li>Leveraging unique property features and benefits</li>
          <li>Structuring creative deal terms beyond price</li>
        </ul>
        
        <h3>Common Pitfalls to Avoid</h3>
        
        <p>Many negotiations fail due to:</p>
        <ul>
          <li>Overemphasis on price at the expense of other terms</li>
          <li>Inadequate due diligence on property condition</li>
          <li>Poor timing of offers and counteroffers</li>
          <li>Failure to establish rapport with the seller</li>
        </ul>
        
        <h3>The Role of Professional Representation</h3>
        
        <p>In luxury transactions, having skilled representation can make the difference between success and failure. An experienced agent brings market intelligence, negotiation expertise, and professional networks that prove invaluable.</p>
      `,
      date: 'December 8, 2023',
      readTime: '7 min read',
      category: 'Strategy',
      author: 'David Hassan',
      authorTitle: 'Luxury Real Estate Specialist'
    },
    '3': {
      id: 3,
      title: 'Investment Opportunities in the DC Metro Luxury Market',
      excerpt: 'Discover emerging neighborhoods and property types that present exceptional investment potential for sophisticated real estate portfolios.',
      content: `
        <h2>Emerging Investment Opportunities in DC Metro Luxury Market</h2>
        
        <p>The Washington DC metropolitan area continues to offer compelling investment opportunities for sophisticated real estate portfolios. Recent market analysis reveals several emerging trends and neighborhoods worthy of consideration.</p>
        
        <h3>Emerging Neighborhoods</h3>
        
        <p>While established areas like Georgetown and Dupont Circle maintain their appeal, several emerging neighborhoods are showing strong investment potential:</p>
        
        <h4>The Wharf</h4>
        <p>This waterfront development has transformed Southwest DC into a luxury destination with high-end condominiums, world-class dining, and cultural attractions.</p>
        
        <h4>Navy Yard</h4>
        <p>Proximity to Nationals Park and ongoing development make this area attractive for luxury rental investments.</p>
        
        <h3>Property Types Showing Strong Returns</h3>
        
        <p>Current market data indicates strong performance in:</p>
        <ul>
          <li>Luxury condominiums with amenities</li>
          <li>Historic townhomes with modern renovations</li>
          <li>Penthouse units with outdoor space</li>
          <li>Properties near metro stations</li>
        </ul>
        
        <h3>Investment Strategies</h3>
        
        <p>Successful luxury real estate investment in the DC market requires:</p>
        <ul>
          <li>Long-term perspective (5-10 year holding periods)</li>
          <li>Focus on unique, irreplaceable properties</li>
          <li>Understanding of local zoning and development restrictions</li>
          <li>Professional property management for rental properties</li>
        </ul>
        
        <h3>Market Outlook</h3>
        
        <p>The DC luxury market benefits from stable government employment, international demand, and limited land availability. These factors create a foundation for continued appreciation in well-selected properties.</p>
      `,
      date: 'November 28, 2023',
      readTime: '6 min read',
      category: 'Investment',
      author: 'David Hassan',
      authorTitle: 'Luxury Real Estate Specialist'
    }
  };

  const article = articles[id as keyof typeof articles];

  if (!article) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-primary mb-4">{t('insights.notFoundTitle')}</h1>
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:text-gold transition-colors"
            >
              {t('notFound.returnHome')}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <article className="py-20 md:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-body text-sm">{t('insights.backToInsights')}</span>
          </button>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <span className="px-3 py-1 bg-gold-light text-primary text-xs font-body font-light tracking-wide">
                {article.category === 'Market Analysis' ? t('insights.categories.marketAnalysis') :
                 article.category === 'Strategy' ? t('insights.categories.strategy') :
                 article.category === 'Investment' ? t('insights.categories.investment') : article.category}
              </span>
              <div className="flex items-center text-sm text-muted-foreground font-body font-light space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {article.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTime}
                </div>
              </div>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-primary mb-6 leading-tight">
              {article.title}
            </h1>
            
            <p className="font-body text-lg text-muted-foreground font-light leading-relaxed mb-8">
              {article.excerpt}
            </p>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gold-light rounded-full flex items-center justify-center mr-3">
                <span className="font-serif text-primary font-medium">DH</span>
              </div>
              <div>
                <div className="font-body text-sm font-medium text-primary">{article.author}</div>
                <div className="font-body text-xs text-muted-foreground">{article.authorTitle}</div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none font-body text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: article.content }}
            style={{
              lineHeight: '1.7',
            }}
          />
          
          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="text-center">
              <button
                onClick={() => navigate('/')}
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