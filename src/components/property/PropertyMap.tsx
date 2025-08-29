import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as maptiler from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

interface PropertyMapProps {
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  title: string;
}

const PropertyMap = ({ location, address, title }: PropertyMapProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptiler.Map | null>(null);

  // MapTiler API key
  const MAPTILER_API_KEY = '522410ba274148eab613f22043e33480_c408bf3c0a10d029576ec940b09fa963a68890c30308868d1c8fcfe2f92b5c99';

  useEffect(() => {
    if (!mapContainer.current || !isModalOpen) return;

    // Set MapTiler API key
    maptiler.config.apiKey = MAPTILER_API_KEY;

    // Initialize map
    map.current = new maptiler.Map({
      container: mapContainer.current,
      style: maptiler.MapStyle.STREETS,
      center: [location.lng, location.lat],
      zoom: 15,
      pitch: 0,
    });

    // Add marker at property location
    new maptiler.Marker({ color: 'hsl(var(--primary))' })
      .setLngLat([location.lng, location.lat])
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new maptiler.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [isModalOpen, location.lat, location.lng]);

  return (
    <>
      <Card className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300" onClick={() => setIsModalOpen(true)}>
        <CardHeader>
          <CardTitle className="font-serif text-xl font-light text-primary">
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 bg-muted rounded-b-lg relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/30 transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <p className="font-body text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  Click to view map
                </p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {address}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="w-[95vw] max-w-4xl h-[90vh] p-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col"
              >
                <DialogHeader className="p-6 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="font-serif text-xl font-light text-primary">
                      {title} - Location
                    </DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsModalOpen(false)}
                      className="hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground font-body">
                    {address}
                  </p>
                </DialogHeader>
                
                <div className="flex-1 p-6 pt-4">
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    <div
                      ref={mapContainer}
                      className="w-full h-full"
                      style={{ minHeight: '400px' }}
                    />
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyMap;