import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
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

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  price: number | null;
  is_active: boolean | null;
  sort_order: number | null;
}

// Icon mapping
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

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
      setLoading(false);
    };

    fetchServices();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services'
        },
        () => {
          fetchServices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return HelpCircle;
    return iconMap[iconName] || HelpCircle;
  };

  if (loading) {
    return (
      <section id="layanan" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-6" />
            <Skeleton className="h-4 w-full max-w-md mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-4 mb-3">
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

  return (
    <section id="layanan" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-sm font-normal tracking-widest uppercase">
            Layanan
          </span>
          <h2 className="section-title text-foreground mt-4 mb-6">
            Layanan Unggulan
          </h2>
          <p className="text-muted-foreground">
            Tim profesional kami berkomitmen memberikan layanan terbaik untuk
            memenuhi setiap kebutuhan Anda.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon);
            return (
              <div
                key={service.id}
                className="group p-6 bg-card rounded-xl border border-border hover:border-gold/30 hover:shadow-medium transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="card-title text-foreground">
                    {service.title}
                  </h3>
                </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {service.description}
                  </p>
                  
                  {service.price && (
                    <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-normal">Biaya mulai dari</span>
                      <span className="text-sm font-normal text-gold">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0
                        }).format(service.price)}
                      </span>
                    </div>
                  )}
                </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
