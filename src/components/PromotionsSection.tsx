import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useSectionContent } from "@/hooks/useSectionContent";

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  sort_order: number | null;
}

const PromotionsSection = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const { sections } = useSectionContent();

  useEffect(() => {
    const fetchPromotions = async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching promotions:", error);
      } else {
        setPromotions(data || []);
      }

      setLoading(false);
    };

    fetchPromotions();

    const channel = supabase
      .channel("promotions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "promotions" },
        fetchPromotions
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <section id="promo" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!promotions.length) return null;

  return (
    <section
      id="promo"
      className="py-20 bg-background overflow-hidden"
      aria-labelledby="promotions-heading"
    >
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <header className="text-center max-w-2xl mx-auto mb-16">

          {/* Label */}
          <span className="block text-gold text-sm tracking-widest uppercase">
            {sections.promotions.title}
          </span>

          {/* Subtitle (semantic fixed → H4) */}
          <h4
            id="promotions-heading"
            className="
              mt-4
              mb-6
              font-sans
              font-medium
              text-2xl
              md:text-3xl
              lg:text-4xl
              text-foreground
              leading-tight
            "
          >
            {sections.promotions.subtitle}
          </h4>

          {/* Description */}
          <p className="text-muted-foreground text-base leading-relaxed">
            Nikmati berbagai penawaran menarik dan paket spesial yang kami
            siapkan khusus untuk Anda.
          </p>

        </header>

        {/* Promotions Grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {promotions.map((promo, index) => (
            <motion.article
              key={promo.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
              }}
              viewport={{ once: true }}
              className="
                group
                relative
                h-[400px]
                rounded-2xl
                overflow-hidden
                shadow-soft
              "
            >
              {/* Image */}
              <img
                src={promo.image_url || ""}
                alt={promo.title}
                className="
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-110
                "
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">

                <h3 className="text-2xl font-sans font-medium text-cream mb-3">
                  {promo.title}
                </h3>

                {promo.description && (
                  <p className="text-cream/80 text-sm mb-6 max-w-md">
                    {promo.description}
                  </p>
                )}

                <a href={promo.button_url || "#"}>
                  <Button
                    variant="gold"
                    className="rounded-full px-8"
                  >
                    {promo.button_text || "Lihat Detail"}
                  </Button>
                </a>

              </div>

            </motion.article>
          ))}

        </div>

      </div>
    </section>
  );
};

export default PromotionsSection;
