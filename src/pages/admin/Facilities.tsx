import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, X, Images } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

interface Facility {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  images: string[] | null;
  features: string[] | null;
  operating_hours: string | null;
  capacity: string | null;
  price: number | null;
  is_active: boolean;
  sort_order: number;
}

const Facilities = () => {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [newFeature, setNewFeature] = useState('');
  
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      image_url: '',
      images: [] as string[],
      features: [] as string[],
      operating_hours: '',
      capacity: '',
      price: '',
      is_active: true,
      sort_order: 0
    });

    const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      setFacilities(data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

    const resetForm = () => {
      setFormData({
        name: '',
        description: '',
        image_url: '',
        images: [],
        features: [],
        operating_hours: '',
        capacity: '',
        price: '',
        is_active: true,
        sort_order: 0
      });
      setEditingFacility(null);
      setNewFeature('');
    };

    const openEditDialog = (facility: Facility) => {
      setEditingFacility(facility);
      setFormData({
        name: facility.name,
        description: facility.description || '',
        image_url: facility.image_url || '',
        images: facility.images || [],
        features: facility.features || [],
        operating_hours: facility.operating_hours || '',
        capacity: facility.capacity || '',
        price: facility.price?.toString() || '',
        is_active: facility.is_active,
        sort_order: facility.sort_order
      });
      setDialogOpen(true);
    };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const facilityData = {
      name: formData.name,
      description: formData.description || null,
      image_url: formData.image_url || null,
      images: formData.images.length > 0 ? formData.images : null,
      features: formData.features.length > 0 ? formData.features : null,
      operating_hours: formData.operating_hours || null,
      capacity: formData.capacity || null,
      price: formData.price ? parseFloat(formData.price) : null,
      is_active: formData.is_active,
      sort_order: formData.sort_order
    };

    try {
      if (editingFacility) {
        const { error } = await supabase
          .from('facilities')
          .update(facilityData)
          .eq('id', editingFacility.id);
        
        if (error) throw error;
        toast({ title: 'Fasilitas berhasil diperbarui' });
      } else {
        const { error } = await supabase
          .from('facilities')
          .insert(facilityData);
        
        if (error) throw error;
        toast({ title: 'Fasilitas berhasil ditambahkan' });
      }

      setDialogOpen(false);
      resetForm();
      fetchFacilities();
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

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus fasilitas ini?')) return;

    try {
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Fasilitas berhasil dihapus' });
      fetchFacilities();
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message 
      });
    }
  };

  const getImageCount = (facility: Facility) => {
    return (facility.image_url ? 1 : 0) + (facility.images?.length || 0);
  };

  return (
    <AdminLayout title="Kelola Fasilitas" description="Tambah dan edit fasilitas hotel">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Daftar Fasilitas</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-dark text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Fasilitas
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingFacility ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Image */}
                <div className="space-y-2">
                  <Label>Gambar Utama</Label>
                  <ImageUpload
                    currentImageUrl={formData.image_url}
                    onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                    folder="facilities"
                  />
                </div>

                {/* Additional Images */}
                <div className="space-y-2">
                  <Label>Gambar Tambahan (Galeri)</Label>
                  <MultiImageUpload
                    images={formData.images}
                    onImagesChange={(images) => setFormData({ ...formData, images })}
                    folder="facilities"
                    maxImages={10}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Fasilitas *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Urutan</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="operating_hours">Jam Operasional</Label>
                      <Input
                        id="operating_hours"
                        placeholder="Contoh: 06:00 - 22:00"
                        value={formData.operating_hours}
                        onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Kapasitas</Label>
                      <Input
                        id="capacity"
                        placeholder="Contoh: 50 orang"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Biaya (Optional)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="Contoh: 100000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  </div>

                {/* Features */}
                <div className="space-y-3">
                  <Label>Fitur Fasilitas</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tambah fitur..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                    />
                    <Button type="button" variant="secondary" onClick={addFeature}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="bg-gold/10 text-gold border-gold/20 pr-1.5"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="ml-1.5 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Aktif</Label>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gold hover:bg-gold-dark text-accent-foreground"
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data fasilitas. Klik "Tambah Fasilitas" untuk menambahkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>Gambar</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Biaya</TableHead>
                      <TableHead>Info</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell>
                        <div className="relative">
                          {facility.image_url ? (
                            <img 
                              src={facility.image_url} 
                              alt={facility.name}
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                          {getImageCount(facility) > 1 && (
                            <div className="absolute -top-1 -right-1 bg-gold text-accent-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Images className="w-3 h-3" />
                              {getImageCount(facility)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                        <TableCell className="font-medium">{facility.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{facility.description || '-'}</TableCell>
                        <TableCell>
                          {facility.price ? (
                            new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              maximumFractionDigits: 0
                            }).format(facility.price)
                          ) : (
                            <span className="text-muted-foreground italic text-xs">Gratis / Incl.</span>
                          )}
                        </TableCell>
                        <TableCell>
                        <div className="space-y-1 text-xs">
                          {facility.operating_hours && (
                            <div className="text-muted-foreground">⏰ {facility.operating_hours}</div>
                          )}
                          {facility.capacity && (
                            <div className="text-muted-foreground">👥 {facility.capacity}</div>
                          )}
                          {facility.features && facility.features.length > 0 && (
                            <div className="text-muted-foreground">🏷️ {facility.features.length} fitur</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          facility.is_active 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'bg-red-500/10 text-red-600'
                        }`}>
                          {facility.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(facility)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(facility.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Facilities;