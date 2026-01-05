import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Skeleton } from "@/components/ui/skeleton";

const LocationSection = () => {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <section id="lokasi" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-6" />
            <Skeleton className="h-4 w-full max-w-md mx-auto" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="h-96 rounded-2xl" />
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const whatsappLink = `https://wa.me/${String(settings.whatsapp || '').replace(/[^0-9+]/g, '')}`;
  const mapsDirectionLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(String(settings.address || ''))}`;

  return (
    <section id="lokasi" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-sm font-normal tracking-widest uppercase">
            Lokasi
          </span>
          <h2 className="section-title text-foreground mt-4 mb-6">
            Temukan Kami
          </h2>
          <p className="text-muted-foreground">
            Terletak strategis di pusat kota Purwodadi, mudah dijangkau dari
            berbagai arah.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="relative h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden bg-secondary animate-fade-up group shadow-xl">
            {/* Decorative border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-gold/20 z-10 pointer-events-none" />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-gold rounded-tl-2xl z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-gold rounded-tr-2xl z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-gold rounded-bl-2xl z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-gold rounded-br-2xl z-10 pointer-events-none" />
            
            {settings.google_maps_url && (
              <iframe
                src={settings.google_maps_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-transform duration-700 group-hover:scale-105"
              />
            )}
            
            {/* Hover overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
            
            {/* Location pin badge */}
            <div className="absolute top-4 left-4 bg-gold text-navy px-4 py-2 rounded-full font-normal text-sm z-20 shadow-lg flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {settings.hotel_name}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center animate-fade-up delay-200">
            <div className="space-y-8">
              {/* Address */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="column-title text-foreground mb-1">
                    Alamat
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {settings.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="column-title text-foreground mb-1">
                    Telepon
                  </h3>
                  <p className="text-muted-foreground">
                    {settings.phone}
                    <br />
                    <a 
                      href={whatsappLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 transition-colors inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {settings.whatsapp} (WhatsApp)
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="column-title text-foreground mb-1">
                    Email
                  </h3>
                  <p className="text-muted-foreground">
                    <a href={`mailto:${settings.email}`} className="hover:text-gold transition-colors">
                      {settings.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="column-title text-foreground mb-1">
                    Check-in / Check-out
                  </h3>
                  <p className="text-muted-foreground">
                    Check-in: {settings.check_in_time}
                    <br />
                    Check-out: {settings.check_out_time}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a href={mapsDirectionLink} target="_blank" rel="noopener noreferrer">
                <Button variant="gold" size="xl">
                  Petunjuk Arah
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
