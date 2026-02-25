import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, Maximize, Star, Images } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSectionContent } from "@/hooks/useSectionContent";
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

const fallbackImages: Record<string, string> = {
  "/room-standard.jpg": roomStandard,
  "/room-deluxe.jpg": roomDeluxe,
  "/room-suite.jpg": roomSuite,
};

const RoomsSection = () => {

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { settings } = useSiteSettings();
  const { sections } = useSectionContent();

  useEffect(() => {

    const fetchRooms = async () => {

      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching rooms:", error);
      } else {
        setRooms(data || []);
      }

      setLoading(false);
    };

    fetchRooms();

    const channel = supabase
      .channel("rooms-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        fetchRooms
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const getImageUrl = (url: string | null) => {
    if (!url) return roomStandard;
    if (fallbackImages[url]) return fallbackImages[url];
    return url;
  };

  const getWhatsAppLink = (roomName: string) => {

    const phone = String(settings.whatsapp || "").replace(/[^0-9+]/g, "");
    const hotelName = String(settings.hotel_name || "");

    return `https://wa.me/${phone}?text=Halo,%20saya%20ingin%20memesan%20${encodeURIComponent(roomName)}%20di%20${encodeURIComponent(hotelName)}`;
  };

  const openRoomModal = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const getImageCount = (room: Room) => {

    const images = [
      ...(room.image_url ? [room.image_url] : []),
      ...(room.images || []),
    ].filter((url, i, arr) => url && arr.indexOf(url) === i);

    return images.length;
  };

  if (loading) {
    return (
      <section id="kamar" className="py-20 lg:py-32 bg-background">

        <div className="container mx-auto px-4">

          <div className="max-w-3xl mx-auto mb-16">

            <Skeleton className="h-4 w-32 mx-auto mb-4" />

            <Skeleton className="h-6 w-full mb-4" />

            <Skeleton className="h-4 w-2/3 mx-auto" />

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

    <section
      id="kamar"
      className="py-20 lg:py-32 bg-background"
      aria-labelledby="rooms-heading"
    >

      <div className="container mx-auto px-4">

        {/* HEADER */}

        <header className="max-w-3xl mx-auto mb-16">

          <span className="block text-center text-gold text-sm tracking-widest uppercase">
            {sections.rooms.title}
          </span>

          <h5
            id="rooms-heading"
            className="
              mt-4
              mb-6
              font-sans
              font-medium
              text-lg
              md:text-xl
              lg:text-2xl
              text-foreground
              leading-relaxed
              text-justify
            "
          >
            {sections.rooms.subtitle}
          </h5>

          <p className="text-center text-muted-foreground leading-relaxed">
            Setiap kamar dirancang dengan perhatian khusus terhadap detail,
            memadukan kenyamanan modern dengan sentuhan elegan.
          </p>

        </header>

        {/* ROOMS GRID */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {rooms.map((room, index) => {

            const imageCount = getImageCount(room);

            return (

              <article
                key={room.id}
                onClick={() => openRoomModal(room)}
                className="
                  group
                  bg-card
                  rounded-xl
                  overflow-hidden
                  shadow-soft
                  hover:shadow-medium
                  transition-all
                  duration-500
                  cursor-pointer
                  animate-fade-up
                "
                style={{ animationDelay: `${index * 100}ms` }}
              >

                {/* IMAGE */}

                <div className="relative h-64 overflow-hidden">

                  <img
                    src={getImageUrl(room.image_url)}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute top-4 right-4 bg-gold text-primary px-3 py-1 rounded-full text-sm">
                    {formatPrice(room.price)}/malam
                  </div>

                  {imageCount > 1 && (

                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">

                      <Images className="w-4 h-4" />

                      <span className="text-sm">{imageCount}</span>

                    </div>

                  )}

                </div>

                {/* CONTENT */}

                <div className="p-6">

                  <div className="flex items-center gap-1 mb-3">

                    {[...Array(5)].map((_, i) => (

                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? "fill-gold text-gold" : "text-muted"
                        }`}
                      />

                    ))}

                    <span className="text-sm text-muted-foreground ml-2">
                      4.5
                    </span>

                  </div>

                  <h3 className="text-lg font-sans font-medium text-foreground mb-2">
                    {room.name}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">

                    <div className="flex items-center gap-1">

                      <Users className="w-4 h-4" />

                      <span>{room.capacity || "2 Tamu"}</span>

                    </div>

                    <div className="flex items-center gap-1">

                      <Maximize className="w-4 h-4" />

                      <span>{room.room_size || "28 m²"}</span>

                    </div>

                  </div>

                  <a
                    href={getWhatsAppLink(room.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <Button variant="gold" className="w-full">
                      Pesan Kamar
                    </Button>

                  </a>

                </div>

              </article>

            );
          })}

        </div>

      </div>

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
