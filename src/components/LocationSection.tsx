import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSectionContent } from "@/hooks/useSectionContent";
import { Skeleton } from "@/components/ui/skeleton";

const LocationSection = () => {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const { sections, loading: sectionsLoading } = useSectionContent();

  const loading = settingsLoading || sectionsLoading;

  const whatsappLink = `https://wa.me/${String(
    settings?.whatsapp || ""
  ).replace(/[^0-9]/g, "")}`;

  const mapsDirectionLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    String(settings?.address || "")
  )}`;

  /* =========================
     Loading Skeleton
  ========================= */
  if (loading) {
    return (
      <section id="lokasi" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">

          {/* Header Skeleton */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-full max-w-md mx-auto" />
          </div>

          {/* Content Skeleton */}
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="h-96 rounded-2xl" />

            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
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

  /* =========================
     Main Render
  ========================= */
  return (
    <section id="lokasi" className="py-20 lg:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">

        {/* =========================
            Section Header
        ========================= */}
        <div className="max-w-2xl mx-auto mb-16 text-center">

          {/* Eyebrow */}
          <span className="block text-gold text-sm tracking-widest uppercase mb-3">
            {sections.location.title}
          </span>

          {/* Subtitle (H5 - smaller, justify) */}
          <h5 className="text-lg md:text-xl font-serif text-foreground mb-4 text-justify text-center md:text-center">
            {sections.location.subtitle}
          </h5>

          {/* Description */}
          <p className="text-muted-foreground text-sm md:text-base text-justify">
            Terletak strategis di pusat kota Purwodadi, mudah dijangkau dari
            berbagai arah dan memberikan akses cepat ke berbagai destinasi
            penting di sekitarnya.
          </p>

        </div>


        {/* =========================
            Grid Content
        ========================= */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* =========================
              Map Container
          ========================= */}
          <div className="relative h-96 lg:h-full min-h-[420px] rounded-2xl overflow-hidden shadow-xl group">

            {/* Border accents */}
            <div className="absolute inset-0 border border-gold/20 rounded-2xl z-10 pointer-events-none" />

            {settings.google_maps_url && (
              <iframe
                src={settings.google_maps_url}
                className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}

            {/* Badge */}
            <div className="absolute top-4 left-4 bg-gold text-navy px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2 z-20">
              <MapPin className="w-4 h-4" />
              {settings.hotel_name}
            </div>

          </div>


          {/* =========================
              Contact Info
          ========================= */}
          <div className="space-y-8">

            {/* Address */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gold" />
              </div>

              <div>
                <h6 className="font-semibold text-foreground mb-1">
                  Alamat
                </h6>

                <p className="text-muted-foreground text-sm whitespace-pre-line">
                  {settings.address}
                </p>
              </div>
            </div>


            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-gold" />
              </div>

              <div>
                <h6 className="font-semibold text-foreground mb-1">
                  Telepon
                </h6>

                <p className="text-muted-foreground text-sm">
                  {settings.phone}
                </p>

                {settings.whatsapp && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 text-sm inline-flex items-center gap-1 mt-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {settings.whatsapp} (WhatsApp)
                  </a>
                )}
              </div>
            </div>


            {/* Email */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-gold" />
              </div>

              <div>
                <h6 className="font-semibold text-foreground mb-1">
                  Email
                </h6>

                <a
                  href={`mailto:${settings.email}`}
                  className="text-muted-foreground hover:text-gold text-sm"
                >
                  {settings.email}
                </a>
              </div>
            </div>


            {/* Check-in */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-gold" />
              </div>

              <div>
                <h6 className="font-semibold text-foreground mb-1">
                  Check-in / Check-out
                </h6>

                <p className="text-muted-foreground text-sm">
                  Check-in: {settings.check_in_time}
                  <br />
                  Check-out: {settings.check_out_time}
                </p>
              </div>
            </div>


            {/* Button */}
            <div className="pt-4">
              <a
                href={mapsDirectionLink}
                target="_blank"
                rel="noopener noreferrer"
              >
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
