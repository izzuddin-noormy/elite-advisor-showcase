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
      title: 'Market Trends in Kuala Lumpur: What Luxury Buyers Need to Know',
      excerpt: 'An in-depth analysis of the Kuala Lumpur luxury market, including recent sales data and emerging trends that discerning buyers should understand.',
      content: `
        <h1>Market Trends in Kuala Lumpur: What Luxury Buyers Need to Know</h1>
        </br>
        <p>Kuala Lumpur\'s prime residential scene has quietly turned a corner. Transaction values across Malaysia hit a decade-high in 2024, and KL\'s luxury segment has since moved from volatility to steadier footing with firmer rents, limited new launches, and selective—but deeper—capital from regional and Middle Eastern buyers.</p>
        </br></br>

        <h3>Key Market Trends</h3>
        </br>
        <p><strong>1) Prime rents are rising faster than prices.</strong> Independent trackers report double-digit rental growth in KL\'s prime segment over the past year, outpacing capital value gains—an attractive setup for yield-minded buyers.</p>
        <p><strong>2) Stabilisation with a supply squeeze at the top end.</strong> Developers have been cautious on new launches, with only a handful of completions recently adding ~1,443 prime units. This scarcity supports pricing and rental resilience.</p>
        <p><strong>3) “Live-above-the-mall” and branded addresses keep winning.</strong> Projects like TRX Residences and Pavilion Damansara Heights highlight demand for integrated, transit-linked luxury with premium amenities.</p>
        <p><strong>4) Macro backdrop is constructive, not euphoric.</strong> While national transaction values reached record highs in 2024, 1Q2025 showed a natural dip—reflecting stabilisation rather than overheating.</p>
        <p><strong>5) Currency tailwinds are moderating.</strong> The ringgit\'s strengthening versus the USD trims offshore bargains but boosts domestic confidence and real returns.</p>
        </br></br>

        <h3>Buyer Demographics and Preferences</h3>
        </br>
        <p>The KL luxury market is increasingly shaped by both domestic HNWIs and foreign investors. Chinese buyers in particular are showing greater appetite, while the revamped Malaysia My Second Home (MM2H) programme has seen a surge in approvals, re-engaging long-stay foreign residents.</p>
        <p>Today\'s luxury buyers prioritise:</p>
        <ul>
          <li>Proximity to education hubs and financial districts (KLCC, TRX, Damansara, Bangsar)</li>
          <li>Integrated, walkable ecosystems with mall/park/MRT access</li>
          <li>Hotel-branded residences offering concierge and service management</li>
          <li>Yield resilience from strong rental demand and institutional-style tenancy</li>
        </ul>
        </br></br>

        <h3>Investment Outlook</h3>
        </br>
        <p><strong>Yields & income:</strong> Prime residential yields hover around ~3.5%, with rental growth outpacing capital appreciation. This dynamic favours yield-focused investors who manage leases actively.</p>
        <p><strong>Supply discipline:</strong> Developers remain cautious, with limited new launches expected in the next 12–18 months, supporting pricing for existing prime stock.</p>
        <p><strong>Macro & policy watch:</strong> A steady ringgit, stable rates, and sustained momentum in MM2H approvals will underpin market confidence.</p>
        <p><strong>Opportunity hotspots:</strong> CBD-core integrated towers near TRX and KLCC; low-density enclaves in Damansara Heights and Bukit Tunku; and branded residences offering premium rental returns.</p>
        </br></br>

        <h3>Conclusion</h3>
        </br>
        <p>Kuala Lumpur\'s luxury market has transitioned into a phase of resilient expansion. For discerning buyers, the strategy is clear: focus on integrated, MRT-connected, amenity-rich properties; capture rental-alpha while supply remains tight; and leverage FX or policy windows for optimal entry. In the next 12–24 months, KL offers a rare mix in Asia—income resilience, lifestyle value, and long-term upside as its financial and retail districts fully mature.</p>
      `,
      date: 'April 4, 2025',
      readTime: '6 min read',
      category: 'Market Analysis',
      author: 'Mu Sichen',
      authorTitle: 'Senior Real-Estate Negotiator'
    },
    '2': {
      id: 2,
      title: 'Mastering Luxury Real Estate Negotiations',
      excerpt: 'A strategic guide to negotiating luxury real estate transactions, focusing on buyer psychology, key strategies, common pitfalls, and the importance of professional representation.',
      content: `
        <h1>Mastering Luxury Real Estate Negotiations</h1>
        </br></br>
        <p>Negotiating luxury real estate transactions requires a unique blend of market knowledge, psychological insight, and strategic thinking. Unlike standard residential deals, luxury transactions often involve complex terms, extended timelines, and sophisticated parties.</p>
        </br>

        <h3>Understanding the Luxury Buyer Mindset</h3>
        </br>
        <p>Luxury buyers are typically less price-sensitive but more value-conscious. They seek exclusivity, quality, and unique features that justify premium pricing. Recognising this mindset is crucial for successful negotiations, as the focus extends beyond cost to lifestyle, prestige, and long-term value.</p>
        </br>

        <h3>Key Negotiation Strategies</h3>
        </br>
        <p>Successful luxury negotiations often hinge on several critical strategies:</p>
        <ul>
          <li>Conducting thorough market analysis and reviewing comparable sales</li>
          <li>Understanding the seller's motivations and timeline</li>
          <li>Highlighting and leveraging unique property features and benefits</li>
          <li>Structuring creative deal terms that extend beyond just price</li>
        </ul>
        </br></br>

        <h3>Common Pitfalls to Avoid</h3>
        </br>
        <p>Many luxury negotiations fail due to avoidable mistakes, such as:</p>
        <ul>
          <li>Overemphasis on price at the expense of other valuable terms</li>
          <li>Inadequate due diligence on property condition and title</li>
          <li>Poor timing of offers and counteroffers</li>
          <li>Failure to establish rapport and trust with the seller</li>
        </ul>
        </br></br>

        <h3>The Role of Professional Representation</h3>
        </br>
        <p>In luxury transactions, having skilled representation often makes the difference between success and failure. An experienced agent brings market intelligence, refined negotiation expertise, and access to elite professional networks. These capabilities ensure that clients secure not just the right property, but also the most advantageous terms possible.</p>
      `,
      date: 'July 6, 2025',
      readTime: '5 min read',
      category: 'Negotiation Strategies',
      author: 'Mu Sichen',
      authorTitle: 'Senior Real-Estate Negotiator'
    },
    '3': {
      id: 3,
      title: 'Kuala Lumpur\'s Luxury Property Boom: How Tech Giants Are Reshaping the Market in 2025',
      excerpt: 'An in-depth look at how global capital, UHNWIs, and tech giants are transforming Kuala Lumpur\'s luxury property market into a Southeast Asian hub for smart, sustainable living and high-value investments.',
      content: `
        <h1>Kuala Lumpur\'s Luxury Property Boom: How Tech Giants Are Reshaping the Market in 2025</h1>
        </br>
        <p>Kuala Lumpur\'s luxury property market is experiencing a defining shift in 2025, fueled by global capital inflows, a growing population of ultra-high-net-worth individuals (UHNWIs), and the arrival of technology giants investing billions into Malaysia\'s digital future. The interplay between limited supply, surging demand, and a transformation of the city\'s skyline is positioning KL as a Southeast Asian hub for luxury living and smart real estate investment.</p>
        </br></br>

        <h3>Rising Demand Meets Scarcity</h3>
        </br>
        <p>Luxury property prices in Kuala Lumpur are climbing steadily as demand outpaces supply. Developers have slowed launches amid high construction costs, but affluent buyers—both local and international—continue to seek premium addresses. Inquiries from Chinese investors surged by more than 40% in 2024 for properties above RM1 million, while the number of UHNWIs in Malaysia is projected to grow by 34.6% between 2023 and 2028.</p>
        </br></br>

        <h3>Global Capital Flows Fuel Growth</h3>
        </br>
        <p>Malaysia is benefiting from an upswing in global real estate investment. Institutional investors and private funds are increasingly targeting luxury residences and Grade-A office spaces in KL. Knight Frank estimates more than US$800 billion in commercial property investment globally in 2024, and Malaysia is capturing a healthy share of that momentum.</p>
        </br></br>

        <h3>Smart, Sustainable Living as the New Luxury</h3>
        </br>
        <p>By 2025, homebuyers in KL are prioritising technology and sustainability. Nearly 70% of buyers now consider smart home features a must-have, while green certifications such as LEED and GreenRE are becoming standard. For offices, eco-conscious design is proving its worth—green-certified buildings in KL command rental premiums of up to 8%.</p>
        </br></br>

        <h3>Tech Giants Redefining Commercial Real Estate</h3>
        </br>
        <p>The arrival of global tech leaders is reshaping the city\'s property dynamics. Google is investing US$2 billion into a Malaysian data centre and cloud hub, Microsoft is committing US$2.2 billion to AI and cloud services, and Arm is spearheading a US$250 million integrated circuit design park. These investments are driving demand for high-quality commercial spaces, reducing KL\'s office vacancy rate from nearly 24% in 2024 to just under 20% by mid-2025.</p>
        </br></br>

        <h3>Megaprojects and New Icons on the Skyline</h3>
        </br>
        <p>Several large-scale developments are reinforcing KL\'s luxury identity:</p>
        <ul>
          <li><strong>KL Metropolis:</strong> A 75-acre mixed-use hub anchored by a proposed 100-storey tower.</li>
          <li><strong>Oxley Towers:</strong> A trio of skyscrapers in KLCC set for completion in 2027.</li>
          <li><strong>CloutHaus Residences & Hanaz Suites:</strong> Boutique luxury residences featuring rainwater harvesting and automated parking systems.</li>
        </ul>
        <p>Together, these projects are redefining the standards of modern luxury living while strengthening KL\'s status as a regional business and lifestyle hub.</p>
        </br></br>

        <h3>Transit-Oriented and Regeneration Growth</h3>
        </br>
        <p>Neighborhoods such as Sentul are emerging as new hotspots, supported by infrastructure projects like the KLSP2040 urban plan, the East Coast Rail Link (ECRL), and the Johor–Singapore RTS Link. These initiatives are enhancing connectivity while stimulating sustainable, mixed-use communities that are attractive to both investors and residents.</p>
        </br></br>

        <h3>Looking Ahead</h3>
        </br>
        <p>Kuala Lumpur\'s luxury real estate market is at an inflection point. With scarcity driving values upward, smart and sustainable design becoming the new benchmark, and global tech giants anchoring the city\'s economic expansion, KL is set to cement its place as one of Asia\'s most dynamic luxury markets.</p>
        <p>For developers, the opportunity lies in transit-oriented, eco-luxury projects. For investors, the window remains open to capture value before prices accelerate further. For the city itself, the fusion of technology, sustainability, and luxury is fast becoming its defining identity.</p>
      `,
      date: 'August 29, 2025',
      readTime: '7 min read',
      category: 'Market Analysis',
      author: 'Mu Sichen',
      authorTitle: 'Senior Real-Estate Negotiator'
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