import { useLanguage } from '@/contexts/LanguageContext';

const IntroSection = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-slide-up">
            <h2 className="section-heading text-primary mb-12">
              {t('intro.title')}
            </h2>
            
            <div className="prose prose-lg mx-auto">
              <p className="font-body text-lg md:text-xl font-light leading-relaxed text-muted-foreground mb-8">
                {t('intro.description1')}
              </p>
              
              <p className="font-body text-lg md:text-xl font-light leading-relaxed text-muted-foreground mb-8">
                {t('intro.description2')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl font-serif font-light text-gold mb-4">{t('intro.stats.revenue')}</div>
                <p className="font-body text-sm font-light tracking-wide text-muted-foreground uppercase">
                  {t('intro.stats.revenueLabel')}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-light text-gold mb-4">{t('intro.stats.homes')}</div>
                <p className="font-body text-sm font-light tracking-wide text-muted-foreground uppercase">
                  {t('intro.stats.homesLabel')}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-serif font-light text-gold mb-4">{t('intro.stats.experience')}</div>
                <p className="font-body text-sm font-light tracking-wide text-muted-foreground uppercase">
                  {t('intro.stats.experienceLabel')}
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
