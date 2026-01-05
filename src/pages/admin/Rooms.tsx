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

interface Room {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  images: string[] | null;
  features: string[] | null;
  capacity: string | null;
  room_size: string | null;
  bed_type: string | null;
  is_active: boolean;
  sort_order: number;
}

const Rooms = () => {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [newFeature, setNewFeature] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    images: [] as string[],
    features: [] as string[],
    capacity: '',
    room_size: '',
    bed_type: '',
    is_active: true,
    sort_order: 0
  });

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      images: [],
      features: [],
      capacity: '',
      room_size: '',
      bed_type: '',
      is_active: true,
      sort_order: 0
    });
    setEditingRoom(null);
    setNewFeature('');
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description || '',
      price: room.price.toString(),
      image_url: room.image_url || '',
      images: room.images || [],
      features: room.features || [],
      capacity: room.capacity || '',
      room_size: room.room_size || '',
      bed_type: room.bed_type || '',
      is_active: room.is_active,
      sort_order: room.sort_order
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

    const roomData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      image_url: formData.image_url || null,
      images: formData.images.length > 0 ? formData.images : null,
      features: formData.features.length > 0 ? formData.features : null,
      capacity: formData.capacity || null,
      room_size: formData.room_size || null,
      bed_type: formData.bed_type || null,
      is_active: formData.is_active,
      sort_order: formData.sort_order
    };

    try {
      if (editingRoom) {
        const { error } = await supabase
          .from('rooms')
          .update(roomData)
          .eq('id', editingRoom.id);
        
        if (error) throw error;
        toast({ title: 'Kamar berhasil diperbarui' });
      } else {
        const { error } = await supabase
          .from('rooms')
          .insert(roomData);
        
        if (error) throw error;
        toast({ title: 'Kamar berhasil ditambahkan' });
      }

      setDialogOpen(false);
      resetForm();
      fetchRooms();
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
    if (!confirm('Yakin ingin menghapus kamar ini?')) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Kamar berhasil dihapus' });
      fetchRooms();
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message 
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getImageCount = (room: Room) => {
    return (room.image_url ? 1 : 0) + (room.images?.length || 0);
  };

  return (
    <AdminLayout title="Kelola Kamar" description="Tambah dan edit data kamar hotel">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Daftar Kamar</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-dark text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kamar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingRoom ? 'Edit Kamar' : 'Tambah Kamar Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Image */}
                <div className="space-y-2">
                  <Label>Gambar Utama</Label>
                  <ImageUpload
                    currentImageUrl={formData.image_url}
                    onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                    folder="rooms"
                  />
                </div>

                {/* Additional Images */}
                <div className="space-y-2">
                  <Label>Gambar Tambahan (Galeri)</Label>
                  <MultiImageUpload
                    images={formData.images}
                    onImagesChange={(images) => setFormData({ ...formData, images })}
                    folder="rooms"
                    maxImages={10}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Kamar *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga per Malam (IDR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
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
                    <Label htmlFor="capacity">Kapasitas</Label>
                    <Input
                      id="capacity"
                      placeholder="Contoh: 2 Tamu"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="room_size">Luas Kamar</Label>
                    <Input
                      id="room_size"
                      placeholder="Contoh: 28 m²"
                      value={formData.room_size}
                      onChange={(e) => setFormData({ ...formData, room_size: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bed_type">Tipe Kasur</Label>
                    <Input
                      id="bed_type"
                      placeholder="Contoh: King Size"
                      value={formData.bed_type}
                      onChange={(e) => setFormData({ ...formData, bed_type: e.target.value })}
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <Label>Fasilitas Kamar</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tambah fasilitas..."
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
          ) : rooms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada data kamar. Klik "Tambah Kamar" untuk menambahkan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <div className="relative">
                          {room.image_url ? (
                            <img 
                              src={room.image_url} 
                              alt={room.name}
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                          {getImageCount(room) > 1 && (
                            <div className="absolute -top-1 -right-1 bg-gold text-accent-foreground text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Images className="w-3 h-3" />
                              {getImageCount(room)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-normal">{room.name}</TableCell>
                      <TableCell>{formatPrice(room.price)}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          {room.capacity && (
                            <div className="text-muted-foreground">👥 {room.capacity}</div>
                          )}
                          {room.room_size && (
                            <div className="text-muted-foreground">📐 {room.room_size}</div>
                          )}
                          {room.bed_type && (
                            <div className="text-muted-foreground">🛏️ {room.bed_type}</div>
                          )}
                          {room.features && room.features.length > 0 && (
                            <div className="text-muted-foreground">🏷️ {room.features.length} fasilitas</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          room.is_active 
                            ? 'bg-green-500/10 text-green-600' 
                            : 'bg-red-500/10 text-red-600'
                        }`}>
                          {room.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(room)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(room.id)}
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

export default Rooms;