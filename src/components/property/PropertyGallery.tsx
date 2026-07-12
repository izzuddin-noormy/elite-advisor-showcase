'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Images } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const video = getVideoEmbed(videoUrl);
  const hasImages = images && images.length > 0;

  // When a video exists it takes the main slot, so thumbnails show all images.
  // Otherwise the first image is the hero and we preview the next six.
  const thumbs = video ? images.slice(0, 6) : images.slice(1, 7);
  const shownImages = video ? 6 : 7; // hero + 6 (or 6 thumbs alongside the video)
  const remaining = Math.max(0, images.length - shownImages);

  const openModal = (index: number) => {
    track('gallery_open', { context: 'property', index: index + 1 });
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Select an image as the top preview and scroll back up (collage mode — no arrows).
  const previewInModal = (index: number) => {
    setModalImageIndex(index);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Escape closes the modal.
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

  if (!hasImages && !video) return null;

  return (
    <section className="bg-secondary/20 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto">
          {/* Main slot: video (if available) otherwise the selected image */}
          <div className="relative w-full xl:flex-[2] h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[420px] overflow-hidden rounded-lg shadow-lg bg-black">
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

            {/* Photo count badge */}
            {hasImages && (
              <button
                onClick={() => openModal(video ? 0 : selectedImage)}
                className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                aria-label={`View all ${images.length} photos`}
              >
                <Images className="h-4 w-4" />
                {images.length} {images.length === 1 ? 'photo' : 'photos'}
              </button>
            )}
          </div>

          {/* Thumbnail Grid — up to 6 previews */}
          {thumbs.length > 0 && (
            <div className="w-full xl:flex-[1] grid grid-cols-2 grid-rows-3 gap-2 sm:gap-3 lg:gap-4 xl:h-[420px]">
              {thumbs.map((image, index) => {
                const actual = video ? index : index + 1;
                const isLast = index === thumbs.length - 1;
                return (
                  <div
                    key={actual}
                    className="relative aspect-[16/10] sm:aspect-[4/3] xl:aspect-auto w-full h-full cursor-pointer overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:opacity-90 hover:shadow-md"
                    onClick={() => openModal(actual)}
                  >
                    <img
                      src={image}
                      alt={`${title} - View ${actual + 1}`}
                      className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
                        !video && selectedImage === actual ? 'ring-2 ring-primary' : ''
                      }`}
                    />
                    {/* "+N more" overlay on the last thumbnail */}
                    {isLast && remaining > 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white transition-colors hover:bg-black/70">
                        <span className="text-lg sm:text-xl font-semibold">+{remaining}</span>
                        <span className="text-[10px] sm:text-xs tracking-wide uppercase">View all</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile dot navigation for the hero image */}
        {!video && hasImages && (
          <div className="flex justify-center mt-4 sm:mt-6 xl:hidden">
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
          </div>
        )}
      </div>

      {/* Collage Modal — preview on top, scroll down for all images (no prev/next) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-screen-xl w-full h-screen bg-black/95 border-0 p-0 [&>button]:hidden">
          <div ref={scrollRef} className="relative w-full h-full overflow-y-auto">
            {/* Close Button (fixed) */}
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 right-4 z-50 h-11 w-11 rounded-full bg-black/50 text-white border border-white/30 hover:bg-black/70 hover:text-white"
              onClick={closeModal}
              aria-label="Close gallery"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Top preview */}
            <div className="flex items-center justify-center p-3 sm:p-6 lg:p-10">
              <img
                src={images[modalImageIndex]}
                alt={`${title} - Image ${modalImageIndex + 1}`}
                className="max-w-full max-h-[78vh] w-auto object-contain rounded-lg"
              />
            </div>

            {/* All photos collage */}
            <div className="px-3 sm:px-6 lg:px-10 pb-16">
              <p className="mb-3 text-sm font-medium tracking-wide text-white/70">
                All {images.length} {images.length === 1 ? 'photo' : 'photos'}
              </p>
              <div className="gap-3 [column-fill:_balance] columns-1 sm:columns-2 lg:columns-3">
                {images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => previewInModal(i)}
                    className={`mb-3 block w-full break-inside-avoid overflow-hidden rounded-lg transition-opacity hover:opacity-90 ${
                      i === modalImageIndex ? 'ring-2 ring-white' : ''
                    }`}
                    aria-label={`Show photo ${i + 1}`}
                  >
                    <img src={image} alt={`${title} - Thumbnail ${i + 1}`} className="w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PropertyGallery;
