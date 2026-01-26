import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Images, X } from "lucide-react";
import { useSectionContent } from "@/hooks/useSectionContent";

interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  category: string | null;
  sort_order: number | null;
}

const GallerySection = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const { sections } = useSectionContent();

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching gallery:', error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchGallery();
  }, []);

  const categories = ["Semua", ...Array.from(new Set(items.map(item => item.category || "Umum")))];
  
  const filteredItems = activeCategory === "Semua" 
    ? items 
    : items.filter(item => (item.category || "Umum") === activeCategory);

  if (loading) {
    return (
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section id="galeri" className="py-20 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold text-sm font-normal tracking-widest uppercase">
            {sections.gallery.title}
          </span>
          <h2 className="section-title text-foreground mt-4 mb-6">
            {sections.gallery.subtitle}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-gold text-white shadow-md" 
                    : "bg-background text-muted-foreground hover:bg-gold/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-soft"
                onClick={() => setSelectedImage(item.image_url)}
              >
                <img
                  src={item.image_url}
                  alt={item.title || "Gallery Item"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Images className="text-white w-8 h-8" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white hover:text-gold transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
