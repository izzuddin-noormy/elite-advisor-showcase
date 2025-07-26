import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import IntroSection from '@/components/IntroSection';
import SponsoredHighlight from '@/components/SponsoredHighlight';
import PropertiesSection from '@/components/PropertiesSection';
import InsightsSection from '@/components/InsightsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
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
