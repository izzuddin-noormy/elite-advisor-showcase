const InsightsSection = () => {
  const insights = [
    {
      id: 1,
      title: 'Market Trends in Georgetown: What Luxury Buyers Need to Know',
      excerpt: 'An in-depth analysis of the Georgetown luxury market, including recent sales data and emerging trends that discerning buyers should understand.',
      date: 'December 15, 2023',
      readTime: '5 min read',
      category: 'Market Analysis'
    },
    {
      id: 2,
      title: 'The Art of Negotiating Luxury Real Estate Transactions',
      excerpt: 'Explore the nuanced strategies and insider knowledge required to successfully navigate high-value property negotiations in today\'s market.',
      date: 'December 8, 2023',
      readTime: '7 min read',
      category: 'Strategy'
    },
    {
      id: 3,
      title: 'Investment Opportunities in the DC Metro Luxury Market',
      excerpt: 'Discover emerging neighborhoods and property types that present exceptional investment potential for sophisticated real estate portfolios.',
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
            Market Insights
          </h2>
          <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto">
            Stay informed with expert analysis, market trends, and strategic insights 
            from the luxury real estate landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((insight) => (
            <article
              key={insight.id}
              className="group cursor-pointer hover-lift"
            >
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-gold-light text-primary text-xs font-body font-light tracking-wide">
                    {insight.category}
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
                  <button className="font-body text-sm font-light text-primary elegant-underline">
                    Read More
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
            View All Insights
          </a>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;