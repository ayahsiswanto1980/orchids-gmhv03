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
  hero_stats: HeroStat[];
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
  address: 'Jl. R. Suprapto No. 88, Purwodadi, Grobogan, Jawa Tengah',
  google_maps_url: '',
  star_rating: 'Hotel Bintang 3',
  check_in_time: '14:00 WIB',
  check_out_time: '12:00 WIB',
  hero_stats: [
    { value: '50+', label: 'Kamar Nyaman' },
    { value: '4.5', label: 'Rating Tamu' },
    { value: '10+', label: 'Tahun Melayani' }
  ],
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

// Helper function to extract URL from HTML iframe or return URL directly
const extractMapUrl = (input: string): string => {
  if (!input) return '';
  
  // Check if input is HTML iframe
  const iframeMatch = input.match(/src=["']([^"']+)["']/);
  if (iframeMatch) {
    return iframeMatch[1];
  }
  
  // If not HTML, return input as URL
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
      // Process google_maps_url to extract URL from HTML if needed
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

        {/* General Tab */}
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
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Logo Hotel</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Rekomendasi: Gambar dengan latar transparan (PNG), ukuran maksimal 200x80px
                </p>
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
                    placeholder="Hotel Bintang 3"
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

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-gold" />
                <CardTitle className="font-display">Hero Section</CardTitle>
              </div>
              <CardDescription>Gambar latar dan statistik hero section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Gambar Latar Hero</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Rekomendasi: Gambar landscape dengan resolusi minimal 1920x1080px
                </p>
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
              <CardDescription>Angka statistik yang ditampilkan di hero section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.hero_stats.map((stat, index) => (
                <div key={index} className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Nilai</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                      placeholder="50+"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      placeholder="Kamar Nyaman"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeStat(index)}
                    disabled={settings.hero_stats.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {settings.hero_stats.length < 4 && (
                <Button variant="outline" onClick={addStat} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Statistik
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gold" />
                <CardTitle className="font-display">Informasi Kontak</CardTitle>
              </div>
              <CardDescription>Nomor telepon dan email hotel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    placeholder="+628123456789"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <CardTitle className="font-display">Lokasi & Jam Operasional</CardTitle>
              </div>
              <CardDescription>Alamat, peta lokasi, dan jam check-in/out</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="google_maps_url">Embed Google Maps</Label>
                <Textarea
                  id="google_maps_url"
                  value={settings.google_maps_url}
                  onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })}
                  placeholder='Paste kode iframe dari Google Maps atau URL embed langsung'
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Cara mendapatkan: Buka Google Maps → Cari lokasi hotel → Klik "Share" → "Embed a map" → Salin kode HTML atau URL-nya
                </p>
                
                {/* Map Preview */}
                {settings.google_maps_url && (
                  <div className="mt-4 space-y-2">
                    <Label>Preview Peta</Label>
                    <div className="relative h-48 rounded-lg overflow-hidden border border-border">
                      <iframe
                        src={extractMapUrl(settings.google_maps_url)}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check_in_time">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Jam Check-in
                  </Label>
                  <Input
                    id="check_in_time"
                    value={settings.check_in_time}
                    onChange={(e) => setSettings({ ...settings, check_in_time: e.target.value })}
                    placeholder="14:00 WIB"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="check_out_time">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Jam Check-out
                  </Label>
                  <Input
                    id="check_out_time"
                    value={settings.check_out_time}
                    onChange={(e) => setSettings({ ...settings, check_out_time: e.target.value })}
                    placeholder="12:00 WIB"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-gold" />
                <CardTitle className="font-display">Social Media</CardTitle>
              </div>
              <CardDescription>Link ke akun social media hotel yang ditampilkan di footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={settings.social_media.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/hotelgrandmaster"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={settings.social_media.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/hotelgrandmaster"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-sky-500" />
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter"
                    value={settings.social_media.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/hotelgrandmaster"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube" className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-600" />
                    YouTube
                  </Label>
                  <Input
                    id="youtube"
                    value={settings.social_media.youtube}
                    onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                    placeholder="https://youtube.com/@hotelgrandmaster"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tiktok" className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                    TikTok
                  </Label>
                  <Input
                    id="tiktok"
                    value={settings.social_media.tiktok}
                    onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                    placeholder="https://tiktok.com/@hotelgrandmaster"
                  />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Kosongkan jika tidak memiliki akun di platform tersebut. Link social media akan otomatis disembunyikan dari footer jika dikosongkan.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Save Button - Fixed at bottom */}
        <div className="flex justify-end sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
          <Button 
            onClick={handleSave}
            className="bg-gold hover:bg-gold-dark text-accent-foreground"
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Simpan Pengaturan
          </Button>
        </div>
      </Tabs>
    </AdminLayout>
  );
};

export default Settings;
