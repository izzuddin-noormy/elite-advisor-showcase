'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getVideoEmbed } from '@/lib/video';
import { track } from '@/lib/analytics';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  videoUrl?: string | null;
}

const PropertyGallery = ({ images, title, videoUrl }: PropertyGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const video = getVideoEmbed(videoUrl);
  const hasImages = images && images.length > 0;
  if (!hasImages && !video) return null;

  // When a video exists it takes the main slot, so thumbnails show all images.
  const thumbs = video ? images.slice(0, 4) : images.slice(1, 5);

  const openModal = (index: number) => {
    track('gallery_open', { context: 'property', index: index + 1 });
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

  // Keyboard navigation (← / →) and Escape while the modal is open
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, images.length]);

  return (
    <section className="bg-secondary/20 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto">
          {/* Main slot: video (if available) otherwise the selected image */}
          <div className="w-full xl:flex-[2] h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[360px] overflow-hidden rounded-lg shadow-lg bg-black">
            {video ? (
              video.type === 'file' ? (
                <video src={video.src} controls playsInline className="w-full h-full object-cover" />
              ) : (
                <iframe
                  src={video.src}
                  title={`${title} - Video`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )
            ) : (
              <img
                src={images[selectedImage]}
                alt={`${title} - Main View`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => openModal(selectedImage)}
              />
            )}
          </div>

          {/* Thumbnail Grid */}
          {thumbs.length > 0 && (
            <div className="w-full xl:flex-[1] grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              {thumbs.map((image, index) => {
                const actual = video ? index : index + 1;
                return (
                  <div
                    key={actual}
                    className="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[309/178] w-full cursor-pointer overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:opacity-75 hover:shadow-md"
                    onClick={() => openModal(actual)}
                  >
                    <img
                      src={image}
                      alt={`${title} - View ${actual + 1}`}
                      className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
                        !video && selectedImage === actual ? 'ring-2 ring-primary' : ''
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Mobile Image Navigation - Only show on mobile when thumbnails are hidden */}
        {!video && hasImages && <div className="flex justify-center mt-4 sm:mt-6 xl:hidden">

          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  selectedImage === index ? 'bg-primary scale-110' : 'bg-muted hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>}
      </div>

      {/* Fullscreen Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-screen-lg w-full h-screen bg-black/95 border-0 p-0 flex items-center justify-center [&>button]:hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 h-11 w-11 rounded-full bg-black/50 text-white border border-white/30 hover:bg-black/70 hover:text-white"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Previous image"
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/50 text-white border border-white/30 shadow-lg hover:bg-black/70 hover:text-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-7 w-7 sm:h-9 sm:w-9" />
              </Button>
            )}

            {/* Main Image */}
            <img
              src={images[modalImageIndex]}
              alt={`${title} - Image ${modalImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Next Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Next image"
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black/50 text-white border border-white/30 shadow-lg hover:bg-black/70 hover:text-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-7 w-7 sm:h-9 sm:w-9" />
              </Button>
            )}

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