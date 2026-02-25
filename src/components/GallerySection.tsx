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
  const { sections } = useSectionContent();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching gallery:", error);
        setItems([]);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    };

    fetchGallery();
  }, []);

  /* ================================
     Category Logic
  ================================= */

  const categories = [
    "Semua",
    ...Array.from(
      new Set(items.map((item) => item.category || "Umum"))
    ),
  ];

  const filteredItems =
    activeCategory === "Semua"
      ? items
      : items.filter(
          (item) => (item.category || "Umum") === activeCategory
        );

  /* ================================
     Loading State
  ================================= */

  if (loading) {
    return (
      <section id="galeri" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">

          {/* Header skeleton */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-6" />
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-64 rounded-xl"
              />
            ))}
          </div>

        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  /* ================================
     Render
  ================================= */

  return (
    <section
      id="galeri"
      className="py-20 bg-secondary/30 overflow-hidden"
    >
      <div className="container mx-auto px-4">

        {/* ================================
            Header (SEO Correct Structure)
        ================================= */}

        <header className="text-center max-w-2xl mx-auto mb-12">

          {/* Subtitle kecil */}
          <span className="text-gold text-sm tracking-widest uppercase">
            {sections.gallery.title}
          </span>

          {/* Main section heading (PRIMARY) */}
          <h2 className="section-title text-foreground mt-4">
            Galeri Hotel
          </h2>

          {/* Secondary subtitle (SECONDARY) */}
          <h4 className="text-muted-foreground mt-3 font-normal">
            {sections.gallery.subtitle}
          </h4>

          {/* Category filter */}
          <nav className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
                    active
                      ? "bg-gold text-white shadow-md"
                      : "bg-background text-muted-foreground hover:bg-gold/10"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </nav>

        </header>

        {/* ================================
            Gallery Grid
        ================================= */}

        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">

            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35 }}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-soft"
                onClick={() => setSelectedImage(item.image_url)}
              >
                <img
                  src={item.image_url}
                  alt={item.title || "Gallery Image"}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Images className="text-white w-8 h-8" />
                </div>

              </motion.div>
            ))}

          </AnimatePresence>
        </motion.div>

      </div>

      {/* ================================
          Lightbox
      ================================= */}

      <AnimatePresence>

        {selectedImage && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >

            {/* Close button */}
            <button
              className="absolute top-8 right-8 text-white hover:text-gold transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image */}
            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              src={selectedImage}
              alt="Preview"
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
