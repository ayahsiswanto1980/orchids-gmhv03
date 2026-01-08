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
import { Plus, Pencil, Trash2, Loader2, Link as LinkIcon } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface FooterLogo {
  id: string;
  name: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
}

const FooterLogos = () => {
  const { toast } = useToast();
  const [logos, setLogos] = useState<FooterLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<FooterLogo | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    link_url: '',
    is_active: true,
    sort_order: 0
  });

  const fetchLogos = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_logos')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      setLogos(data || []);
    } catch (error) {
      console.error('Error fetching logos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      image_url: '',
      link_url: '',
      is_active: true,
      sort_order: 0
    });
    setEditingLogo(null);
  };

  const openEditDialog = (logo: FooterLogo) => {
    setEditingLogo(logo);
    setFormData({
      name: logo.name,
      image_url: logo.image_url,
      link_url: logo.link_url || '',
      is_active: logo.is_active,
      sort_order: logo.sort_order
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gambar logo harus diunggah' });
      return;
    }

    setSaving(true);

    const logoData = {
      name: formData.name,
      image_url: formData.image_url,
      link_url: formData.link_url || null,
      is_active: formData.is_active,
      sort_order: formData.sort_order
    };

    try {
      if (editingLogo) {
        const { error } = await supabase
          .from('footer_logos')
          .update(logoData)
          .eq('id', editingLogo.id);
        
        if (error) throw error;
        toast({ title: 'Logo berhasil diperbarui' });
      } else {
        const { error } = await supabase
          .from('footer_logos')
          .insert(logoData);
        
        if (error) throw error;
        toast({ title: 'Logo berhasil ditambahkan' });
      }

      setDialogOpen(false);
      resetForm();
      fetchLogos();
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
    if (!confirm('Yakin ingin menghapus logo ini?')) return;

    try {
      const { error } = await supabase
        .from('footer_logos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Logo berhasil dihapus' });
      fetchLogos();
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message 
      });
    }
  };

  return (
    <AdminLayout title="Kelola Logo Footer" description="Manajemen logo partner atau brand di bagian bawah website">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-gold">Daftar Logo</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-dark text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Logo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingLogo ? 'Edit Logo' : 'Tambah Logo Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>File Gambar Logo</Label>
                  <ImageUpload
                    currentImageUrl={formData.image_url}
                    onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                    folder="footer-logos"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Partner / Brand</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: CHSE Certified"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="link_url">Link URL (Opsional)</Label>
                  <Input
                    id="link_url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="https://..."
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
          ) : logos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data logo. Klik "Tambah Logo" untuk menambahkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Urutan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logos.map((logo) => (
                    <TableRow key={logo.id}>
                      <TableCell>
                        <div className="bg-muted p-2 rounded w-20 h-12 flex items-center justify-center overflow-hidden">
                          <img 
                            src={logo.image_url} 
                            alt={logo.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{logo.name}</TableCell>
                      <TableCell>
                        {logo.link_url ? (
                          <a href={logo.link_url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" />
                            Visit
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{logo.sort_order}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          logo.is_active 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'bg-red-500/10 text-red-600'
                        }`}>
                          {logo.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(logo)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(logo.id)}
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

export default FooterLogos;
