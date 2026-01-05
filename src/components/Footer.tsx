import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, title')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(6);

      if (!error && data) {
        setServices(data);
      }
    };

    fetchServices();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('footer-services-changes')
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

  const whatsappNumber = String(settings.whatsapp || '').replace(/[^0-9+]/g, '');
  const hotelName = String(settings.hotel_name || '');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Halo,%20saya%20ingin%20melakukan%20reservasi%20kamar%20di%20${encodeURIComponent(hotelName)}`;

  // Social media links from settings
  const socialLinks = [
    { icon: Facebook, url: settings.social_media?.facebook, label: 'Facebook' },
    { icon: Instagram, url: settings.social_media?.instagram, label: 'Instagram' },
    { icon: Twitter, url: settings.social_media?.twitter, label: 'Twitter' },
    { icon: Youtube, url: settings.social_media?.youtube, label: 'YouTube' },
    { icon: TikTokIcon, url: settings.social_media?.tiktok, label: 'TikTok' },
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Section - Enhanced */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold-light rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        
        {/* Decorative Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col items-center justify-center gap-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full px-5 py-2">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-gold text-sm font-normal tracking-wide">Penawaran Spesial</span>
            </div>
            
            {/* Title */}
            <div className="max-w-2xl">
              <h3 className="font-marker text-3xl md:text-4xl lg:text-5xl text-cream mb-4 leading-tight">
                Siap untuk Pengalaman{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold">
                  Tak Terlupakan?
                </span>
              </h3>
              <p className="text-cream/70 text-lg">
                Pesan kamar Anda sekarang dan nikmati penawaran spesial untuk menginap yang berkesan.
              </p>
            </div>
            
            {/* CTA Button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="gold" 
                size="xl" 
                className="group relative overflow-hidden shadow-lg hover:shadow-gold/40 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Reservasi via WhatsApp
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </a>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-cream/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Respon Cepat</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Konfirmasi Instan</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Harga Terbaik</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="mb-6">
                <span className="font-marker text-2xl text-gold">
                  {settings.hotel_name.split(' ').slice(0, 2).join(' ')}
                </span>
                <div className="text-xs tracking-[0.2em] uppercase text-primary-foreground/60">
                  {settings.hotel_name.split(' ').slice(2).join(' ')}
                </div>
              </div>
              <p className="text-primary-foreground/70 text-sm mb-6">
                {settings.star_rating} premium di jantung kota Purwodadi. Menawarkan
                pengalaman menginap mewah dengan sentuhan keramahan Jawa.
              </p>
            </div>

          {/* Social Media Column (Replacing Layanan/Navigasi) */}
          <div>
            <h4 className="font-marker text-lg mb-6 text-gold">
              Social Media
            </h4>
            <ul className="space-y-4">
              {socialLinks.length > 0 ? (
                socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-primary-foreground/70 hover:text-gold transition-colors text-sm group"
                    >
                      <div className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-gold/20 group-hover:ring-4 group-hover:ring-gold/10">
                        <social.icon className="w-5 h-5 transition-all duration-500 group-hover:text-primary group-hover:rotate-[360deg]" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{social.label}</span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-primary-foreground/50 text-sm">
                  Ikuti kami di media sosial
                </li>
              )}
            </ul>
          </div>

          {/* Layanan Column (Integrated with Database) */}
          <div>
            <h4 className="font-marker text-lg mb-6 text-gold">
              Layanan
            </h4>
            <ul className="space-y-3">
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service.id}>
                    <a
                      href="#layanan"
                      className="text-primary-foreground/70 hover:text-gold transition-colors text-sm"
                    >
                      {service.title}
                    </a>
                  </li>
                ))
              ) : (
                ["Kamar", "Fasilitas", "Restoran", "Meeting Room"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-primary-foreground/70 hover:text-gold transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-marker text-lg mb-6 text-gold">
              Newsletter
            </h4>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Dapatkan penawaran eksklusif dan info terbaru.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-4 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-gold"
              />
              <Button variant="gold" size="icon" className="shrink-0">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <div>
              © {currentYear} {settings.hotel_name}. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gold transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
