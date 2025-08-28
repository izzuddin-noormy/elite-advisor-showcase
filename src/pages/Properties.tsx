import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CurrencySwitch, { Currency } from '@/components/CurrencySwitch';
import { convertPrice } from '@/utils/currency';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';
import { useLanguage } from '@/contexts/LanguageContext';

const Properties = () => {
  const { t } = useLanguage();
  const [currency, setCurrency] = useState<Currency>('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const properties = [
    {
      id: 1,
      slug: 'georgetown-estate',
      image: property1,
      title: 'Georgetown Estate',
      address: '2847 P Street NW, Washington, DC',
      price: '$4,850,000',
      beds: 5,
      baths: 4.5,
      sqft: '4,200',
      status: 'Available',
      description:
        "Exquisite Georgetown estate featuring original hardwood floors, chef's kitchen, and private garden.",
    },
    {
      id: 2,
      slug: 'bethesda-contemporary',
      image: property2,
      title: 'Bethesda Contemporary',
      address: '7821 Woodmont Avenue, Bethesda, MD',
      price: '$3,200,000',
      beds: 4,
      baths: 3.5,
      sqft: '3,800',
      status: 'Under Contract',
      description:
        'Modern luxury home with floor-to-ceiling windows, open concept design, and premium finishes.',
    },
    {
      id: 3,
      slug: 'mclean-luxury-home',
      image: property3,
      title: 'McLean Luxury Home',
      address: '1456 Kirby Road, McLean, VA',
      price: '$5,750,000',
      beds: 6,
      baths: 5.5,
      sqft: '5,200',
      status: 'Available',
      description:
        'Stunning colonial estate on private 2-acre lot with pool, tennis court, and guest house.',
    },
    {
      id: 4,
      slug: 'capitol-hill-townhouse',
      image: property1,
      title: 'Capitol Hill Townhouse',
      address: '234 A Street SE, Washington, DC',
      price: '$2,850,000',
      beds: 4,
      baths: 3.5,
      sqft: '3,200',
      status: 'Available',
      description:
        'Historic townhouse completely renovated with modern amenities while preserving original charm.',
    },
    {
      id: 5,
      slug: 'arlington-heights-modern',
      image: property2,
      title: 'Arlington Heights Modern',
      address: '5678 Wilson Boulevard, Arlington, VA',
      price: '$4,200,000',
      beds: 5,
      baths: 4,
      sqft: '4,800',
      status: 'Available',
      description:
        'Contemporary home with smart home technology, wine cellar, and panoramic city views.',
    },
    {
      id: 6,
      slug: 'potomac-waterfront-estate',
      image: property3,
      title: 'Potomac Waterfront Estate',
      address: '9876 River Road, Potomac, MD',
      price: '$7,950,000',
      beds: 7,
      baths: 6.5,
      sqft: '8,500',
      status: 'Available',
      description:
        'Magnificent waterfront estate with private dock, infinity pool, and 180-degree river views.',
    },
    {
      id: 7,
      slug: 'georgetown-estate-2',
      image: property1,
      title: 'Georgetown Estate',
      address: '2847 P Street NW, Washington, DC',
      price: '$4,850,000',
      beds: 5,
      baths: 4.5,
      sqft: '4,200',
      status: 'Available',
      description:
        "Exquisite Georgetown estate featuring original hardwood floors, chef's kitchen, and private garden.",
    },
    {
      id: 8,
      slug: 'bethesda-contemporary-2',
      image: property2,
      title: 'Bethesda Contemporary',
      address: '7821 Woodmont Avenue, Bethesda, MD',
      price: '$3,200,000',
      beds: 4,
      baths: 3.5,
      sqft: '3,800',
      status: 'Under Contract',
      description:
        'Modern luxury home with floor-to-ceiling windows, open concept design, and premium finishes.',
    },
    {
      id: 9,
      slug: 'mclean-luxury-home-2',
      image: property3,
      title: 'McLean Luxury Home',
      address: '1456 Kirby Road, McLean, VA',
      price: '$5,750,000',
      beds: 6,
      baths: 5.5,
      sqft: '5,200',
      status: 'Available',
      description:
        'Stunning colonial estate on private 2-acre lot with pool, tennis court, and guest house.',
    },
    {
      id: 10,
      slug: 'capitol-hill-townhouse',
      image: property1,
      title: 'Capitol Hill Townhouse',
      address: '234 A Street SE, Washington, DC',
      price: '$2,850,000',
      beds: 4,
      baths: 3.5,
      sqft: '3,200',
      status: 'Available',
      description:
        'Historic townhouse completely renovated with modern amenities while preserving original charm.',
    },
    {
      id: 11,
      slug: 'arlington-heights-modern',
      image: property2,
      title: 'Arlington Heights Modern',
      address: '5678 Wilson Boulevard, Arlington, VA',
      price: '$4,200,000',
      beds: 5,
      baths: 4,
      sqft: '4,800',
      status: 'Available',
      description:
        'Contemporary home with smart home technology, wine cellar, and panoramic city views.',
    },
    {
      id: 12,
      slug: 'potomac-waterfront-estate',
      image: property3,
      title: 'Potomac Waterfront Estate',
      address: '9876 River Road, Potomac, MD',
      price: '$7,950,000',
      beds: 7,
      baths: 6.5,
      sqft: '8,500',
      status: 'Available',
      description:
        'Magnificent waterfront estate with private dock, infinity pool, and 180-degree river views.',
    }
  ];

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;

    return properties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [properties, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProperties.slice(start, end);
  }, [filteredProperties, currentPage]);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="section-heading text-primary mb-4">
                {t('properties.title')}
              </h1>
              <p className="font-body text-lg font-light text-muted-foreground max-w-2xl">
                {t('properties.subtitle')}
              </p>
            </div>

            <div className="mt-6 md:mt-0">
              <CurrencySwitch
                currency={currency}
                onCurrencyChange={setCurrency}
                className="justify-end"
              />
            </div>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder={t('properties.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // reset to first page on search
                }}
                className="w-full pl-12 pr-16 py-6 text-lg font-body font-light bg-card border-border/50 rounded-xl shadow-luxury focus:shadow-lg focus:border-primary/20 transition-all duration-300 placeholder:text-muted-foreground/60"
              />
              <!-- 
              <button className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-primary transition-colors">
                <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-sm font-light">
                  +
                </div>
              </button>
              -->
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="pb-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProperties.map((property) => (
              <Link
                key={property.id}
                to={`/projects/${property.slug}`}
                className="group bg-card rounded-none overflow-hidden hover-lift cursor-pointer block"
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
                      {t(
                        `properties.status.${
                          property.status === 'Under Contract'
                            ? 'underContract'
                            : property.status.toLowerCase()
                        }`
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-xl font-medium text-primary mb-2">
                    {property.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-3">
                    {property.address}
                  </p>
                  <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-light text-primary">
                      {convertPrice(property.price, currency)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground font-body font-light mb-6">
                    <span>{property.beds} {t('properties.beds')}</span>
                    <span>•</span>
                    <span>{property.baths} {t('properties.baths')}</span>
                    <span>•</span>
                    <span>{property.sqft} {t('properties.sqft')}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-body text-sm font-light tracking-wide text-center">
                      {t('properties.viewDetails')}
                    </div>
                    <button className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-body text-sm font-light tracking-wide">
                      {t('properties.scheduleViewing')}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12 flex-wrap">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-primary text-primary disabled:opacity-50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {t('properties.prev')}
              </button>

              {/* Desktop full page numbers */}
              <div className="hidden sm:flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border ${
                      currentPage === i + 1
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                    } transition-all duration-300`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Mobile compact view */}
              <div className="flex sm:hidden items-center space-x-2">
                <span className="px-3 py-2 border border-primary text-primary rounded">
                  {currentPage}
                </span>
                <span className="text-muted-foreground">/ {totalPages}</span>
              </div>

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-primary text-primary disabled:opacity-50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {t('properties.next')}
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
