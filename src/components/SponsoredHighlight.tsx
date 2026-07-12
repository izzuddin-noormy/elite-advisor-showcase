'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { SponsorRow } from '@/integrations/supabase/cms-types';
import { cn } from '@/lib/utils';

const SponsoredHighlight = () => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [sponsors, setSponsors] = useState<SponsorRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('sponsors')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });
      const rows = (data as unknown as SponsorRow[]) || [];
      setSponsors(rows);
      const highlight = new URLSearchParams(window.location.search).get('highlight');
      const match = rows.find((r) => r.slug === highlight);
      setActiveId(match ? match.id : rows[0]?.id ?? null);
      if (match) setTimeout(() => document.getElementById('sponsored-highlight')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    })();
  }, []);

  if (sponsors.length === 0) return null;
  const active = sponsors.find((s) => s.id === activeId) || sponsors[0];

  const go = (link?: string | null) => {
    if (!link) return;
    if (/^https?:\/\//.test(link)) window.open(link, '_blank');
    else router.push(link);
  };

  const v = (en?: string | null, zh?: string | null) => pick(language, en, zh);

  return (
    <section id="sponsored-highlight" className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-gold/10 text-gold text-xs font-body font-light tracking-[0.2em] uppercase border border-gold/30 mb-4">
            {t('sponsored.badge')}
          </span>
          <h2 className="section-heading text-primary mb-2">{t('sponsored.title')}</h2>
        </div>

        {/* Active (enlarged) sponsor */}
        <div
          className="group relative overflow-hidden rounded-lg shadow-luxury bg-card max-w-5xl mx-auto cursor-pointer transition-all duration-500"
          onClick={() => go(active.link)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
              <img src={active.image_url || '/placeholder.svg'} alt={v(active.title_en, active.title_zh)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {v(active.badge_en, active.badge_zh) && <span className="absolute top-6 left-6 px-4 py-2 bg-gold text-primary text-xs font-body font-medium tracking-wide">{v(active.badge_en, active.badge_zh)}</span>}
              <div className="absolute bottom-6 left-6 text-white">
                {v(active.type_en, active.type_zh) && <p className="text-sm font-body font-light mb-1">{v(active.type_en, active.type_zh)}</p>}
                {v(active.location_en, active.location_zh) && <p className="text-lg font-serif font-light">{v(active.location_en, active.location_zh)}</p>}
              </div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
              <div>
                <h3 className="font-serif text-3xl lg:text-4xl font-light text-primary mb-2 group-hover:text-gold transition-colors duration-300">{v(active.title_en, active.title_zh)}</h3>
                {v(active.subtitle_en, active.subtitle_zh) && <p className="font-body text-lg text-gold font-light">{v(active.subtitle_en, active.subtitle_zh)}</p>}
              </div>
              {v(active.description_en, active.description_zh) && <p className="font-body text-muted-foreground font-light leading-relaxed">{v(active.description_en, active.description_zh)}</p>}
              <div className="space-y-4">
                {v(active.price_en, active.price_zh) && <span className="font-serif text-2xl lg:text-3xl font-light text-primary block">{v(active.price_en, active.price_zh)}</span>}
                {active.link && (
                  <span className="inline-flex items-center px-6 py-3 border border-primary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide">
                    {t('sponsored.viewProject')}
                    <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal previews */}
        {sponsors.length > 1 && (
          <div className="mt-8 flex gap-4 justify-center overflow-x-auto pb-2">
            {sponsors.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={cn(
                  'relative shrink-0 w-40 sm:w-56 rounded-md overflow-hidden transition-all duration-300',
                  s.id === active.id ? 'ring-2 ring-gold scale-100' : 'opacity-70 hover:opacity-100 scale-95'
                )}
                aria-label={v(s.title_en, s.title_zh)}
              >
                <img src={s.image_url || '/placeholder.svg'} alt={v(s.title_en, s.title_zh)} className="w-full h-24 sm:h-28 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-left text-white font-serif text-sm font-light leading-tight">{v(s.title_en, s.title_zh)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsoredHighlight;
