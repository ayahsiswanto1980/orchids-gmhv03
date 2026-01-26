import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2, Image as ImageIcon, GripVertical } from "lucide-react";

interface MultiImageUploadProps {
  images: string[];
  onImagesChange: (urls: string[]) => void;
  folder: string;
  maxImages?: number;
  className?: string;
}

const MultiImageUpload = ({ 
  images, 
  onImagesChange, 
  folder, 
  maxImages = 10,
  className = "" 
}: MultiImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast({
        title: "Error",
        description: `Maksimal ${maxImages} gambar`,
        variant: "destructive",
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Error",
            description: `${file.name} bukan file gambar`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `${file.name} melebihi 5MB`,
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('hotel-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('hotel-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
        toast({
          title: "Berhasil",
          description: `${uploadedUrls.length} gambar berhasil diupload`,
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Gagal upload",
        description: error.message || "Terjadi kesalahan saat mengupload gambar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group aspect-video">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-border"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveImage(index, index - 1)}
                  disabled={index === 0}
                >
                  <GripVertical className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-gold text-accent-foreground text-xs px-2 py-1 rounded">
                  Utama
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
              <span className="text-sm text-muted-foreground">Mengupload...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Klik untuk upload gambar ({images.length}/{maxImages})
              </span>
              <span className="text-xs text-muted-foreground">Maksimal 5MB per gambar</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;