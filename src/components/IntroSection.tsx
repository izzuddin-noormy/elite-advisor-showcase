const IntroSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-slide-up">
            <h2 className="section-heading text-primary mb-12">
              Exceptional Service, Extraordinary Results
            </h2>
            
            <div className="prose prose-lg mx-auto">
              <p className="font-body text-lg md:text-xl font-light leading-relaxed text-muted-foreground mb-8">
                With over a decade of experience in the luxury real estate market, I specialize in providing 
                discerning clients with unparalleled service in the Kuala Lumpur metropolitan area. From 
                exclusive KLCC homes to contemporary country homes, I bring expertise, discretion, 
                and a commitment to excellence to every transaction.
              </p>
              
              <p className="font-body text-base md:text-lg font-light leading-relaxed text-muted-foreground">
                My approach is built on understanding your unique needs and delivering results that exceed 
                expectations. Whether you're acquiring your dream home or maximizing the value of your 
                investment, you can count on white-glove service every step of the way.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl font-serif font-light text-gold mb-4">$3.2B+</div>
                <p className="font-body text-sm font-light tracking-wide text-muted-foreground uppercase">
                  Propnex Agency Revenue in 2024
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-light text-gold mb-4">6.4K+</div>
                <p className="font-body text-sm font-light tracking-wide text-muted-foreground uppercase">
                  Luxury Homes Sold in 2024
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-light text-gold mb-4">25</div>
                <p className="font-body text-sm font-light tracking-wide text-muted-foreground uppercase">
                  Years of Experience in Singapore & Malaysia 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
