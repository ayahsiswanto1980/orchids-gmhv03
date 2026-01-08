import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroImageDefault from "@/assets/hero-hotel.jpg";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const whatsappNumber = String(settings.whatsapp || '').replace(/[^0-9+]/g, '');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Halo,%20saya%20ingin%20melakukan%20reservasi%20kamar%20di%20${encodeURIComponent(String(settings.hotel_name || ''))}`;

  // Use uploaded hero image or default
  const heroImage = settings.hero_image_url && settings.hero_image_url.trim() !== '' 
    ? settings.hero_image_url 
    : heroImageDefault;

  const rightImageTop = settings.hero_right_image_top || heroImageDefault;
  const rightImageBottom = settings.hero_right_image_bottom || heroImageDefault;
  const videoUrl = settings.hero_video_url || 'https://www.youtube.com/watch?v=olZku1LeaCw';

  const getYoutubeEmbedUrl = (url: string) => {
    if (url.includes('embed')) return `${url}?autoplay=1&mute=1&loop=1&playlist=${url.split('/').pop()?.split('?')[0]}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1` : url;
  };

  return (
    <section
      id="beranda"
      className="relative h-screen min-h-[600px] w-full overflow-hidden bg-primary"
    >
      {/* Split Layout Container */}
      <div className="absolute inset-0 flex flex-col lg:flex-row w-full h-full">
          {/* Left Side: Video Section (65%) */}
          <div className="relative w-full lg:w-[65%] h-[60%] lg:h-full overflow-hidden bg-black">
            <div className="absolute inset-0 z-10 bg-black/30 lg:bg-transparent" />
            <iframe
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] lg:w-[180%] lg:h-[180%] pointer-events-none object-cover z-0"
              src={getYoutubeEmbedUrl(videoUrl)}
              title="Hero Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Fallback image */}
            <img
              src={heroImage}
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay z-0"
            />
            {/* Gradient Overlays for Left Side */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/30 to-transparent z-[5]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/80 z-[5]" />
          </div>

        {/* Right Side: Stacked Images (35%) */}
        <div className="flex flex-row lg:flex-col w-full lg:w-[35%] h-[40%] lg:h-full">
          <div className="relative w-1/2 lg:w-full h-full lg:h-1/2 overflow-hidden border-l border-primary/20 group cursor-pointer">
            <img
              src={rightImageTop}
              alt="Hotel View 1"
              className={`w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 ${isLoaded ? "scale-110" : "scale-100"}`}
            />
            {/* Hover Content */}
            <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/10 transition-all duration-700 flex flex-col justify-end p-6 lg:p-10">
              <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2 block">Premium Experience</span>
                <h3 className="text-cream text-xl font-sans tracking-tight">Luxury Suite View</h3>
              </div>
            </div>
            {/* Decorative Borders */}
            <div className="absolute inset-4 border border-gold/0 group-hover:border-gold/30 transition-all duration-700 pointer-events-none" />
          </div>

          <div className="relative w-1/2 lg:w-full h-full lg:h-1/2 overflow-hidden border-l border-t lg:border-t border-primary/20 group cursor-pointer">
            <img
              src={rightImageBottom}
              alt="Hotel View 2"
              className={`w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 ${isLoaded ? "scale-110" : "scale-100"}`}
              style={{ transitionDelay: "100ms" }}
            />
            {/* Hover Content */}
            <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/10 transition-all duration-700 flex flex-col justify-end p-6 lg:p-10">
              <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-gold text-[10px] tracking-[0.3em] uppercase mb-2 block">Exquisite Dining</span>
                <h3 className="text-cream text-xl font-sans tracking-tight">Fine Dining Area</h3>
              </div>
            </div>
            {/* Decorative Borders */}
            <div className="absolute inset-4 border border-gold/0 group-hover:border-gold/30 transition-all duration-700 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 h-full container mx-auto px-4 flex items-center">
        <div className="max-w-3xl">
          {/* Rating Badge */}
          <div 
            className={`inline-flex items-center gap-2 bg-gold/20 backdrop-blur-md border border-gold/30 rounded-full px-5 py-2.5 mb-10 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex gap-0.5">
              {[1, 2, 3, 4].map((star, index) => (
                <Star
                  key={star}
                  className={`w-4 h-4 fill-gold text-gold transition-all duration-500 ${
                    isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                />
              ))}
            </div>
            <span className="text-gold text-sm font-normal tracking-wide">
              {settings.star_rating}
            </span>
          </div>

          <h1 className="font-sans text-4xl md:text-6xl lg:text-7xl text-cream mb-6 drop-shadow-2xl">
            <span 
              className={`block transition-all duration-1000 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {settings.tagline.split(' ').slice(0, 2).join(' ')}
            </span>
            <span 
              className={`block text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold mt-2 transition-all duration-1000 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              {settings.tagline.split(' ').slice(2).join(' ')}
            </span>
          </h1>

          <p 
            className={`text-cream/90 text-lg md:text-xl max-w-xl mb-10 leading-relaxed transition-all duration-1000 drop-shadow-lg ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            {settings.description}
          </p>

          <div 
            className={`flex flex-col sm:flex-row items-center gap-4 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="xl" variant="gold" className="group shadow-xl shadow-gold/20">
                Pesan Sekarang
              </Button>
            </a>
            <Button 
              size="xl" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
              onClick={() => document.getElementById('kamar')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Lihat Kamar
            </Button>
          </div>

          {/* Stats Section */}
          <div 
            className={`grid grid-cols-3 gap-8 md:gap-12 max-w-xl mt-16 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "1200ms" }}
          >
            {settings.hero_stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="group cursor-default"
                style={{ transitionDelay: `${1400 + index * 150}ms` }}
              >
                <div className="text-3xl md:text-4xl text-gold font-sans mb-1 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-cream/60 text-[10px] tracking-widest uppercase group-hover:text-cream transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "1600ms" }}
      >
        <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => document.getElementById('kamar')?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="w-px h-12 bg-gradient-to-b from-gold/0 via-gold to-gold/0 animate-shimmer" />
          <span className="text-gold/60 text-[10px] tracking-[0.2em] uppercase group-hover:text-gold transition-colors mt-2">Explore</span>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
