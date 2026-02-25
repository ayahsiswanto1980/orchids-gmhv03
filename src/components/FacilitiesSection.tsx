import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Waves,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
  TreePine,
  Coffee,
  Building,
  Images,
} from "lucide-react";
import { useSectionContent } from "@/hooks/useSectionContent";

import facilityPool from "@/assets/facility-pool.jpg";
import facilityRestaurant from "@/assets/facility-restaurant.jpg";
import facilitySpa from "@/assets/facility-spa.jpg";
import facilityGym from "@/assets/facility-gym.jpg";
import facilityDanauResto from "@/assets/facility-danau-resto.jpg";
import facilityMasterPark from "@/assets/facility-master-park.jpg";

import FacilityDetailModal from "./FacilityDetailModal";

/* ================================
   Types
================================ */

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

/* ================================
   Fallback Images
================================ */

const fallbackImages: Record<string, string> = {
  "/facility-pool.jpg": facilityPool,
  "/facility-danau-resto.jpg": facilityDanauResto,
  "/facility-master-park.jpg": facilityMasterPark,
  "/facility-restaurant.jpg": facilityRestaurant,
  "/facility-spa.jpg": facilitySpa,
  "/facility-gym.jpg": facilityGym,
};

/* ================================
   Icon Resolver
================================ */

const resolveFacilityIcon = (name: string) => {
  const n = name.toLowerCase();

  if (n.includes("pool") || n.includes("kolam")) return Waves;
  if (n.includes("danau")) return Coffee;
  if (n.includes("park") || n.includes("taman")) return TreePine;
  if (n.includes("restoran") || n.includes("bar")) return UtensilsCrossed;
  if (n.includes("spa") || n.includes("wellness")) return Sparkles;
  if (n.includes("gym") || n.includes("kebugaran")) return Dumbbell;

  return Building;
};

/* ================================
   Component
================================ */

const FacilitiesSection = () => {
  const { sections } = useSectionContent();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFacility, setSelectedFacility] =
    useState<Facility | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  /* ================================
     Fetch Facilities
  ================================= */

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Facilities fetch error:", error);
        setFacilities([]);
      } else {
        setFacilities(data || []);
      }

      setLoading(false);
    };

    fetchFacilities();

    /* realtime */

    const channel = supabase
      .channel("facilities-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "facilities",
        },
        fetchFacilities
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  /* ================================
     Helpers
  ================================= */

  const resolveImage = (url: string | null) => {
    if (!url) return facilityPool;
    return fallbackImages[url] || url;
  };

  const getImageCount = (facility: Facility) => {
    const imgs = [
      ...(facility.image_url ? [facility.image_url] : []),
      ...(facility.images || []),
    ].filter(Boolean);

    return [...new Set(imgs)].length;
  };

  const openFacility = (facility: Facility) => {
    setSelectedFacility(facility);
    setModalOpen(true);
  };

  /* ================================
     Loading
  ================================= */

  if (loading) {
    return (
      <section
        id="fasilitas"
        className="py-20 lg:py-32 bg-secondary/30"
      >
        <div className="container mx-auto px-4">

          <header className="text-center max-w-2xl mx-auto mb-16">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-3" />
            <Skeleton className="h-4 w-full max-w-md mx-auto" />
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-72 rounded-2xl"
              />
            ))}
          </div>

        </div>
      </section>
    );
  }

  if (!facilities.length) return null;

  /* ================================
     Render
  ================================= */

  return (
    <section
      id="fasilitas"
      className="py-20 lg:py-32 bg-secondary/30"
    >

      <div className="container mx-auto px-4">

        {/* ================================
            Header (SEO Correct)
        ================================= */}

        <header className="text-center max-w-2xl mx-auto mb-16">

          <span className="text-gold text-sm tracking-widest uppercase">
            {sections.facilities.title}
          </span>

          <h2 className="section-title text-foreground mt-4">
            Fasilitas Hotel
          </h2>

          <h4 className="text-muted-foreground mt-3 font-normal leading-relaxed text-justify text-center">
            {sections.facilities.subtitle}
          </h4>

        </header>

        {/* ================================
            Facilities Grid
        ================================= */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {facilities.map((facility, index) => {

            const Icon = resolveFacilityIcon(facility.name);

            const imageCount = getImageCount(facility);

            return (
              <article
                key={facility.id}
                onClick={() => openFacility(facility)}
                className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer animate-fade-up"
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >

                {/* Image */}

                <img
                  src={resolveImage(facility.image_url)}
                  alt={facility.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

                {/* Image count */}

                {imageCount > 1 && (
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                    <Images className="w-4 h-4" />
                    <span className="text-sm">
                      {imageCount}
                    </span>
                  </div>
                )}

                {/* Content */}

                <div className="absolute bottom-0 p-6">

                  <div className="flex items-center gap-3 mb-2">

                    <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>

                    <h3 className="card-title text-cream">
                      {facility.name}
                    </h3>

                  </div>

                  {facility.description && (
                    <p className="text-cream/80 text-sm line-clamp-2">
                      {facility.description}
                    </p>
                  )}

                  <div className="text-gold text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Lihat Detail →
                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </div>

      {/* Modal */}

      <FacilityDetailModal
        facility={selectedFacility}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        getImageUrl={resolveImage}
      />

    </section>
  );
};

export default FacilitiesSection;
