import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CurrencySwitch, { Currency } from '@/components/CurrencySwitch';
import { convertPrice } from '@/utils/currency';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Properties = () => {
  const { t, language } = useLanguage();
  const [currency, setCurrency] = useState<Currency>('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;

    return properties.filter((property) => {
      const title = language === 'zh' ? property.title_zh : property.title_en;
      const description = language === 'zh' ? property.description_zh : property.description_en;
      const location = property.location || '';
      
      return (
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [properties, searchQuery, language]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProperties.slice(start, end);
  }, [filteredProperties, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="section-heading text-primary mb-4">
                {t('properties.title')}
              </h1>
              <p className="font-body text-lg font-light text-muted-foreground max-w-2xl">
                {t('properties.subtitle')}
              </p>
            </div>

            <div className="mt-6 md:mt-0">
              <CurrencySwitch
                currency={currency}
                onCurrencyChange={setCurrency}
                className="justify-end"
              />
            </div>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder={t('properties.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // reset to first page on search
                }}
                className="w-full pl-12 pr-16 py-6 text-lg font-body font-light bg-card border-border/50 rounded-xl shadow-luxury focus:shadow-lg focus:border-primary/20 transition-all duration-300 placeholder:text-muted-foreground/60"
              />
              {/*
              <button className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-primary transition-colors">
                <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-sm font-light">
                  +
                </div>
              </button>
              */}
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="pb-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProperties.map((property) => {
              const title = language === 'zh' ? property.title_zh : property.title_en;
              const description = language === 'zh' ? property.description_zh : property.description_en;
              
              return (
                <Link
                  key={property.id}
                  to={`/projects/${property.slug}`}
                  className="group bg-card rounded-none overflow-hidden hover-lift cursor-pointer block"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={property.image_url || '/images/imperial-0.jpg'}
                      alt={title}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-body font-light tracking-wide bg-gold text-primary">
                        {property.status === 'available' ? t('properties.status.available') : 
                         property.status === 'under_contract' ? t('properties.status.underContract') :
                         property.status === 'sold' ? t('properties.status.sold') : 
                         t('properties.status.pending')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-xl font-medium text-primary mb-2">
                      {title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mb-3">
                      {property.address || property.location}
                    </p>
                    <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
                      {description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-2xl font-light text-primary">
                        {convertPrice(`$${property.price}`, currency)}
                      </span>
                    </div>

                    {(property.beds || property.baths || property.sqft) && (
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground font-body font-light mb-6">
                        {property.beds && <span>{property.beds} {t('properties.beds')}</span>}
                        {property.beds && property.baths && <span>•</span>}
                        {property.baths && <span>{property.baths} {t('properties.baths')}</span>}
                        {(property.beds || property.baths) && property.sqft && <span>•</span>}
                        {property.sqft && <span>{property.sqft} {t('properties.sqft')}</span>}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide text-center">
                        {t('properties.viewDetails')}
                      </div>
                      <button className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-body text-sm font-light tracking-wide">
                        {t('properties.scheduleViewing')}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12 flex-wrap">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-primary text-primary disabled:opacity-50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {t('properties.prev')}
              </button>

              {/* Desktop full page numbers */}
              <div className="hidden sm:flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border ${
                      currentPage === i + 1
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                    } transition-all duration-300`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Mobile compact view */}
              <div className="flex sm:hidden items-center space-x-2">
                <span className="px-3 py-2 border border-primary text-primary rounded">
                  {currentPage}
                </span>
                <span className="text-muted-foreground">/ {totalPages}</span>
              </div>

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-primary text-primary disabled:opacity-50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {t('properties.next')}
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
