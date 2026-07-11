'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SponsoredProject {
  key: string;
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
  const router = useRouter();

  const projects: SponsoredProject[] = [
    {
      key: 'imperial-house',
      id: 'imperial-suite',
      title: t('sponsored.projects.imperialHouse.title'),
      subtitle: t('sponsored.projects.imperialHouse.subtitle'),
      description: t('sponsored.projects.imperialHouse.description'),
      image: 'https://images.unsplash.com/photo-1433832597046-4f10e10ac764?q=80&w=1200&auto=format&fit=crop',
      price: t('sponsored.projects.imperialHouse.price'),
      location: t('sponsored.projects.imperialHouse.location'),
      type: t('sponsored.projects.imperialHouse.type'),
      badge: t('sponsored.projects.imperialHouse.badge'),
    },
    {
      key: 'riverside-estate',
      id: 'riverside-estate',
      title: t('sponsored.projects.riversideEstate.title'),
      subtitle: t('sponsored.projects.riversideEstate.subtitle'),
      description: t('sponsored.projects.riversideEstate.description'),
      image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=80&w=1200&auto=format&fit=crop',
      price: t('sponsored.projects.riversideEstate.price'),
      location: t('sponsored.projects.riversideEstate.location'),
      type: t('sponsored.projects.riversideEstate.type'),
      badge: t('sponsored.projects.riversideEstate.badge'),
    },
  ];

  const [activeKey, setActiveKey] = useState(projects[0]?.key);

  useEffect(() => {
    const highlight = new URLSearchParams(window.location.search).get('highlight');
    if (highlight && projects.some((p) => p.key === highlight)) {
      setActiveKey(highlight);
      setTimeout(() => document.getElementById('sponsored-highlight')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = projects.find((p) => p.key === activeKey) || projects[0];
  if (!active) return null;

  return (
    <section id="sponsored-highlight" className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-gold/10 text-gold text-xs font-body font-light tracking-[0.2em] uppercase border border-gold/30 mb-4">
            {t('sponsored.badge')}
          </span>
          <h2 className="section-heading text-primary mb-2">{t('sponsored.title')}</h2>
        </div>

        {/* Active (enlarged) project */}
        <div
          className="group relative overflow-hidden rounded-lg shadow-luxury bg-card max-w-5xl mx-auto cursor-pointer transition-all duration-500"
          onClick={() => router.push(`/projects/${active.id}`)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
              <img src={active.image} alt={active.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className="absolute top-6 left-6 px-4 py-2 bg-gold text-primary text-xs font-body font-medium tracking-wide">{active.badge}</span>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-body font-light mb-1">{active.type}</p>
                <p className="text-lg font-serif font-light">{active.location}</p>
              </div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
              <div>
                <h3 className="font-serif text-3xl lg:text-4xl font-light text-primary mb-2 group-hover:text-gold transition-colors duration-300">{active.title}</h3>
                <p className="font-body text-lg text-gold font-light">{active.subtitle}</p>
              </div>
              <p className="font-body text-muted-foreground font-light leading-relaxed">{active.description}</p>
              <div className="space-y-4">
                <span className="font-serif text-2xl lg:text-3xl font-light text-primary block">{active.price}</span>
                <span className="inline-flex items-center px-6 py-3 border border-primary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide">
                  {t('sponsored.viewProject')}
                  <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal small previews */}
        {projects.length > 1 && (
          <div className="mt-8 flex gap-4 justify-center overflow-x-auto pb-2">
            {projects.map((p) => (
              <button
                key={p.key}
                onClick={() => setActiveKey(p.key)}
                className={cn(
                  'relative shrink-0 w-40 sm:w-56 rounded-md overflow-hidden group/preview transition-all duration-300',
                  p.key === activeKey ? 'ring-2 ring-gold scale-100' : 'opacity-70 hover:opacity-100 scale-95'
                )}
                aria-label={p.title}
              >
                <img src={p.image} alt={p.title} className="w-full h-24 sm:h-28 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-left text-white font-serif text-sm font-light leading-tight">{p.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsoredHighlight;
