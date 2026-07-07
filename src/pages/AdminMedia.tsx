import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, Copy, Check } from 'lucide-react';

const BUCKET = 'cms-images';

async function listAll(): Promise<string[]> {
  const urls: string[] = [];
  const seen = new Set<string>();
  const collect = async (prefix: string) => {
    const { data } = await supabase.storage.from(BUCKET).list(prefix, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
    if (!data) return;
    for (const item of data) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) { if (!seen.has(full)) { seen.add(full); await collect(full); } }
      else if (/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(item.name)) {
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(full);
        urls.push(pub.publicUrl);
      }
    }
  };
  await collect('');
  return urls;
}

const AdminMedia = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => { setImages(await listAll()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const name = `${Math.random().toString(36).substring(2)}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(`uploads/${name}`, file);
        if (error) throw error;
      }
      toast({ title: 'Uploaded', description: `${files.length} file(s)` });
      await load();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally { setUploading(false); }
  };

  const copy = (url: string) => { navigator.clipboard.writeText(url); setCopied(url); setTimeout(() => setCopied(null), 1500); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground text-sm">Uploaded images in the cms-images bucket.</p>
        </div>
        <label>
          <input type="file" accept="image/*" multiple className="hidden" onChange={upload} disabled={uploading} />
          <Button asChild disabled={uploading}><span className="cursor-pointer">{uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}Upload</span></Button>
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : images.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No images yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url) => (
            <div key={url} className="border rounded-md overflow-hidden group">
              <img src={url} alt="" className="w-full h-32 object-cover" />
              <div className="p-2 flex items-center gap-2">
                <Input readOnly value={url} className="text-xs h-8" onFocus={(e) => e.target.select()} />
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copy(url)}>
                  {copied === url ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
