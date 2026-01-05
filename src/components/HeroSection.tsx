import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroImageDefault from "@/assets/hero-hotel.jpg";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const whatsappNumber = String(settings.whatsapp || '').replace(/[^0-9+]/g, '');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Halo,%20saya%20ingin%20melakukan%20reservasi%20kamar%20di%20${encodeURIComponent(String(settings.hotel_name || ''))}`;

  // Use uploaded hero image or default
  const heroImage = settings.hero_image_url && settings.hero_image_url.trim() !== '' 
    ? settings.hero_image_url 
    : heroImageDefault;

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0">
        <div 
          className={`absolute inset-0 transition-transform duration-[20s] ease-out ${
            isLoaded ? "scale-110" : "scale-100"
          }`}
        >
          <img
            src={heroImage}
            alt={settings.hotel_name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-primary/50" />
      </div>

      {/* Animated Particles/Glow Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto">
          {/* Title with Staggered Animation */}
          <h1 className="font-montserrat text-4xl md:text-6xl lg:text-7xl text-cream mb-6">
            <span 
              className={`block transition-all duration-1000 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {settings.tagline.split(' ').slice(0, 2).join(' ')}
            </span>
            <span 
              className={`block text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold mt-2 transition-all duration-1000 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {settings.tagline.split(' ').slice(2).join(' ')}
            </span>
          </h1>

          {/* Description with Fade In */}
          <p 
            className={`text-cream/90 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            {settings.description}
          </p>

          {/* Rating Badge - Now below subtitle */}
          <div 
            className={`inline-flex items-center gap-2 bg-gold/20 backdrop-blur-md border border-gold/30 rounded-full px-5 py-2.5 mb-10 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <div className="flex gap-0.5">
              {[1, 2, 3].map((star, index) => (
                <Star
                  key={star}
                  className={`w-4 h-4 fill-gold text-gold transition-all duration-500 ${
                    isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                  style={{ transitionDelay: `${900 + index * 100}ms` }}
                />
              ))}
            </div>
            <span className="text-gold text-sm font-medium tracking-wide">
              {settings.star_rating}
            </span>
          </div>

          {/* CTA Buttons with Hover Effects */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="hero" 
                size="xl" 
                className="group relative overflow-hidden shadow-lg hover:shadow-gold/30 hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Pesan Sekarang
                </span>
                <div className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </a>
            <Button 
              variant="heroOutline" 
              size="xl"
              className="group"
              onClick={() => document.getElementById('kamar')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="group-hover:tracking-wider transition-all duration-300">Lihat Kamar</span>
            </Button>
          </div>

          {/* Stats with Counter Animation Feel */}
          <div 
            className={`grid grid-cols-3 gap-6 md:gap-12 max-w-xl mx-auto mt-16 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1200ms" }}
          >
            {settings.hero_stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className={`text-center group cursor-default transition-all duration-500 ${
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
                style={{ transitionDelay: `${1400 + index * 150}ms` }}
              >
                <div className="font-display text-3xl md:text-5xl text-gold font-bold group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-cream/70 text-sm mt-1 group-hover:text-cream transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator with Smooth Animation */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "1800ms" }}
      >
        <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => document.getElementById('kamar')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="text-cream/60 text-xs tracking-widest uppercase group-hover:text-gold transition-colors">Scroll</span>
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2 group-hover:border-gold transition-colors">
            <div className="w-1.5 h-3 bg-gold rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
