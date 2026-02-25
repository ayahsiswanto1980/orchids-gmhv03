import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSectionContent } from "@/hooks/useSectionContent";

import {
  Car,
  Wifi,
  Clock,
  Utensils,
  ShieldCheck,
  Shirt,
  CarFront,
  Plane,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

/* ================================
   Types
================================ */

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  price: number | null;
  is_active: boolean | null;
  sort_order: number | null;
}

/* ================================
   Icon Mapping
================================ */

const iconMap: Record<string, LucideIcon> = {
  Car,
  Wifi,
  Clock,
  Utensils,
  ShieldCheck,
  Shirt,
  CarFront,
  Plane,
};

const getIcon = (iconName: string | null): LucideIcon => {
  if (!iconName) return HelpCircle;
  return iconMap[iconName] || HelpCircle;
};

/* ================================
   Component
================================ */

const ServicesSection = () => {
  const { sections } = useSectionContent();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================================
     Fetch Services
  ================================= */

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } else {
        setServices(data || []);
      }

      setLoading(false);
    };

    fetchServices();

    /* Realtime subscription */

    const channel = supabase
      .channel("services-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "services",
        },
        fetchServices
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ================================
     Helpers
  ================================= */

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  /* ================================
     Loading State
  ================================= */

  if (loading) {
    return (
      <section id="layanan" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">

          <header className="text-center max-w-2xl mx-auto mb-16">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-3" />
            <Skeleton className="h-4 w-full max-w-md mx-auto" />
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="p-6 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>

        </div>
      </section>
    );
  }

  if (services.length === 0) return null;

  /* ================================
     Render
  ================================= */

  return (
    <section id="layanan" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">

        {/* ================================
            Header (SEO Correct)
        ================================= */}

        <header className="text-center max-w-2xl mx-auto mb-16">

          {/* Label */}
          <span className="text-gold text-sm tracking-widest uppercase">
            {sections.services.title}
          </span>

          {/* Main heading */}
          <h2 className="section-title text-foreground mt-4">
            Layanan Hotel
          </h2>

          {/* Subtitle */}
          <h4 className="text-muted-foreground mt-3 font-normal">
            {sections.services.subtitle}
          </h4>

        </header>

        {/* ================================
            Services Grid
        ================================= */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {services.map((service, index) => {
            const Icon = getIcon(service.icon);

            return (
              <article
                key={service.id}
                className="group p-6 bg-card rounded-xl border border-border hover:border-gold/30 hover:shadow-medium transition-all duration-300 animate-fade-up"
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
              >

                {/* Header */}
                <div className="flex items-center gap-4 mb-3">

                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>

                  <h3 className="card-title text-foreground">
                    {service.title}
                  </h3>

                </div>

                {/* Description */}
                {service.description && (
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                )}

                {/* Price */}
                {service.price && (
                  <div className="pt-4 border-t border-border flex justify-between items-center">

                    <span className="text-xs text-muted-foreground">
                      Biaya mulai dari
                    </span>

                    <span className="text-sm font-medium text-gold">
                      {formatPrice(service.price)}
                    </span>

                  </div>
                )}

              </article>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
