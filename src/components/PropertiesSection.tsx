import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';

const PropertiesSection = () => {
  const properties = [
    {
      id: 1,
      image: property1,
      title: 'Georgetown Estate',
      address: '2847 P Street NW, Washington, DC',
      price: '$4,850,000',
      beds: 5,
      baths: 4.5,
      sqft: '4,200',
      status: 'Available'
    },
    {
      id: 2,
      image: property2,
      title: 'Bethesda Contemporary',
      address: '7821 Woodmont Avenue, Bethesda, MD',
      price: '$3,200,000',
      beds: 4,
      baths: 3.5,
      sqft: '3,800',
      status: 'Under Contract'
    },
    {
      id: 3,
      image: property3,
      title: 'McLean Luxury Home',
      address: '1456 Kirby Road, McLean, VA',
      price: '$5,750,000',
      beds: 6,
      baths: 5.5,
      sqft: '5,200',
      status: 'Available'
    }
  ];

  return (
    <section id="properties" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-primary mb-8">
            Featured Properties
          </h2>
          <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto">
            Discover exceptional properties in the most prestigious neighborhoods 
            throughout the Washington DC metropolitan area.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group bg-card rounded-none overflow-hidden hover-lift cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 text-xs font-body font-light tracking-wide ${
                      property.status === 'Available'
                        ? 'bg-gold text-primary'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-xl font-medium text-primary mb-2">
                  {property.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  {property.address}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl font-light text-primary">
                    {property.price}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground font-body font-light">
                  <span>{property.beds} Beds</span>
                  <span>•</span>
                  <span>{property.baths} Baths</span>
                  <span>•</span>
                  <span>{property.sqft} sq ft</span>
                </div>

                <div className="mt-6">
                  <button className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide"
          >
            View All Properties
          </a>
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;