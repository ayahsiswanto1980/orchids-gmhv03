import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import { 
  Loader2, Save, Globe, Phone, MapPin, Star, Clock, Plus, Trash2, 
  Share2, Image, Facebook, Instagram, Twitter, Youtube 
} from 'lucide-react';

interface HeroStat {
  value: string;
  label: string;
}

interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
}

interface SiteSettings {
  hotel_name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  google_maps_url: string;
  star_rating: string;
  check_in_time: string;
  check_out_time: string;
  hero_image_url: string;
  hero_video_url: string;
  hero_right_image_top: string;
  hero_right_image_bottom: string;
  hero_stats: HeroStat[];
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
  address: 'Jl. R. Suprapto No. 88, Purwodadi, Grobogan, Jawa Tengah',
  google_maps_url: '',
  star_rating: 'Hotel Bintang 3',
  check_in_time: '14:00 WIB',
  check_out_time: '12:00 WIB',
  hero_image_url: '',
  hero_video_url: 'https://www.youtube.com/watch?v=olZku1LeaCw',
  hero_right_image_top: '',
  hero_right_image_bottom: '',
  hero_stats: [
    { value: '50+', label: 'Kamar Nyaman' },
    { value: '4.5', label: 'Rating Tamu' },
    { value: '10+', label: 'Tahun Melayani' }
  ],
  logo_url: '',
  social_media: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: ''
  }
};

