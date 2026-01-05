import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, Maximize, Star, Images } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";
import roomStandard from "@/assets/room-standard.jpg";
import RoomDetailModal from "./RoomDetailModal";

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

// Fallback images mapping
const fallbackImages: Record<string, string> = {
  '/room-standard.jpg': roomStandard,
  '/room-deluxe.jpg': roomDeluxe,
  '/room-suite.jpg': roomSuite,
};

const RoomsSection = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching rooms:', error);
      } else {
        setRooms(data || []);
      }
      setLoading(false);
    };

    fetchRooms();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('rooms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms'
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return roomStandard;
    if (fallbackImages[imageUrl]) return fallbackImages[imageUrl];
    return imageUrl;
  };

  const getWhatsAppLink = (roomName: string) => {
    const phone = String(settings.whatsapp || '').replace(/[^0-9+]/g, '');
    const hotelName = String(settings.hotel_name || '');
    return `https://wa.me/${phone}?text=Halo,%20saya%20ingin%20memesan%20${encodeURIComponent(roomName)}%20di%20${encodeURIComponent(hotelName)}`;
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const getImageCount = (room: Room) => {
    const allImages = [
      ...(room.image_url ? [room.image_url] : []),
      ...(room.images || [])
    ].filter((url, index, self) => url && self.indexOf(url) === index);
    return allImages.length;
  };

  if (loading) {
    return (
      <section id="kamar" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-6" />
            <Skeleton className="h-4 w-full max-w-md mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="kamar" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-sm font-normal tracking-widest uppercase">
            Akomodasi
          </span>
          <h2 className="section-title text-foreground mt-4 mb-6">
            Pilihan Kamar Kami
          </h2>
          <p className="text-muted-foreground">
            Setiap kamar dirancang dengan perhatian khusus terhadap detail,
            memadukan kenyamanan modern dengan sentuhan elegan.
          </p>
        </div>

        {/* Room Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => {
            const imageCount = getImageCount(room);
            
            return (
              <div
                key={room.id}
                className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 animate-fade-up cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleRoomClick(room)}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getImageUrl(room.image_url)}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-gold text-primary px-3 py-1 rounded-full text-sm font-normal">
                    {formatPrice(room.price)}/malam
                  </div>
                  
                  {/* Multi-image indicator */}
                  {imageCount > 1 && (
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Images className="w-4 h-4 text-foreground" />
                      <span className="text-sm font-normal text-foreground">{imageCount}</span>
                    </div>
                  )}

                  {/* View details overlay */}
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-cream font-normal flex items-center gap-2">
                      Lihat Detail
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? "fill-gold text-gold" : "text-muted"}`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">4.5</span>
                  </div>

                  <h3 className="card-title text-foreground mb-2">
                    {room.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Features */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{room.capacity || '2 Tamu'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      <span>{room.room_size || '28 m²'}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  {room.features && room.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {room.features.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{room.features.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  )}

                  <a
                    href={getWhatsAppLink(room.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="gold" className="w-full group/btn relative overflow-hidden shadow-md hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Pesan Kamar
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <RoomDetailModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getImageUrl={getImageUrl}
      />
    </section>
  );
};

export default RoomsSection;