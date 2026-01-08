import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FooterLogo {
  id: string;
  name: string;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
}

const PartnerLogos = () => {
  const [logos, setLogos] = useState<FooterLogo[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Error fetching partner logos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (loading || logos.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-accent/20">
      <div className="container px-4">
        <div className="text-center mb-8">
          <h3 className="text-sm font-display uppercase tracking-[0.2em] text-accent/60 mb-2">Our Partners & Payment Methods</h3>
          <div className="w-12 h-[1px] bg-gold mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="w-full flex justify-center transform hover:scale-105 transition-transform duration-300"
            >
              {logo.link_url ? (
                <a 
                  href={logo.link_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-4 h-24 w-full"
                >
                  <img 
                    src={logo.image_url || ''} 
                    alt={logo.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </a>
              ) : (
                <div className="flex items-center justify-center p-4 h-24 w-full">
                  <img 
                    src={logo.image_url || ''} 
                    alt={logo.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;
