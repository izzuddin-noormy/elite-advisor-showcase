import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyOverview from '@/components/property/PropertyOverview';
import PropertyDetails from '@/components/property/PropertyDetails';
import PropertyMap from '@/components/property/PropertyMap';
import MortgageCalculator from '@/components/property/MortgageCalculator';
import SchoolInformation from '@/components/property/SchoolInformation';
import OtherDetails from '@/components/property/OtherDetails';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  images: string[];
  description: string;
  overview: string;
  features: {
    interior: string[];
    exterior: string[];
    style: string;
    lotSize: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  schools: {
    elementary: { name: string; rating: number; distance: string }[];
    highSchool: { name: string; rating: number; distance: string }[];
  };
  otherDetails: {
    daysOnMarket: number;
    yearBuilt: number;
    garage: string;
    accessibility: string[];
    heating: string;
    cooling: string;
  };
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('slug', id)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          navigate('/properties');
          return;
        }

        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return null;
  }

  // Map Supabase data to component format
  const mappedProperty = {
    id: property.id,
    title: language === 'zh' ? property.title_zh : property.title_en,
    address: property.address || property.location,
    price: property.price,
    beds: property.beds || 0,
    baths: property.baths || 0,
    sqft: property.sqft || 0,
    propertyType: language === 'zh' ? property.title_zh : property.title_en,
    images: property.image_url ? [property.image_url] : ['/images/imperial-0.jpg'],
    description: language === 'zh' ? property.description_zh : property.description_en,
    overview: language === 'zh' ? property.description_zh : property.description_en,
    features: {
      interior: ['Hardwood Floors', 'Granite Countertops', 'Stainless Steel Appliances'],
      exterior: ['Private Terrace', 'City Views'],
      style: 'Contemporary',
      lotSize: property.sqft ? `${property.sqft} sqft` : 'N/A'
    },
    location: {
      lat: 3.1569,
      lng: 101.7123
    },
    schools: {
      elementary: [],
      highSchool: []
    },
    otherDetails: {
      daysOnMarket: 30,
      yearBuilt: 2020,
      garage: '2-car attached',
      accessibility: ['Elevator Access'],
      heating: 'Central Heating',
      cooling: 'Central Air Conditioning'
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Property Gallery */}
        <PropertyGallery images={mappedProperty.images} title={mappedProperty.title} />
        
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Property Overview */}
              <PropertyOverview property={mappedProperty} />
              
              {/* Property Details */}
              <PropertyDetails features={mappedProperty.features} />
              
              {/* School Information */}
              <SchoolInformation schools={mappedProperty.schools} />

              {/* Additional Information */}
              <OtherDetails details={mappedProperty.otherDetails} />

              {/* Map */}
              <PropertyMap 
                location={mappedProperty.location} 
                address={mappedProperty.address}
                title={mappedProperty.title}
              />

            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Mortgage Calculator */}
              <MortgageCalculator homePrice={mappedProperty.price} />

            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;
