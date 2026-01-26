import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  category: string | null;
  is_active: boolean;
  sort_order: number;
}

const Gallery = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    category: 'General',
    is_active: true,
    sort_order: 0
  });

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      category: 'General',
      is_active: true,
      sort_order: 0
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      image_url: item.image_url,
      category: item.category || 'General',
      is_active: item.is_active,
      sort_order: item.sort_order
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gambar harus diunggah' });
      return;
    }
    
    setSaving(true);

    const itemData = {
      title: formData.title || null,
      image_url: formData.image_url,
      category: formData.category || null,
      is_active: formData.is_active,
      sort_order: formData.sort_order
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('gallery')
          .update(itemData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast({ title: 'Item galeri berhasil diperbarui' });
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert(itemData);
        
        if (error) throw error;
        toast({ title: 'Item galeri berhasil ditambahkan' });
      }

      setDialogOpen(false);
      resetForm();
      fetchGallery();
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
    if (!confirm('Yakin ingin menghapus item galeri ini?')) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Item galeri berhasil dihapus' });
      fetchGallery();
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message 
      });
    }
  };

  return (
    <AdminLayout title="Kelola Galeri" description="Atur koleksi foto hotel dan fasilitas">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Daftar Galeri</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-dark text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Foto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingItem ? 'Edit Foto' : 'Tambah Foto Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Unggah Gambar *</Label>
                  <ImageUpload
                    currentImageUrl={formData.image_url}
                    onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                    folder="gallery"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Judul (Opsional)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Input
                    id="category"
                    placeholder="Contoh: Kamar, Fasilitas, Restoran"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Urutan</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 pt-8">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Aktif</Label>
                  </div>
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
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Belum ada foto di galeri.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img 
                    src={item.image_url} 
                    alt={item.title || 'Gallery item'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div className="text-white text-xs font-medium px-2 text-center line-clamp-2">
                      {item.title || item.category}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => openEditDialog(item)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className={`mt-1 px-1.5 py-0.5 rounded text-[10px] ${
                      item.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {item.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Gallery;
