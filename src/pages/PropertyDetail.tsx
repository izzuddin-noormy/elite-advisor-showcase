import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();

  // Dummy property data - would be fetched by ID in real app
  const properties: Record<string, Property> = {
    'imperial-suite': {
      id: 'imperial-suite',
      title: 'The Imperial Suite',
      address: '2847 P Street NW, Washington, DC 20007',
      price: 8880000,
      beds: 5,
      baths: 4.5,
      sqft: 4200,
      propertyType: 'Penthouse',
      images: [
        '/images/imperial-0.jpg',
        '/images/imperial-1.jpg',
        '/images/imperial-2.jpg',
        '/images/imperial-5.jpg',
        '/images/imperial-4.jpg'
      ],
      description: 'A luxury condominium set in a quiet alcove that comprises stately royal houses, embassies and official residences in the vicinity. Situated in the heart of Kuala Lumpur, it is well connected via excellent transport infrastructure and lies close to the Petronas Twin Tower and world-class amenities.',
      overview: 'This exceptional penthouse offers unparalleled luxury living in one of the most prestigious locations in the city. The spacious layout features floor-to-ceiling windows, premium finishes, and breathtaking city views. The gourmet kitchen is equipped with top-of-the-line appliances, while the master suite boasts a private terrace and spa-like bathroom. Additional amenities include a private elevator, smart home technology, and access to exclusive building facilities including a rooftop pool, fitness center, and concierge services.',
      features: {
        interior: ['Hardwood Floors', 'Granite Countertops', 'Stainless Steel Appliances', 'Walk-in Closets', 'Fireplace', 'Central Air', 'High Ceilings'],
        exterior: ['Private Terrace', 'City Views', 'Balcony', 'Rooftop Access'],
        style: 'Contemporary',
        lotSize: '0.25 acres'
      },
      location: {
        lat: 40.7831,
        lng: -73.9712
      },
      schools: {
        elementary: [
          { name: 'Georgetown Elementary', rating: 9, distance: '0.3 miles' },
          { name: 'Potomac Primary School', rating: 8, distance: '0.5 miles' }
        ],
        highSchool: [
          { name: 'Georgetown Preparatory', rating: 9, distance: '0.8 miles' },
          { name: 'Washington International School', rating: 8, distance: '1.2 miles' }
        ]
      },
      otherDetails: {
        daysOnMarket: 45,
        yearBuilt: 2019,
        garage: '2-car attached',
        accessibility: ['Elevator Access', 'Wide Doorways', 'Accessible Bathroom'],
        heating: 'Central Heating',
        cooling: 'Central Air Conditioning'
      }
    },
    'georgetown-estate': {
      id: 'georgetown-estate',
      title: 'Georgetown Estate',
      address: '2847 P Street NW, Washington, DC',
      price: 4850000,
      beds: 5,
      baths: 4.5,
      sqft: 4200,
      propertyType: 'Estate',
      images: ['/images/imperial-1.jpg', '/images/imperial-2.jpg', '/images/imperial-3.jpg'],
      description: 'Exquisite Georgetown estate featuring original hardwood floors, chef\'s kitchen, and private garden.',
      overview: 'This magnificent Georgetown estate combines historic charm with modern luxury. The property features original architectural details, premium finishes, and a beautifully landscaped private garden. The chef\'s kitchen is equipped with professional-grade appliances, while the spacious living areas offer elegant entertaining spaces.',
      features: {
        interior: ['Original Hardwood Floors', 'Chef\'s Kitchen', 'Crown Molding', 'Marble Bathrooms', 'Wine Cellar'],
        exterior: ['Private Garden', 'Covered Patio', 'Historic Facade'],
        style: 'Historic Georgian',
        lotSize: '0.18 acres'
      },
      location: { lat: 38.9072, lng: -77.0369 },
      schools: {
        elementary: [{ name: 'Georgetown Elementary', rating: 9, distance: '0.2 miles' }],
        highSchool: [{ name: 'Georgetown Preparatory', rating: 9, distance: '0.5 miles' }]
      },
      otherDetails: {
        daysOnMarket: 30,
        yearBuilt: 1925,
        garage: '2-car detached',
        accessibility: ['Wide Doorways'],
        heating: 'Radiant Heating',
        cooling: 'Central Air'
      }
    },
    'bethesda-contemporary': {
      id: 'bethesda-contemporary',
      title: 'Bethesda Contemporary',
      address: '7821 Woodmont Avenue, Bethesda, MD',
      price: 3200000,
      beds: 4,
      baths: 3.5,
      sqft: 3800,
      propertyType: 'Contemporary',
      images: ['/images/imperial-0.jpg', '/images/imperial-4.jpg', '/images/imperial-5.jpg'],
      description: 'Modern luxury home with floor-to-ceiling windows, open concept design, and premium finishes.',
      overview: 'This stunning contemporary home showcases modern design at its finest. Floor-to-ceiling windows flood the space with natural light, while the open concept layout creates seamless flow between living areas. Premium finishes and smart home technology throughout.',
      features: {
        interior: ['Floor-to-Ceiling Windows', 'Open Concept', 'Smart Home Technology', 'Italian Kitchen'],
        exterior: ['Modern Architecture', 'Landscaped Yard', 'Three-Car Garage'],
        style: 'Contemporary',
        lotSize: '0.22 acres'
      },
      location: { lat: 38.9847, lng: -77.0953 },
      schools: {
        elementary: [{ name: 'Bethesda Elementary', rating: 8, distance: '0.4 miles' }],
        highSchool: [{ name: 'Bethesda-Chevy Chase High', rating: 9, distance: '0.8 miles' }]
      },
      otherDetails: {
        daysOnMarket: 25,
        yearBuilt: 2020,
        garage: '3-car attached',
        accessibility: ['Elevator', 'Accessible Entrance'],
        heating: 'Geothermal',
        cooling: 'Zoned HVAC'
      }
    }
  };

  const property = properties[id || 'imperial-suite'] || properties['imperial-suite'];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Property Gallery */}
        <PropertyGallery images={property.images} title={property.title} />
        
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Property Overview */}
              <PropertyOverview property={property} />
              
              {/* Property Details */}
              <PropertyDetails features={property.features} />
              
              {/* School Information */}
              <SchoolInformation schools={property.schools} />
              
              {/* Other Details */}
              <OtherDetails details={property.otherDetails} />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Mortgage Calculator */}
              <MortgageCalculator homePrice={property.price} />
              
              {/* Map */}
              <PropertyMap 
                location={property.location} 
                address={property.address}
                title={property.title}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetail;
