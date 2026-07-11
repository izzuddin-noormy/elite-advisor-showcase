'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { DevelopmentRow } from '@/integrations/supabase/cms-types';
import { ArrowRight } from 'lucide-react';

const NewLaunch = () => {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<DevelopmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('developments')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });
      setItems((data as unknown as DevelopmentRow[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Seo title={`${t('nav.newLaunch')} | Mu SiChen`} description={t('newLaunch.subtitle')} lang={language} />
      <Navigation />

      <section className="pt-28 pb-16 bg-background">
        <div className="container mx-auto px-6 text-center">
          <span className="inline-block px-4 py-2 bg-gold/10 text-gold text-xs font-body font-light tracking-[0.2em] uppercase border border-gold/30 mb-4">
            {t('newLaunch.badge')}
          </span>
          <h1 className="section-heading text-primary mb-4">{t('newLaunch.title')}</h1>
          <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto">{t('newLaunch.subtitle')}</p>
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="container mx-auto px-6">
          {loading ? (
            <p className="text-center text-muted-foreground py-12">…</p>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">{t('newLaunch.empty')}</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {items.map((d) => (
                <Link key={d.id} href={`/new-launch/${d.slug}`} className="group block rounded-lg overflow-hidden shadow-luxury bg-card">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={d.hero_image || '/placeholder.svg'} alt={pick(language, d.name_en, d.name_zh)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-5 left-5 px-3 py-1 bg-gold text-primary text-xs font-body font-medium tracking-wide">{pick(language, d.status_en, d.status_zh)}</span>
                    <div className="absolute bottom-5 left-5 text-white">
                      <h2 className="font-serif text-2xl font-light">{pick(language, d.name_en, d.name_zh)}</h2>
                      <p className="font-body text-sm font-light opacity-90">{pick(language, d.location_en, d.location_zh)}</p>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-body text-sm text-muted-foreground">{pick(language, d.tagline_en, d.tagline_zh)}</p>
                      {d.price_from && <p className="font-serif text-xl text-primary mt-1">{d.price_from}</p>}
                    </div>
                    <span className="inline-flex items-center text-gold font-body text-sm group-hover:translate-x-1 transition-transform">
                      {t('newLaunch.explore')} <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewLaunch;
