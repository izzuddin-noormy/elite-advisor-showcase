import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // Google Maps embed URL using the address
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCNCZ0Twm_HFRaZ5i-FuPDYs3rLwm4_848&q=${encodeURIComponent(address)}`;

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
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: '400px' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map showing ${address}`}
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