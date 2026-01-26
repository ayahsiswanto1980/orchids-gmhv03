import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Crown, Star } from "lucide-react";

const TaglineSection = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="relative bg-gradient-to-b from-background via-cream/30 to-background py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gold/20 via-gold/30 to-gold/20 backdrop-blur-sm border border-gold/40 rounded-full px-6 py-3 mb-10 shadow-lg shadow-gold/10">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-gold font-semibold text-sm tracking-widest uppercase">
              Premium Experience
            </span>
            <Crown className="w-4 h-4 text-gold" />
          </div>

          {/* Tagline */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight mb-8">
            <span className="block text-primary font-medium leading-tight">
              {settings.tagline.split(' ').slice(0, Math.ceil(settings.tagline.split(' ').length / 2)).join(' ')}
            </span>
            <span className="block mt-2 font-semibold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent leading-tight">
              {settings.tagline.split(' ').slice(Math.ceil(settings.tagline.split(' ').length / 2)).join(' ')}
            </span>
          </h2>

          {/* Description - same size as PromotionsSection */}
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {settings.description}
          </p>

          {/* Decorative bottom element */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <div className="w-2 h-2 rounded-full bg-gold/40" />
            <div className="w-3 h-3 rounded-full bg-gold/60" />
            <div className="w-2 h-2 rounded-full bg-gold/40" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default TaglineSection;
