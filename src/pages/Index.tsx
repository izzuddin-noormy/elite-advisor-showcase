import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import IntroSection from '@/components/IntroSection';
import SponsoredHighlight from '@/components/SponsoredHighlight';
import PropertiesSection from '@/components/PropertiesSection';
import InsightsSection from '@/components/InsightsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/lib/useSettings';
import { realEstateAgentJsonLd } from '@/lib/jsonld';

const Index = () => {
  const { language } = useLanguage();
  const { settings } = useSettings();

  return (
    <div className="min-h-screen">
      <Seo
        title={settings.default_meta_title || 'Mu SiChen — Luxury Real Estate Negotiator & Advisor, Kuala Lumpur'}
        description={settings.default_meta_description || 'Luxury real estate advisory in Kuala Lumpur. Exclusive properties, market insights and white-glove service.'}
        ogImage={settings.default_og_image || '/images/imperial-0.jpg'}
        lang={language}
        jsonLd={[
          realEstateAgentJsonLd({
            name: settings.brand_name || 'Mu SiChen',
            phone: settings.phone,
            email: settings.email,
            address: settings.office_en,
          }),
        ]}
      />
      <Navigation />
      <HeroSection />
      <IntroSection />
      <SponsoredHighlight />
      <PropertiesSection />
      <InsightsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
