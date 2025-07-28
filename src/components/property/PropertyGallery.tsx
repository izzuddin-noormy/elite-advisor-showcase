import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="bg-secondary/20 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
          {/* Main Image */}
          <div className="flex-1 lg:flex-[2] w-full h-64 md:h-80 lg:h-[360px] cursor-pointer overflow-hidden rounded-lg">
            <img
              src={images[selectedImage]}
              alt={`${title} - Main View`}
              className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              onClick={() => openModal(selectedImage)}
            />
          </div>
          
          {/* Thumbnail Grid */}
          <div className="flex-1 lg:flex-[1] grid grid-cols-2 gap-2 w-full">
            {images.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="aspect-[309/178] w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:opacity-75"
                onClick={() => setSelectedImage(index + 1)}
              >
                <img
                  src={image}
                  alt={`${title} - View ${index + 2}`}
                  className={`w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105 ${
                    selectedImage === index + 1 ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(index + 1);
                  }}
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

      {/* Fullscreen Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-screen-lg w-full h-screen bg-black/95 border-0 p-0 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {/* Main Image */}
            <img
              src={images[modalImageIndex]}
              alt={`${title} - Image ${modalImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {modalImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PropertyGallery;