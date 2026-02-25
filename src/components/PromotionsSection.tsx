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
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching promotions:', error);
      } else {
        setPromotions(data || []);
      }
      setLoading(false);
    };

    fetchPromotions();

    const channel = supabase
      .channel('promotions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'promotions' },
        () => fetchPromotions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-background">
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

  if (promotions.length === 0) return null;

  return (
    <section id="promo" className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-sm font-normal tracking-widest uppercase">
            {sections.promotions.title}
          </span>
          <h5 className="section-title text-foreground mt-4 mb-6">
            {sections.promotions.subtitle}
          </h5>
          <p className="text-muted-foreground">
            Nikmati berbagai penawaran menarik dan paket spesial yang kami siapkan khusus untuk Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-soft"
            >
              <img
                src={promo.image_url || ''}
                alt={promo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-sans text-cream mb-3">
                  {promo.title}
                </h3>
                <p className="text-cream/80 text-sm mb-6 max-w-md">
                  {promo.description}
                </p>
                <a href={promo.button_url || '#'}>
                  <Button variant="gold" className="rounded-full px-8">
                    {promo.button_text || 'Lihat Detail'}
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
