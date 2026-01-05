import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Maximize, Bed, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface Room {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  images: string[] | null;
  features: string[] | null;
  capacity: string | null;
  room_size: string | null;
  bed_type: string | null;
  is_active: boolean | null;
  sort_order: number | null;
}

interface RoomDetailModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  getImageUrl: (url: string | null) => string;
}

const RoomDetailModal = ({ room, isOpen, onClose, getImageUrl }: RoomDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { settings } = useSiteSettings();

  if (!room) return null;

  // Get all images (combine image_url and images array)
  const allImages = [
    ...(room.image_url ? [room.image_url] : []),
    ...(room.images || [])
  ].filter((url, index, self) => url && self.indexOf(url) === index);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getWhatsAppLink = () => {
    const phone = String(settings.whatsapp || '').replace(/[^0-9+]/g, '');
    const hotelName = String(settings.hotel_name || '');
    return `https://wa.me/${phone}?text=Halo,%20saya%20ingin%20memesan%20${encodeURIComponent(room.name)}%20di%20${encodeURIComponent(hotelName)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Image Gallery */}
        <div className="relative aspect-[16/10] bg-muted">
          <img
            src={getImageUrl(allImages[currentImageIndex] || null)}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          
          {/* Price Badge */}
          <div className="absolute top-4 left-4 bg-gold text-primary px-4 py-2 rounded-xl text-lg font-bold shadow-lg">
            {formatPrice(room.price)}<span className="text-sm font-normal">/malam</span>
          </div>
          
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
            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? "fill-gold text-gold" : "text-muted"}`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">4.5</span>
            </div>
            <DialogTitle className="font-display text-2xl md:text-3xl text-foreground">
              {room.name}
            </DialogTitle>
          </DialogHeader>

          {/* Description */}
          {room.description && (
            <p className="text-muted-foreground leading-relaxed">
              {room.description}
            </p>
          )}

          {/* Room Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kapasitas</p>
                <p className="font-medium text-foreground">{room.capacity || '2 Tamu'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                <Maximize className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Luas Kamar</p>
                <p className="font-medium text-foreground">{room.room_size || '28 m²'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                <Bed className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipe Kasur</p>
                <p className="font-medium text-foreground">{room.bed_type || 'King Size'}</p>
              </div>
            </div>
          </div>

          {/* Features/Amenities */}
          {room.features && room.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Fasilitas Kamar</h4>
              <div className="flex flex-wrap gap-2">
                {room.features.map((feature, index) => (
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
                      alt={`${room.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Book Button */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="gold" size="lg" className="w-full group relative overflow-hidden shadow-md hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
              <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Pesan Kamar Ini
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailModal;