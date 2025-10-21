import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CurrencySwitch, { Currency } from '@/components/CurrencySwitch';
import { convertPrice } from '@/utils/currency';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

const PropertiesSection = () => {
  const { t, language } = useLanguage();
  const [currency, setCurrency] = useState<Currency>('USD');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section id="properties" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-primary mb-8">
            {t('properties.title')}
          </h2>
          <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('properties.subtitle')}
          </p>
          
          <div className="flex justify-center">
            <CurrencySwitch 
              currency={currency} 
              onCurrencyChange={setCurrency}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => {
              const title = language === 'zh' ? property.title_zh : property.title_en;
              
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
                    <p className="font-body text-sm text-muted-foreground mb-4">
                      {property.address || property.location}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-2xl font-light text-primary">
                        {convertPrice(`$${property.price}`, currency)}
                      </span>
                    </div>

                    {(property.beds || property.baths || property.sqft) && (
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground font-body font-light">
                        {property.beds && <span>{property.beds} {t('properties.beds')}</span>}
                        {property.beds && property.baths && <span>•</span>}
                        {property.baths && <span>{property.baths} {t('properties.baths')}</span>}
                        {(property.beds || property.baths) && property.sqft && <span>•</span>}
                        {property.sqft && <span>{property.sqft} {t('properties.sqft')}</span>}
                      </div>
                    )}

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
        )}

        <div className="text-center mt-12">
          <Link
            to="/properties"
            className="inline-flex items-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide"
          >
            {t('properties.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;
