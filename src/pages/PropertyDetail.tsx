import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { PropertyRow } from '@/integrations/supabase/cms-types';
import { propertyJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyOverview from '@/components/property/PropertyOverview';
import PropertyDetails from '@/components/property/PropertyDetails';
import PropertyMap from '@/components/property/PropertyMap';
import MortgageCalculator from '@/components/property/MortgageCalculator';
import SchoolInformation from '@/components/property/SchoolInformation';
import OtherDetails from '@/components/property/OtherDetails';
import { Loader2 } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [row, setRow] = useState<PropertyRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', id)
        .eq('published', true)
        .maybeSingle();
      if (active) {
        setRow(data as unknown as PropertyRow);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  if (!row) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-6 py-40 text-center">
          <h1 className="text-2xl font-serif text-primary mb-4">{t('notFound.message')}</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const f = row.features || {};
  const od = row.other_details || {};
  const sc = row.schools || {};

  const property = {
    title: pick(language, row.title_en, row.title_zh),
    address: row.address || row.location,
    price: row.price,
    beds: row.beds || 0,
    baths: row.baths || 0,
    sqft: row.sqft || 0,
    propertyType: row.property_type || '',
    description: pick(language, row.description_en, row.description_zh),
    overview: pick(language, row.overview_en, row.overview_zh) || pick(language, row.description_en, row.description_zh),
    images: (row.gallery && row.gallery.length ? row.gallery : [row.image_url].filter(Boolean)) as string[],
    features: {
      interior: (language === 'zh' ? f.interior_zh : f.interior_en) || f.interior_en || [],
      exterior: (language === 'zh' ? f.exterior_zh : f.exterior_en) || f.exterior_en || [],
      style: pick(language, f.style_en, f.style_zh),
      lotSize: f.lot_size || '',
    },
    schools: {
      elementary: sc.elementary || [],
      highSchool: sc.high_school || [],
    },
    otherDetails: {
      daysOnMarket: od.days_on_market ?? 0,
      yearBuilt: od.year_built ?? 0,
      garage: pick(language, od.garage_en, od.garage_zh),
      accessibility: (language === 'zh' ? od.accessibility_zh : od.accessibility_en) || od.accessibility_en || [],
      heating: pick(language, od.heating_en, od.heating_zh),
      cooling: pick(language, od.cooling_en, od.cooling_zh),
    },
    location: { lat: row.location_lat || 0, lng: row.location_lng || 0 },
  };

  const seo = row.seo || {};
  const hasSchools = property.schools.elementary.length > 0 || property.schools.highSchool.length > 0;
  const hasFeatures = property.features.interior.length > 0 || property.features.exterior.length > 0;
  const hasOther = !!(property.otherDetails.yearBuilt || property.otherDetails.garage || property.otherDetails.heating);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={pick(language, seo.meta_title_en, seo.meta_title_zh) || property.title}
        description={pick(language, seo.meta_description_en, seo.meta_description_zh) || property.description}
        keywords={seo.keywords}
        ogImage={seo.og_image || row.image_url || undefined}
        ogType="article"
        noindex={seo.noindex}
        lang={language}
        jsonLd={[
          propertyJsonLd(row, language),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: t('nav.properties'), url: '/properties' },
            { name: property.title, url: `/projects/${row.slug}` },
          ]),
          faqJsonLd(row.faqs || [], language),
        ]}
      />
      <Navigation />

      <main className="pt-20">
        {property.images.length > 0 && <PropertyGallery images={property.images} title={property.title} />}

        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <PropertyOverview property={property} />
              {hasFeatures && <PropertyDetails features={property.features} />}
              {hasSchools && <SchoolInformation schools={property.schools} />}
              {hasOther && <OtherDetails details={property.otherDetails} />}
              {property.location.lat !== 0 && (
                <PropertyMap location={property.location} address={property.address} title={property.title} />
              )}

              {(row.faqs || []).filter((q) => (language === 'zh' ? q.q_zh : q.q_en)).length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-light text-primary">FAQ</h2>
                  <div className="space-y-4">
                    {(row.faqs || []).map((q, i) => {
                      const question = pick(language, q.q_en, q.q_zh);
                      if (!question) return null;
                      return (
                        <div key={i} className="border-b border-border pb-4">
                          <h3 className="font-body font-medium text-primary mb-1">{question}</h3>
                          <p className="font-body text-muted-foreground">{pick(language, q.a_en, q.a_zh)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <MortgageCalculator homePrice={property.price} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
