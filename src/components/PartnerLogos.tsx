import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useSectionContent } from '@/hooks/useSectionContent';

interface FooterLogo {
  id: string;
  name: string;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export const PartnerLogos = () => {
  const [logos, setLogos] = useState<FooterLogo[]>([]);
  const [loading, setLoading] = useState(true);

  const { sections, loading: sectionsLoading } = useSectionContent();

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const { data, error } = await supabase
          .from('footer_logos')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');
        
        if (error) throw error;
        setLogos(data || []);
      } catch (error) {
        console.error('Error fetching logos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (loading || sectionsLoading || logos.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-zinc-960">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {sections.partners.title}
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {sections.partners.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="w-full flex justify-center"
            >
              {logo.link_url ? (
                <a
                  href={logo.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full max-w-[160px]"
                >
                  <div className="aspect-square flex items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm group-hover:shadow-md group-hover:border-primary/30 group-hover:scale-105 transition-all duration-300">
                    <img
                      src={logo.image_url || ''}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>
                </a>
              ) : (
                <div className="w-full max-w-[160px]">
                  <div className="aspect-square flex items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 hover:scale-105 transition-all duration-300">
                    <img
                      src={logo.image_url || ''}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;
