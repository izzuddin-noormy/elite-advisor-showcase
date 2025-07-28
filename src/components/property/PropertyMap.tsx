import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PropertyMapProps {
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  title: string;
}

const PropertyMap = ({ location, address, title }: PropertyMapProps) => {
  // For now, we'll show a placeholder. In a real app, you'd integrate with Google Maps API
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="font-serif text-xl font-light text-primary">
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64 bg-muted rounded-b-lg relative overflow-hidden">
          {/* Placeholder map - replace with actual Google Maps embed */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-body text-sm text-muted-foreground">
                Interactive Map
              </p>
              <p className="font-body text-xs text-muted-foreground mt-1">
                {address}
              </p>
            </div>
          </div>
          
          {/* In a real implementation, you would use:
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          */}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyMap;