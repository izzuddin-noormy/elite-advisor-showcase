import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, Image as ImageIcon, X } from 'lucide-react';
import MediaPicker from './MediaPicker';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

const ImageUploader = ({ label = 'Image', value, onChange, folder = 'uploads' }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const name = `${Math.random().toString(36).substring(2)}.${ext}`;
      const filePath = `${folder}/${name}`;
      const { error } = await supabase.storage.from('cms-images').upload(filePath, file);
      if (error) throw error;
      const { data } = supabase.storage.from('cms-images').getPublicUrl(filePath);
      onChange(data.publicUrl);
      toast({ title: 'Uploaded', description: 'Image uploaded successfully' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="flex-1" />
        {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
        <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
          <ImageIcon className="h-4 w-4 mr-2" /> Browse
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="/images/... or https://..." className="flex-1 text-xs" />
        {value && (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange('')}><X className="h-4 w-4" /></Button>
        )}
      </div>
      {value && (
        <div className="rounded-lg overflow-hidden border w-40">
          <img src={value} alt="preview" className="w-full h-28 object-cover" />
        </div>
      )}
      {pickerOpen && (
        <MediaPicker
          onSelect={(url) => { onChange(url); setPickerOpen(false); }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
};

export default ImageUploader;
