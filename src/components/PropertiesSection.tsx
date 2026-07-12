'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CurrencySwitch, { Currency } from '@/components/CurrencySwitch';
import { convertPrice } from '@/utils/currency';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { PropertyRow } from '@/integrations/supabase/cms-types';

const statusLabel = (status: string | null, t: (k: string) => string) => {
  switch (status) {
    case 'available': return t('properties.status.available');
    case 'under_contract': return t('properties.status.underContract');
    case 'sold': return t('properties.status.sold');
    case 'pending': return t('properties.status.pending');
    default: return status || '';
  }
};

const PropertiesSection = () => {
  const { t, language } = useLanguage();
  const [currency, setCurrency] = useState<Currency>('MYR');
  const [properties, setProperties] = useState<PropertyRow[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6);
      setProperties((data as unknown as PropertyRow[]) || []);
    })();
  }, []);

  return (
    <section id="properties" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-primary mb-8">{t('properties.title')}</h2>
          <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto mb-8">{t('properties.subtitle')}</p>
          <div className="flex justify-center">
            <CurrencySwitch currency={currency} onCurrencyChange={setCurrency} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => {
            const isAvailable = property.status === 'available';
            return (
              <Link key={property.id} href={`/projects/${property.slug}`} className="group bg-card rounded-none overflow-hidden hover-lift cursor-pointer block">
                <div className="relative overflow-hidden">
                  <img
                    src={property.image_url || '/placeholder.svg'}
                    alt={pick(language, property.title_en, property.title_zh)}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-body font-light tracking-wide ${isAvailable ? 'bg-gold text-primary' : 'bg-primary text-primary-foreground'}`}>
                      {statusLabel(property.status, t)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-xl font-medium text-primary mb-2">{pick(language, property.title_en, property.title_zh)}</h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">{property.address || property.location}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-light text-primary">{convertPrice(String(property.price), currency)}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground font-body font-light">
                    <span>{property.beds} {t('properties.beds')}</span>
                    <span>•</span>
                    <span>{property.baths} {t('properties.baths')}</span>
                    <span>•</span>
                    <span>{property.sqft?.toLocaleString()} {t('properties.sqft')}</span>
                  </div>
                  <div className="mt-6">
                    <div className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide text-center">
                      {t('properties.viewDetails')}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/properties" className="inline-flex items-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide">
            {t('properties.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;