// Helper function to extract URL from HTML iframe or return URL directly
const extractMapUrl = (input: string): string => {
  if (!input) return '';
  const iframeMatch = input.match(/src=["']([^"']+)["']/);
  if (iframeMatch) {
    return iframeMatch[1];
  }
  return input;
};

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
            try {
              settingsMap[item.key] = typeof item.value === 'string' 
                ? JSON.parse(item.value) 
                : item.value;
            } catch {
              settingsMap[item.key] = item.value;
            }
          });
          
          setSettings({
            hotel_name: settingsMap.hotel_name || defaultSettings.hotel_name,
            tagline: settingsMap.tagline || defaultSettings.tagline,
            description: settingsMap.description || defaultSettings.description,
            phone: settingsMap.phone || defaultSettings.phone,
            whatsapp: settingsMap.whatsapp || defaultSettings.whatsapp,
            email: settingsMap.email || defaultSettings.email,
            address: settingsMap.address || defaultSettings.address,
            google_maps_url: settingsMap.google_maps_url || defaultSettings.google_maps_url,
            star_rating: settingsMap.star_rating || defaultSettings.star_rating,
            check_in_time: settingsMap.check_in_time || defaultSettings.check_in_time,
            check_out_time: settingsMap.check_out_time || defaultSettings.check_out_time,
            hero_stats: settingsMap.hero_stats || defaultSettings.hero_stats,
            hero_image_url: settingsMap.hero_image_url || defaultSettings.hero_image_url,
            hero_video_url: settingsMap.hero_video_url || defaultSettings.hero_video_url,
            hero_right_image_top: settingsMap.hero_right_image_top || defaultSettings.hero_right_image_top,
            hero_right_image_bottom: settingsMap.hero_right_image_bottom || defaultSettings.hero_right_image_bottom,
            logo_url: settingsMap.logo_url || defaultSettings.logo_url,
            social_media: settingsMap.social_media || defaultSettings.social_media
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const processedSettings = {
        ...settings,
        google_maps_url: extractMapUrl(settings.google_maps_url)
      };

      const settingsToUpsert = Object.entries(processedSettings).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : JSON.stringify(value)
      }));

      for (const setting of settingsToUpsert) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(
            { key: setting.key, value: setting.value },
            { onConflict: 'key' }
          );
        if (error) throw error;
      }

      toast({ title: 'Pengaturan berhasil disimpan' });
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatChange = (index: number, field: 'value' | 'label', newValue: string) => {
    const newStats = [...settings.hero_stats];
    newStats[index] = { ...newStats[index], [field]: newValue };
    setSettings({ ...settings, hero_stats: newStats });
  };

  const addStat = () => {
    if (settings.hero_stats.length < 4) {
      setSettings({
        ...settings,
        hero_stats: [...settings.hero_stats, { value: '', label: '' }]
      });
    }
  };

  const removeStat = (index: number) => {
    if (settings.hero_stats.length > 1) {
      const newStats = settings.hero_stats.filter((_, i) => i !== index);
      setSettings({ ...settings, hero_stats: newStats });
    }
  };

  const handleSocialMediaChange = (platform: keyof SocialMedia, value: string) => {
    setSettings({
      ...settings,
      social_media: {
        ...settings.social_media,
        [platform]: value
      }
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Pengaturan" description="Konfigurasi website hotel">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pengaturan" description="Konfigurasi website hotel">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="general" className="flex items-center gap-2 py-3">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Umum</span>
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2 py-3">
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Hero</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2 py-3">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Kontak</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2 py-3">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Lokasi</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2 py-3">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Sosial Media</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gold" />
                <CardTitle className="font-display">Informasi Umum</CardTitle>
              </div>
              <CardDescription>Pengaturan dasar website hotel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Logo Hotel</Label>
                <ImageUpload
                  currentImageUrl={settings.logo_url}
                  onImageUploaded={(url) => setSettings({ ...settings, logo_url: url })}
                  folder="logo"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel_name">Nama Hotel</Label>
                  <Input
                    id="hotel_name"
                    value={settings.hotel_name}
                    onChange={(e) => setSettings({ ...settings, hotel_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="star_rating">Rating Bintang</Label>
                  <Input
                    id="star_rating"
                    value={settings.star_rating}
                    onChange={(e) => setSettings({ ...settings, star_rating: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-gold" />
                <CardTitle className="font-display">Hero Section - Layout Video</CardTitle>
              </div>
              <CardDescription>Video latar belakang dan gambar pendamping untuk layout split 65/35</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hero_video_url">URL Video YouTube</Label>
                <Input
                  id="hero_video_url"
                  value={settings.hero_video_url}
                  onChange={(e) => setSettings({ ...settings, hero_video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Gambar Kanan Atas</Label>
                  <ImageUpload
                    currentImageUrl={settings.hero_right_image_top}
                    onImageUploaded={(url) => setSettings({ ...settings, hero_right_image_top: url })}
                    folder="hero"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gambar Kanan Bawah</Label>
                  <ImageUpload
                    currentImageUrl={settings.hero_right_image_bottom}
                    onImageUploaded={(url) => setSettings({ ...settings, hero_right_image_bottom: url })}
                    folder="hero"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gambar Fallback (Background)</Label>
                <ImageUpload
                  currentImageUrl={settings.hero_image_url}
                  onImageUploaded={(url) => setSettings({ ...settings, hero_image_url: url })}
                  folder="hero"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gold" />
                <CardTitle className="font-display">Statistik Hero</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.hero_stats.map((stat, index) => (
                <div key={index} className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Nilai</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => removeStat(index)} disabled={settings.hero_stats.length <= 1}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {settings.hero_stats.length < 4 && (
                <Button variant="outline" onClick={addStat} className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Tambah Statistik
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gold" />
                <CardTitle className="font-display">Informasi Kontak</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                  <Input id="whatsapp" value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <CardTitle className="font-display">Lokasi & Jam Operasional</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea id="address" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_maps_url">Embed Google Maps</Label>
                <Textarea id="google_maps_url" value={settings.google_maps_url} onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check_in_time">Jam Check-in</Label>
                  <Input id="check_in_time" value={settings.check_in_time} onChange={(e) => setSettings({ ...settings, check_in_time: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_out_time">Jam Check-out</Label>
                  <Input id="check_out_time" value={settings.check_out_time} onChange={(e) => setSettings({ ...settings, check_out_time: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-gold" />
                <CardTitle className="font-display">Social Media</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['facebook', 'instagram', 'twitter', 'youtube', 'tiktok'] as const).map((platform) => (
                  <div key={platform} className="space-y-2">
                    <Label htmlFor={platform} className="capitalize">{platform}</Label>
                    <Input id={platform} value={settings.social_media[platform]} onChange={(e) => handleSocialMediaChange(platform, e.target.value)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <div className="flex justify-end sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
          <Button onClick={handleSave} className="bg-gold hover:bg-gold-dark text-accent-foreground" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan Pengaturan
          </Button>
        </div>
      </Tabs>
    </AdminLayout>
  );
};

export default Settings;
