import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface SponsoredProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
  location: string;
  type: string;
  badge: string;
}

const SponsoredHighlight = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentProject, setCurrentProject] = useState<SponsoredProject | null>(null);

  // Dummy data for sponsored projects
  const sponsoredProjects: Record<string, SponsoredProject> = {
    'suria-stonor': {
      id: 'suria-stonor',
      title: 'The Suria Stonor',
      subtitle: 'Luxury Penthouse Collection',
      description: 'Suria Stonor, a luxury condominium set in a quiet alcove that comprises stately royal houses, embassies and official residences in the vicinity. Situated in the heart of Kuala Lumpur, it is well connected via excellent transport infrastructure and lies close to the Petronas Twin Tower and world-class amenities.',
      image: 'https://images.unsplash.com/photo-1433832597046-4f10e10ac764?q=80&w=1200&auto=format&fit=crop',
      price: 'From $6,300,000',
      location: 'Kuala Lumpur - KLCC',
      type: 'Penthouse',
      badge: 'EXCLUSIVE PREVIEW'
    },
    'riverside-estate': {
      id: 'riverside-estate',
      title: 'Riverside Estate',
      subtitle: 'Waterfront Luxury Living',
      description: 'Premium waterfront residences with private dock access, infinity pools, and unobstructed river views. Limited collection of only 12 units.',
      image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=1200&auto=format&fit=crop',
      price: 'From $6,200,000',
      location: 'Hudson River Valley',
      type: 'Waterfront Villa',
      badge: 'COMING SOON'
    }
  };

  // Default project if no parameter is provided
  const defaultProject = sponsoredProjects['grand-towers'];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const highlightParam = searchParams.get('highlight');
    
    if (highlightParam && sponsoredProjects[highlightParam]) {
      setCurrentProject(sponsoredProjects[highlightParam]);
      
      // Scroll to section after a brief delay
      setTimeout(() => {
        const section = document.getElementById('sponsored-highlight');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      setCurrentProject(defaultProject);
    }
  }, [location.search]);

  const handleProjectClick = () => {
    if (currentProject) {
      navigate(`/projects/${currentProject.id}`);
    }
  };

  if (!currentProject) return null;

  return (
    <section id="sponsored-highlight" className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-gold/10 text-gold text-xs font-body font-light tracking-[0.2em] uppercase border border-gold/20 mb-4">
            {t('sponsored.badge')}
          </span>
          <h2 className="section-heading text-primary mb-4">
            {t('sponsored.title')}
          </h2>
        </div>

        <Card 
          className="group relative overflow-hidden bg-card/80 backdrop-blur-sm border-0 shadow-elegant hover:shadow-glow transition-all duration-700 cursor-pointer max-w-5xl mx-auto hover:scale-[1.02] transform"
          onClick={handleProjectClick}
        >
          <CardContent className="p-0">
            <div className="flex flex-col">
              {/* Video Section */}
              <div className="relative overflow-hidden aspect-video">
                <video
                  src="/videos/Stonor-KLCC.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-700" />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-gold text-primary text-xs font-body font-medium tracking-wide">
                    {currentProject.badge}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-body font-light mb-1">{currentProject.type}</p>
                  <p className="text-lg font-serif font-light">{currentProject.location}</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 lg:p-12">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-3xl lg:text-4xl font-light text-primary mb-2 group-hover:text-gold transition-colors duration-300">
                      {currentProject.title}
                    </h3>
                    <p className="font-body text-lg text-gold font-light">
                      {currentProject.subtitle}
                    </p>
                  </div>

                  <p className="font-body text-muted-foreground font-light leading-relaxed text-base lg:text-lg">
                    {currentProject.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-2xl lg:text-3xl font-light text-primary">
                        {currentProject.price}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-6 py-3 border border-primary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide">
                        {t('sponsored.viewProject')}
                        <svg 
                          className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SponsoredHighlight;
