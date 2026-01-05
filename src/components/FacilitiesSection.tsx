import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Waves, UtensilsCrossed, Sparkles, Dumbbell, TreePine, Coffee, Building, Images } from "lucide-react";
import facilityPool from "@/assets/facility-pool.jpg";
import facilityRestaurant from "@/assets/facility-restaurant.jpg";
import facilitySpa from "@/assets/facility-spa.jpg";
import facilityGym from "@/assets/facility-gym.jpg";
import facilityDanauResto from "@/assets/facility-danau-resto.jpg";
import facilityMasterPark from "@/assets/facility-master-park.jpg";
import FacilityDetailModal from "./FacilityDetailModal";

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

// Fallback images mapping
const fallbackImages: Record<string, string> = {
  '/facility-pool.jpg': facilityPool,
  '/facility-danau-resto.jpg': facilityDanauResto,
  '/facility-master-park.jpg': facilityMasterPark,
  '/facility-restaurant.jpg': facilityRestaurant,
  '/facility-spa.jpg': facilitySpa,
  '/facility-gym.jpg': facilityGym,
};

// Icon mapping based on facility name
const getIconForFacility = (name: string) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('kolam') || nameLower.includes('pool')) return Waves;
  if (nameLower.includes('danau')) return Coffee;
  if (nameLower.includes('park') || nameLower.includes('taman')) return TreePine;
  if (nameLower.includes('restoran') || nameLower.includes('bar')) return UtensilsCrossed;
  if (nameLower.includes('spa') || nameLower.includes('wellness')) return Sparkles;
  if (nameLower.includes('gym') || nameLower.includes('kebugaran')) return Dumbbell;
  return Building;
};

const FacilitiesSection = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching facilities:', error);
      } else {
        setFacilities(data || []);
      }
      setLoading(false);
    };

    fetchFacilities();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('facilities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'facilities'
        },
        () => {
          fetchFacilities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return facilityPool;
    if (fallbackImages[imageUrl]) return fallbackImages[imageUrl];
    return imageUrl;
  };

  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setIsModalOpen(true);
  };

  const getImageCount = (facility: Facility) => {
    const allImages = [
      ...(facility.image_url ? [facility.image_url] : []),
      ...(facility.images || [])
    ].filter((url, index, self) => url && self.indexOf(url) === index);
    return allImages.length;
  };

  if (loading) {
    return (
      <section id="fasilitas" className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-6" />
            <Skeleton className="h-4 w-full max-w-md mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="fasilitas" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-sm font-normal tracking-widest uppercase">
            Fasilitas
          </span>
          <h2 className="section-title text-foreground mt-4 mb-6">
            Fasilitas Premium
          </h2>
          <p className="text-muted-foreground">
            Kami menyediakan berbagai fasilitas kelas dunia untuk memastikan
            pengalaman menginap yang tak terlupakan.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => {
            const Icon = getIconForFacility(facility.name);
            const imageCount = getImageCount(facility);
            
            return (
              <div
                key={facility.id}
                className="group relative h-72 rounded-2xl overflow-hidden animate-fade-up cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleFacilityClick(facility)}
              >
                {/* Background Image */}
                <img
                  src={getImageUrl(facility.image_url)}
                  alt={facility.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent group-hover:from-primary/95 transition-colors" />

                {/* Multi-image indicator */}
                {imageCount > 1 && (
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Images className="w-4 h-4 text-foreground" />
                    <span className="text-sm font-normal text-foreground">{imageCount}</span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gold/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="card-title text-cream">
                      {facility.name}
                    </h3>
                  </div>
                  <p className="text-cream/80 text-sm max-w-md line-clamp-2">
                    {facility.description}
                  </p>
                  
                  {/* View details hint */}
                  <div className="mt-3 flex items-center gap-2 text-gold text-sm font-normal opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Lihat Detail</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <FacilityDetailModal
        facility={selectedFacility}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        getImageUrl={getImageUrl}
      />
    </section>
  );
};

export default FacilitiesSection;