import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroImageDefault from "@/assets/hero-hotel.jpg";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings } = useSiteSettings();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const rightImageTop = settings.hero_right_image_top || heroImageDefault;
  const rightImageBottom = settings.hero_right_image_bottom || heroImageDefault;
  const videoUrl = settings.hero_video_url || 'https://www.youtube.com/watch?v=olZku1LeaCw';

  const getYoutubeEmbedUrl = (url: string) => {
    // If it's already an embed URL, just ensure parameters are added
    if (url.includes('youtube.com/embed/')) {
      const baseUrl = url.split('?')[0];
      const id = baseUrl.split('/').pop();
      return `${baseUrl}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`;
    }
    
    // Extract ID from various YouTube URL formats
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[7].length === 11) ? match[7] : null;
    
    if (id) {
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`;
    }
    return url;
  };

  const stats = Array.isArray(settings.hero_stats) ? settings.hero_stats : [];

  return (
    <section
      id="beranda"
      className="relative min-h-screen w-full overflow-hidden bg-primary pt-[90px] lg:pt-[106px]"
    >
      {/* Split Layout Container */}
      <div className="absolute inset-0 top-[90px] lg:top-[106px] flex flex-col lg:flex-row w-full h-[calc(100%-90px)] lg:h-[calc(100%-106px)]">
        {/* Left Side: Video Section */}
        <div className="relative w-full lg:w-[65%] h-[50%] sm:h-[55%] lg:h-full overflow-hidden bg-black shadow-2xl">
          <div className="absolute inset-0 w-full h-full">
            <iframe
              className="w-full h-full scale-[1.35] pointer-events-none"
              src={getYoutubeEmbedUrl(videoUrl)}
              title="Hero Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {/* Overlay to ensure text readability if any, and to prevent interaction */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        </div>

        {/* Right Side: Stacked Images */}
        <div className="flex flex-row lg:flex-col w-full lg:w-[35%] h-[50%] sm:h-[45%] lg:h-full border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="relative w-1/2 lg:w-full h-full lg:h-1/2 overflow-hidden group cursor-pointer">
            <img
              src={rightImageTop}
              alt="Hotel View 1"
              className={`w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 ${isLoaded ? "scale-105" : "scale-100"}`}
            />
            <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/10 transition-all duration-700 flex flex-col justify-end p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-gold text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-1 block">Premium Experience</span>
                <h3 className="text-cream text-sm sm:text-base md:text-lg lg:text-xl font-sans tracking-tight">Luxury Suite View</h3>
              </div>
            </div>
            <div className="absolute inset-2 sm:inset-3 md:inset-4 border border-gold/0 group-hover:border-gold/30 transition-all duration-700 pointer-events-none" />
          </div>

          <div className="relative w-1/2 lg:w-full h-full lg:h-1/2 overflow-hidden border-l lg:border-l-0 lg:border-t border-white/10 group cursor-pointer">
            <img
              src={rightImageBottom}
              alt="Hotel View 2"
              className={`w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 ${isLoaded ? "scale-105" : "scale-100"}`}
              style={{ transitionDelay: "100ms" }}
            />
            <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/10 transition-all duration-700 flex flex-col justify-end p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-gold text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-1 block">Exquisite Dining</span>
                <h3 className="text-cream text-sm sm:text-base md:text-lg lg:text-xl font-sans tracking-tight">Fine Dining Area</h3>
              </div>
            </div>
            <div className="absolute inset-2 sm:inset-3 md:inset-4 border border-gold/0 group-hover:border-gold/30 transition-all duration-700 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Badge & Stats - Compact */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-4 sm:pb-6">
        <div className="container mx-auto px-3 sm:px-4 flex justify-center">
          <div 
            className={`inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 bg-primary/90 backdrop-blur-md rounded-full px-3 sm:px-5 py-2 sm:py-2.5 border border-gold/30 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            {/* Hotel Rating Badge - 3 Stars */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3].map((star, index) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 sm:w-4 sm:h-4 fill-gold text-gold transition-all duration-500 ${
                      isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    }`}
                    style={{ transitionDelay: `${900 + index * 100}ms` }}
                  />
                ))}
              </div>
              <span className="text-gold text-[10px] sm:text-xs font-medium tracking-wide">
                Bintang 3
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-4 sm:h-5 bg-gold/30" />

            {/* Stats Section - Compact */}
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className={`flex items-center gap-1 sm:gap-1.5 ${index !== 0 ? 'border-l border-gold/20 pl-2 sm:pl-4 md:pl-6' : ''}`}
              >
                <span className="text-base sm:text-lg md:text-xl text-gold font-semibold">
                  {stat.value}
                </span>
                <span className="text-cream/60 text-[8px] sm:text-[10px] tracking-wide uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      </section>
  );
};

export default HeroSection;
