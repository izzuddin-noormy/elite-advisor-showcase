import { Card, CardContent } from '@/components/ui/card';

interface School {
  name: string;
  rating: number;
  distance: string;
}

interface Schools {
  elementary: School[];
  highSchool: School[];
}

interface SchoolInformationProps {
  schools: Schools;
}

const SchoolInformation = ({ schools }: SchoolInformationProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-muted'}`}
      >
        ★
      </span>
    ));
  };

  const SchoolList = ({ title, schoolList }: { title: string; schoolList: School[] }) => (
    <div>
      <h3 className="font-serif text-xl font-light text-primary mb-4">{title}</h3>
      <div className="space-y-4">
        {schoolList.map((school, index) => (
          <div key={index} className="border-b border-border pb-3 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-body font-medium text-primary">{school.name}</h4>
              <span className="font-body text-sm text-muted-foreground">{school.distance}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(school.rating)}
              </div>
              <span className="font-body text-sm text-muted-foreground">
                {school.rating}/10
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-8">
        <h2 className="font-serif text-2xl font-light text-primary mb-6">School Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SchoolList title="Elementary Schools" schoolList={schools.elementary} />
          <SchoolList title="High Schools" schoolList={schools.highSchool} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolInformation;