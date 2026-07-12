'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

const empty: any = {
  slug: '', title_en: '', title_zh: '', subtitle_en: '', subtitle_zh: '', description_en: '', description_zh: '',
  badge_en: '', badge_zh: '', location_en: '', location_zh: '', type_en: '', type_zh: '', price_en: '', price_zh: '',
  image_url: '', video_url: '', link: '', sort_order: 0, published: true,
};

const AdminSponsorEditor = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [form, setForm] = useState<any>(empty);
  const set = (patch: any) => setForm((f: any) => ({ ...f, ...patch }));

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from('sponsors').select('*').eq('id', id).single();
      if (error || !data) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); router.push('/admin/sponsors'); return; }
      setForm({ ...empty, ...data });
      setInitialLoading(false);
    })();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    try {
      const res = id ? await supabase.from('sponsors').update(payload).eq('id', id) : await supabase.from('sponsors').insert([payload]);
      if (res.error) throw res.error;
      toast({ title: 'Success', description: id ? 'Sponsor updated' : 'Sponsor created' });
      router.push('/admin/sponsors');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  if (initialLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/sponsors')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <h1 className="text-3xl font-bold text-foreground flex-1">{id ? 'Edit Sponsor' : 'New Sponsor'}</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card><CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="imperial-suite" required /></div>
            <div className="space-y-2"><Label>Link (on click)</Label><Input value={form.link || ''} onChange={(e) => set({ link: e.target.value })} placeholder="/projects/imperial-suite or https://..." /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Price (EN)</Label><Input value={form.price_en || ''} onChange={(e) => set({ price_en: e.target.value })} placeholder="From RM8,880,000" /></div>
            <div className="space-y-2"><Label>Price (中文)</Label><Input value={form.price_zh || ''} onChange={(e) => set({ price_zh: e.target.value })} placeholder="起价 RM8,880,000" /></div>
            <div className="space-y-2"><Label>Sort order</Label><Input type="number" value={form.sort_order || 0} onChange={(e) => set({ sort_order: Number(e.target.value) })} /></div>
          </div>
          <div className="flex items-center gap-4"><Label>Published</Label><Switch checked={form.published} onCheckedChange={(c) => set({ published: c })} /></div>
        </CardContent></Card>

        <Card><CardHeader><CardTitle>Bilingual Content</CardTitle></CardHeader><CardContent>
          <Tabs defaultValue="en">
            <TabsList className="grid w-full grid-cols-2 mb-4"><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="zh">中文</TabsTrigger></TabsList>
            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2"><Label>Title (EN)</Label><Input value={form.title_en} onChange={(e) => set({ title_en: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Subtitle (EN)</Label><Input value={form.subtitle_en || ''} onChange={(e) => set({ subtitle_en: e.target.value })} /></div>
                <div className="space-y-2"><Label>Badge (EN)</Label><Input value={form.badge_en || ''} onChange={(e) => set({ badge_en: e.target.value })} placeholder="EXCLUSIVE PREVIEW" /></div>
                <div className="space-y-2"><Label>Location (EN)</Label><Input value={form.location_en || ''} onChange={(e) => set({ location_en: e.target.value })} /></div>
                <div className="space-y-2"><Label>Type (EN)</Label><Input value={form.type_en || ''} onChange={(e) => set({ type_en: e.target.value })} placeholder="Penthouse" /></div>
              </div>
              <div className="space-y-2"><Label>Description (EN)</Label><Textarea rows={4} value={form.description_en || ''} onChange={(e) => set({ description_en: e.target.value })} /></div>
            </TabsContent>
            <TabsContent value="zh" className="space-y-4">
              <div className="space-y-2"><Label>Title (中文)</Label><Input value={form.title_zh || ''} onChange={(e) => set({ title_zh: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Subtitle (中文)</Label><Input value={form.subtitle_zh || ''} onChange={(e) => set({ subtitle_zh: e.target.value })} /></div>
                <div className="space-y-2"><Label>Badge (中文)</Label><Input value={form.badge_zh || ''} onChange={(e) => set({ badge_zh: e.target.value })} /></div>
                <div className="space-y-2"><Label>Location (中文)</Label><Input value={form.location_zh || ''} onChange={(e) => set({ location_zh: e.target.value })} /></div>
                <div className="space-y-2"><Label>Type (中文)</Label><Input value={form.type_zh || ''} onChange={(e) => set({ type_zh: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Description (中文)</Label><Textarea rows={4} value={form.description_zh || ''} onChange={(e) => set({ description_zh: e.target.value })} /></div>
            </TabsContent>
          </Tabs>
        </CardContent></Card>

        <Card><CardHeader><CardTitle>Media</CardTitle></CardHeader><CardContent className="space-y-4">
          <ImageUploader label="Image" value={form.image_url} onChange={(url) => set({ image_url: url })} folder="sponsors" />
          <div className="space-y-2"><Label>Video URL (optional)</Label><Input value={form.video_url || ''} onChange={(e) => set({ video_url: e.target.value })} placeholder="YouTube / Vimeo / .mp4" /></div>
        </CardContent></Card>

        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/sponsors')} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="h-4 w-4 mr-2" />{id ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSponsorEditor;
