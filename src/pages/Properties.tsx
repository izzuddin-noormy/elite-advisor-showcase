import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import CurrencySwitch, { Currency } from '@/components/CurrencySwitch';
import { convertPrice } from '@/utils/currency';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { PropertyRow } from '@/integrations/supabase/cms-types';

const Properties = () => {
  const { t, language } = useLanguage();
  const [currency, setCurrency] = useState<Currency>('MYR');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const itemsPerPage = 9;

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: true });
      setProperties((data as unknown as PropertyRow[]) || []);
    })();
  }, []);

  const statusLabel = (status: string | null) => {
    switch (status) {
      case 'available': return t('properties.status.available');
      case 'under_contract': return t('properties.status.underContract');
      case 'sold': return t('properties.status.sold');
      case 'pending': return t('properties.status.pending');
      default: return status || '';
    }
  };

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;
    const q = searchQuery.toLowerCase();
    return properties.filter((p) =>
      pick(language, p.title_en, p.title_zh).toLowerCase().includes(q) ||
      (p.address || p.location || '').toLowerCase().includes(q) ||
      pick(language, p.description_en, p.description_zh).toLowerCase().includes(q)
    );
  }, [properties, searchQuery, language]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage]);

  return (
    <div className="min-h-screen">
      <Seo title={`${t('properties.title')} | Mu SiChen`} description={t('properties.subtitle')} lang={language} />
      <Navigation />

      <section className="pt-24 pb-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="section-heading text-primary mb-4">{t('properties.title')}</h1>
              <p className="font-body text-lg font-light text-muted-foreground max-w-2xl">{t('properties.subtitle')}</p>
            </div>
            <div className="mt-6 md:mt-0">
              <CurrencySwitch currency={currency} onCurrencyChange={setCurrency} className="justify-end" />
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder={t('properties.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-16 py-6 text-lg font-body font-light bg-card border-border/50 rounded-xl shadow-luxury focus:shadow-lg focus:border-primary/20 transition-all duration-300 placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-background">
        <div className="container mx-auto px-6">
          {paginatedProperties.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No properties found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProperties.map((property) => (
                <Link key={property.id} to={`/projects/${property.slug}`} className="group bg-card rounded-none overflow-hidden hover-lift cursor-pointer block">
                  <div className="relative overflow-hidden">
                    <img src={property.image_url || '/placeholder.svg'} alt={pick(language, property.title_en, property.title_zh)} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-xs font-body font-light tracking-wide ${property.status === 'available' ? 'bg-gold text-primary' : 'bg-primary text-primary-foreground'}`}>
                        {statusLabel(property.status)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-medium text-primary mb-2">{pick(language, property.title_en, property.title_zh)}</h3>
                    <p className="font-body text-sm text-muted-foreground mb-3">{property.address || property.location}</p>
                    <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">{pick(language, property.description_en, property.description_zh)}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-2xl font-light text-primary">{convertPrice(String(property.price), currency)}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground font-body font-light mb-6">
                      <span>{property.beds} {t('properties.beds')}</span><span>•</span>
                      <span>{property.baths} {t('properties.baths')}</span><span>•</span>
                      <span>{property.sqft?.toLocaleString()} {t('properties.sqft')}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide text-center">
                        {t('properties.viewDetails')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12 flex-wrap">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-primary text-primary disabled:opacity-50 hover:bg-primary hover:text-primary-foreground transition-all duration-300">{t('properties.prev')}</button>
              <div className="hidden sm:flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 border ${currentPage === i + 1 ? 'bg-primary text-primary-foreground border-primary' : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'} transition-all duration-300`}>{i + 1}</button>
                ))}
              </div>
              <div className="flex sm:hidden items-center space-x-2">
                <span className="px-3 py-2 border border-primary text-primary rounded">{currentPage}</span>
                <span className="text-muted-foreground">/ {totalPages}</span>
              </div>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border border-primary text-primary disabled:opacity-50 hover:bg-primary hover:text-primary-foreground transition-all duration-300">{t('properties.next')}</button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
