import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Property {
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  description: string;
  overview: string;
}

interface PropertyOverviewProps {
  property: Property;
}

const PropertyOverview = ({ property }: PropertyOverviewProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  return (
    <div className="space-y-8">
      {/* Property Header */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-light text-primary mb-2">
              {property.title}
            </h1>
            <p className="font-body text-lg text-muted-foreground mb-4">
              {property.address}
            </p>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl lg:text-4xl font-light text-primary">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>

        {/* Property Stats */}
        <div className="flex flex-wrap gap-8 text-muted-foreground font-body">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-light text-primary">{property.beds}</span>
            <span>Beds</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-light text-primary">{property.baths}</span>
            <span>Baths</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-light text-primary">{formatNumber(property.sqft)}</span>
            <span>Sq Ft</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-light text-primary">{property.propertyType}</span>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8">
          <h2 className="font-serif text-2xl font-light text-primary mb-6">Overview</h2>
          <div className="space-y-4">
            <p className="font-body text-muted-foreground leading-relaxed">
              {showFullDescription 
                ? property.overview 
                : truncateText(property.overview, 300)
              }
            </p>
            {property.overview.length > 300 && (
              <Button
                variant="link"
                className="p-0 h-auto text-primary hover:text-primary/80"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? 'Read less' : 'Read more'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyOverview;