import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Facility {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  images: string[] | null;
  features: string[] | null;
  operating_hours: string | null;
  capacity: string | null;
  price: number | null;
  is_active: boolean | null;
  sort_order: number | null;
}

interface FacilityDetailModalProps {
  facility: Facility | null;
  isOpen: boolean;
  onClose: () => void;
  getImageUrl: (url: string | null) => string;
}

const FacilityDetailModal = ({ facility, isOpen, onClose, getImageUrl }: FacilityDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!facility) return null;

  // Get all images (combine image_url and images array)
  const allImages = [
    ...(facility.image_url ? [facility.image_url] : []),
    ...(facility.images || [])
  ].filter((url, index, self) => url && self.indexOf(url) === index); // Remove duplicates

  const hasMultipleImages = allImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentImageIndex(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Image Gallery */}
        <div className="relative aspect-video bg-muted">
          <img
            src={getImageUrl(allImages[currentImageIndex] || null)}
            alt={facility.name}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          {hasMultipleImages && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={prevImage}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={nextImage}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-gold w-6' 
                        : 'bg-background/60 hover:bg-background/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl md:text-3xl text-foreground">
              {facility.name}
            </DialogTitle>
          </DialogHeader>

          {/* Description */}
          {facility.description && (
            <p className="text-muted-foreground leading-relaxed">
              {facility.description}
            </p>
          )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {facility.operating_hours && (
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jam Operasional</p>
                    <p className="font-medium text-foreground">{facility.operating_hours}</p>
                  </div>
                </div>
              )}
              
              {facility.capacity && (
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kapasitas</p>
                    <p className="font-medium text-foreground">{facility.capacity}</p>
                  </div>
                </div>
              )}

              {facility.price && (
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Biaya</p>
                    <p className="font-medium text-foreground">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0
                      }).format(facility.price)}
                    </p>
                  </div>
                </div>
              )}
            </div>

          {/* Features */}
          {facility.features && facility.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Fitur</h4>
              <div className="flex flex-wrap gap-2">
                {facility.features.map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-gold/10 text-gold border-gold/20 hover:bg-gold/20"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Thumbnail Gallery */}
          {hasMultipleImages && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Galeri</h4>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {allImages.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-gold ring-2 ring-gold/30' 
                        : 'border-transparent hover:border-muted-foreground/30'
                    }`}
                  >
                    <img
                      src={getImageUrl(url)}
                      alt={`${facility.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacilityDetailModal;