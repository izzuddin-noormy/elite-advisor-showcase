import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl font-medium tracking-tight mb-4">
              <span className="text-primary-foreground">Mu</span>
              <span className="text-gold ml-1">Sichen</span>
            </div>
            <p className="font-body text-sm font-light text-primary-foreground/80 leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-body text-sm font-medium text-primary-foreground mb-4 tracking-wide">
              {t('footer.quickLinks')}
            </h3>
            <nav className="space-y-2">
              <a href="#home" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">
                {t('nav.home')}
              </a>
              <a href="#about" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">
                {t('nav.about')}
              </a>
              <a href="#properties" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">
                {t('nav.properties')}
              </a>
              <a href="#insights" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">
                {t('nav.insights')}
              </a>
              <a href="#contact" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">
                {t('nav.contact')}
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-body text-sm font-medium text-primary-foreground mb-4 tracking-wide">
              {t('footer.contact')}
            </h3>
            <div className="space-y-2">
              <p className="font-body text-sm font-light text-primary-foreground/80">
                +(60) 16-828-0399
              </p>
              <p className="font-body text-sm font-light text-primary-foreground/80">
                musichen@propnex.com.my
              </p>
              <p className="font-body text-sm font-light text-primary-foreground/80">
                A-G-03 Marc Service Residence<br />
                No 3, Jalan Pinang<br />
                50450 Federal Territory of Kuala Lumpur<br />
                Malaysia
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-body text-xs font-light text-primary-foreground/60">
            {t('footer.copyright')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="font-body text-xs font-light text-primary-foreground/60 hover:text-gold transition-colors duration-300">
              {t('footer.privacy')}
            </a>
            <a href="#" className="font-body text-xs font-light text-primary-foreground/60 hover:text-gold transition-colors duration-300">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
