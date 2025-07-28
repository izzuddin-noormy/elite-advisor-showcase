import { Card, CardContent } from '@/components/ui/card';

interface Features {
  interior: string[];
  exterior: string[];
  style: string;
  lotSize: string;
}

interface PropertyDetailsProps {
  features: Features;
}

const PropertyDetails = ({ features }: PropertyDetailsProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-8">
        <h2 className="font-serif text-2xl font-light text-primary mb-6">Property Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Interior Features */}
          <div>
            <h3 className="font-serif text-xl font-light text-primary mb-4">Interior Features</h3>
            <ul className="space-y-2">
              {features.interior.map((feature, index) => (
                <li key={index} className="font-body text-muted-foreground flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Exterior Features */}
          <div>
            <h3 className="font-serif text-xl font-light text-primary mb-4">Exterior Features</h3>
            <ul className="space-y-2">
              {features.exterior.map((feature, index) => (
                <li key={index} className="font-body text-muted-foreground flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Property Style & Lot Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-border">
          <div>
            <h3 className="font-serif text-xl font-light text-primary mb-2">Style</h3>
            <p className="font-body text-muted-foreground">{features.style}</p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-light text-primary mb-2">Lot Size</h3>
            <p className="font-body text-muted-foreground">{features.lotSize}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetails;