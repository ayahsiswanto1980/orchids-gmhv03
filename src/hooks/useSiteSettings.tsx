import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
}

export interface SiteSettings {
  hotel_name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  google_maps_url: string;
  hero_stats: Array<{ value: string; label: string }>;
  star_rating: string;
  check_in_time: string;
  check_out_time: string;
  hero_image_url: string;
  logo_url: string;
  social_media: SocialMedia;
}

const defaultSettings: SiteSettings = {
  hotel_name: 'Hotel Grand Master Purwodadi',
  tagline: 'Pengalaman Menginap Tak Terlupakan',
  description: 'Nikmati kemewahan dan kenyamanan di jantung kota Purwodadi. Hotel Grand Master menawarkan layanan premium dengan sentuhan keramahan Jawa yang hangat.',
  phone: '(0292) 4273335',
  whatsapp: '+628112769959',
  email: 'info@grandmasterpurwodadi.com',
  address: 'Jl. Gajah Mada No.10, Majenang, Kuripan, Kec. Purwodadi, Kabupaten Grobogan, Jawa Tengah, 58112',
  google_maps_url: '',
  hero_stats: [
    { value: '50+', label: 'Kamar Nyaman' },
    { value: '4.5', label: 'Rating Tamu' },
    { value: '10+', label: 'Tahun Melayani' }
  ],
  star_rating: 'Hotel Bintang 3',
  check_in_time: '14:00 WIB',
  check_out_time: '12:00 WIB',
  hero_image_url: '',
  logo_url: '',
  social_media: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: ''
  }
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const settingsMap: Record<string, any> = {};
          data.forEach((item) => {
            // Handle JSONB values - they come already parsed from Supabase
            const value = item.value;
            // If it's a string that looks like JSON, parse it
            if (typeof value === 'string') {
              try {
                settingsMap[item.key] = JSON.parse(value);
              } catch {
                settingsMap[item.key] = value;
              }
            } else {
              // Already parsed by Supabase (JSONB)
              settingsMap[item.key] = value;
            }
          });
          
          setSettings({
            hotel_name: String(settingsMap.hotel_name ?? defaultSettings.hotel_name),
            tagline: String(settingsMap.tagline ?? defaultSettings.tagline),
            description: String(settingsMap.description ?? defaultSettings.description),
            phone: String(settingsMap.phone ?? defaultSettings.phone),
            whatsapp: String(settingsMap.whatsapp ?? defaultSettings.whatsapp),
            email: String(settingsMap.email ?? defaultSettings.email),
            address: String(settingsMap.address ?? defaultSettings.address),
            google_maps_url: String(settingsMap.google_maps_url ?? defaultSettings.google_maps_url),
            hero_stats: Array.isArray(settingsMap.hero_stats) ? settingsMap.hero_stats : defaultSettings.hero_stats,
            star_rating: String(settingsMap.star_rating ?? defaultSettings.star_rating),
            check_in_time: String(settingsMap.check_in_time ?? defaultSettings.check_in_time),
            check_out_time: String(settingsMap.check_out_time ?? defaultSettings.check_out_time),
            hero_image_url: String(settingsMap.hero_image_url ?? defaultSettings.hero_image_url),
            logo_url: String(settingsMap.logo_url ?? defaultSettings.logo_url),
            social_media: settingsMap.social_media && typeof settingsMap.social_media === 'object' 
              ? { ...defaultSettings.social_media, ...settingsMap.social_media }
              : defaultSettings.social_media
          });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings'
        },
        () => {
          // Refetch settings when there's a change
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
};

export { defaultSettings };
