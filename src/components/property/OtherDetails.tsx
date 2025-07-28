import { Card, CardContent } from '@/components/ui/card';

interface OtherDetailsType {
  daysOnMarket: number;
  yearBuilt: number;
  garage: string;
  accessibility: string[];
  heating: string;
  cooling: string;
}

interface OtherDetailsProps {
  details: OtherDetailsType;
}

const OtherDetails = ({ details }: OtherDetailsProps) => {
  const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-3 border-b border-border last:border-b-0">
      <span className="font-body text-muted-foreground">{label}</span>
      <span className="font-body font-medium text-primary">{value}</span>
    </div>
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-8">
        <h2 className="font-serif text-2xl font-light text-primary mb-6">Additional Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Property Information */}
          <div>
            <h3 className="font-serif text-xl font-light text-primary mb-4">Property Information</h3>
            <div className="space-y-0">
              <DetailRow label="Days on Market" value={details.daysOnMarket} />
              <DetailRow label="Year Built" value={details.yearBuilt} />
              <DetailRow label="Heating" value={details.heating} />
              <DetailRow label="Cooling" value={details.cooling} />
              <DetailRow label="Garage" value={details.garage} />
            </div>
          </div>

          {/* Accessibility Features */}
          <div>
            <h3 className="font-serif text-xl font-light text-primary mb-4">Accessibility</h3>
            <ul className="space-y-2">
              {details.accessibility.map((feature, index) => (
                <li key={index} className="font-body text-muted-foreground flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OtherDetails;