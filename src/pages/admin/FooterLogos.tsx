import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X, GripVertical, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface FooterLogo {
  id: string;
  name: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
}

const FooterLogos = () => {
  const [logos, setLogos] = useState<FooterLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<FooterLogo>>({
    name: "",
    image_url: "",
    link_url: "",
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const { data, error } = await supabase
        .from("footer_logos")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setLogos(data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error("Gagal mengambil data logo: " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast.error("Logo harus diunggah");
      return;
    }

    try {
      if (formData.id) {
        const { error } = await supabase
          .from("footer_logos")
          .update({
            name: formData.name,
            image_url: formData.image_url,
            link_url: formData.link_url,
            is_active: formData.is_active,
            sort_order: formData.sort_order,
            updated_at: new Date().toISOString(),
          })
          .eq("id", formData.id);

        if (error) throw error;
        toast.success("Logo berhasil diperbarui");
      } else {
        const { error } = await supabase.from("footer_logos").insert([
          {
            name: formData.name,
            image_url: formData.image_url,
            link_url: formData.link_url,
            is_active: formData.is_active,
            sort_order: logos.length,
          },
        ]);

        if (error) throw error;
        toast.success("Logo berhasil ditambahkan");
      }

      setIsEditing(false);
      setFormData({
        name: "",
        image_url: "",
        link_url: "",
        is_active: true,
        sort_order: 0,
      });
      fetchLogos();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error("Gagal menyimpan logo: " + message);
    }
  };

  const handleEdit = (logo: FooterLogo) => {
    setFormData(logo);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus logo ini?")) return;

    try {
      const { error } = await supabase.from("footer_logos").delete().eq("id", id);
      if (error) throw error;
      toast.success("Logo berhasil dihapus");
      fetchLogos();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error("Gagal menghapus logo: " + message);
    }
  };

  const toggleActive = async (logo: FooterLogo) => {
    try {
      const { error } = await supabase
        .from("footer_logos")
        .update({ is_active: !logo.is_active })
        .eq("id", logo.id);

      if (error) throw error;
      fetchLogos();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error("Gagal memperbarui status: " + message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-sans text-foreground">Logo Footer</h1>
          <p className="text-muted-foreground">Kelola logo partner atau brand yang tampil di bagian bawah website.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-gold hover:bg-gold-dark text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Logo
          </Button>
        )}
      </div>

      {isEditing && (
        <Card className="border-gold/20 shadow-lg">
          <CardHeader>
            <CardTitle>{formData.id ? "Edit Logo" : "Tambah Logo Baru"}</CardTitle>
            <CardDescription>Isi detail logo di bawah ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Brand/Partner</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Traveloka, Booking.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="link_url">Link URL (Opsional)</Label>
                    <Input
                      id="link_url"
                      value={formData.link_url || ""}
                      onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Aktifkan Logo</Label>
                  </div>
                </div>
                <div>
                  <Label>Logo</Label>
                  <ImageUpload
                    currentImageUrl={formData.image_url}
                    onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: "", image_url: "", link_url: "", is_active: true, sort_order: 0 });
                }}>
                  Batal
                </Button>
                <Button type="submit" className="bg-gold hover:bg-gold-dark text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Logo
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Logo</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Memuat data...</TableCell>
                </TableRow>
              ) : logos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Belum ada logo yang ditambahkan.</TableCell>
                </TableRow>
              ) : (
                logos.map((logo) => (
                  <TableRow key={logo.id}>
                    <TableCell>
                      <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex items-center justify-center border">
                        {logo.image_url ? (
                          <img src={logo.image_url} alt={logo.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{logo.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {logo.link_url || "-"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={logo.is_active}
                        onCheckedChange={() => toggleActive(logo)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(logo)}>
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(logo.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterLogos;
