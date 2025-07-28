import { useState } from 'react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <section className="bg-secondary/20 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Image */}
          <div className="lg:w-[622px] lg:h-[360px] w-full h-64 md:h-80">
            <img
              src={images[selectedImage]}
              alt={`${title} - Main View`}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 gap-2 lg:w-[309px]">
            {images.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="lg:w-[150px] lg:h-[178px] w-full h-24 md:h-32 cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => setSelectedImage(index + 1)}
              >
                <img
                  src={image}
                  alt={`${title} - View ${index + 2}`}
                  className={`w-full h-full object-cover rounded-lg ${
                    selectedImage === index + 1 ? 'ring-2 ring-primary' : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Image Navigation */}
        <div className="flex justify-center mt-4 lg:hidden">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-3 h-3 rounded-full ${
                  selectedImage === index ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyGallery;