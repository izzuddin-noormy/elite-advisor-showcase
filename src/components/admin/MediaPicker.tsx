import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';

interface MediaPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

const BUCKET = 'cms-images';

/** Lists images in the cms-images bucket (root + one level of folders). */
async function listAll(): Promise<string[]> {
  const urls: string[] = [];
  const seen = new Set<string>();
  const collect = async (prefix: string) => {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
    if (error || !data) return;
    for (const item of data) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) {
        // folder
        if (!seen.has(full)) { seen.add(full); await collect(full); }
      } else if (/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(item.name)) {
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(full);
        urls.push(pub.publicUrl);
      }
    }
  };
  await collect('');
  return urls;
}

const MediaPicker = ({ onSelect, onClose }: MediaPickerProps) => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    listAll().then((u) => { setImages(u); setLoading(false); });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Media Library</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="p-4 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : images.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No images uploaded yet. Upload one using the file picker.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((url) => (
                <button key={url} type="button" onClick={() => onSelect(url)} className="group relative rounded-md overflow-hidden border hover:ring-2 ring-primary">
                  <img src={url} alt="" className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPicker;
