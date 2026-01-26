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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  button_text: string | null;
  button_url: string | null;
  is_active: boolean;
  sort_order: number;
}

const Promotions = () => {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    button_text: 'Lihat Detail',
    button_url: '',
    is_active: true,
    sort_order: 0
  });

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      button_text: 'Lihat Detail',
      button_url: '',
      is_active: true,
      sort_order: 0
    });
    setEditingPromo(null);
  };

  const openEditDialog = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      description: promo.description || '',
      image_url: promo.image_url || '',
      button_text: promo.button_text || 'Lihat Detail',
      button_url: promo.button_url || '',
      is_active: promo.is_active,
      sort_order: promo.sort_order
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const promoData = {
      title: formData.title,
      description: formData.description || null,
      image_url: formData.image_url || null,
      button_text: formData.button_text || null,
      button_url: formData.button_url || null,
      is_active: formData.is_active,
      sort_order: formData.sort_order
    };

    try {
      if (editingPromo) {
        const { error } = await supabase
          .from('promotions')
          .update(promoData)
          .eq('id', editingPromo.id);
        
        if (error) throw error;
        toast({ title: 'Promo berhasil diperbarui' });
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert(promoData);
        
        if (error) throw error;
        toast({ title: 'Promo berhasil ditambahkan' });
      }

      setDialogOpen(false);
      resetForm();
      fetchPromotions();
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
    if (!confirm('Yakin ingin menghapus promo ini?')) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Promo berhasil dihapus' });
      fetchPromotions();
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message 
      });
    }
  };

  return (
    <AdminLayout title="Kelola Promo" description="Atur penawaran spesial dan promo hotel">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Daftar Promo</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-dark text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Promo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingPromo ? 'Edit Promo' : 'Tambah Promo Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Gambar Promo</Label>
                  <ImageUpload
                    currentImageUrl={formData.image_url}
                    onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                    folder="promotions"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Promo *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="button_text">Teks Tombol</Label>
                    <Input
                      id="button_text"
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="button_url">Link Tombol (URL/Anchor)</Label>
                    <Input
                      id="button_url"
                      placeholder="Contoh: #kamar atau /booking"
                      value={formData.button_url}
                      onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                    />
                  </div>
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
          ) : promotions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data promo.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell>
                        {promo.image_url ? (
                          <img 
                            src={promo.image_url} 
                            alt={promo.title}
                            className="w-20 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                            No image
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{promo.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                          {promo.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {promo.button_url && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ExternalLink className="w-3 h-3" />
                            {promo.button_url}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          promo.is_active 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'bg-red-500/10 text-red-600'
                        }`}>
                          {promo.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(promo)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(promo.id)}
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

export default Promotions;
