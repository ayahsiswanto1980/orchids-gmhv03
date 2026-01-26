import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SectionContent {
  section_key: string;
  title: string;
  subtitle: string;
}

const defaultSections: Record<string, SectionContent> = {
  promotions: { section_key: 'promotions', title: 'Penawaran Spesial', subtitle: 'Temukan promo eksklusif untuk pengalaman menginap yang tak terlupakan' },
  rooms: { section_key: 'rooms', title: 'Pilihan Kamar Kami', subtitle: 'Kenyamanan terbaik dengan berbagai pilihan tipe kamar sesuai kebutuhan Anda' },
  facilities: { section_key: 'facilities', title: 'Fasilitas Hotel', subtitle: 'Nikmati berbagai fasilitas lengkap untuk menunjang kenyamanan istirahat Anda' },
  gallery: { section_key: 'gallery', title: 'Visual Experience', subtitle: 'Jelajahi keindahan dan kemewahan setiap sudut hotel kami melalui lensa' },
  services: { section_key: 'services', title: 'Layanan Unggulan', subtitle: 'Komitmen kami dalam memberikan pelayanan terbaik bagi setiap tamu' },
  testimonials: { section_key: 'testimonials', title: 'Apa Kata Mereka', subtitle: 'Pengalaman berkesan dari para tamu yang telah menginap bersama kami' },
  location: { section_key: 'location', title: 'Lokasi Strategis', subtitle: 'Temukan kemudahan akses menuju hotel kami di jantung kota' },
  partners: { section_key: 'partners', title: 'Partner Kami', subtitle: 'Bekerja sama dengan berbagai instansi terpercaya untuk layanan maksimal' }
};

export const useSectionContent = () => {
  const [sections, setSections] = useState<Record<string, SectionContent>>(defaultSections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const { data, error } = await supabase
          .from('section_content')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const sectionMap: Record<string, SectionContent> = { ...defaultSections };
          data.forEach((item) => {
            sectionMap[item.section_key] = {
              section_key: item.section_key,
              title: item.title,
              subtitle: item.subtitle || ''
            };
          });
          setSections(sectionMap);
        }
      } catch (error) {
        console.error('Error fetching section content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();

    const channel = supabase
      .channel('section_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'section_content'
        },
        () => {
          fetchSections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { sections, loading };
};
