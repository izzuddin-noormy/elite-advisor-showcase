import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import SeoFields from '@/components/admin/SeoFields';
import FaqEditor from '@/components/admin/FaqEditor';

const empty: any = {
  slug: '', name_en: '', name_zh: '', tagline_en: '', tagline_zh: '', location_en: '', location_zh: '',
  status_en: 'New Launch', status_zh: '全新发布', price_from: '', tenure_en: '', tenure_zh: '', completion: '',
  developer_en: '', developer_zh: '', hero_image: '', hero_video_url: '', overview_en: '', overview_zh: '',
  highlights: [], specs: [], connectivity: [], location_lat: null, location_lng: null, gallery: [],
  seo: {}, faqs: [], featured: true, published: true, sort_order: 0,
};

const AdminDevelopmentEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [form, setForm] = useState<any>(empty);
  const set = (patch: any) => setForm((f: any) => ({ ...f, ...patch }));

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from('developments').select('*').eq('id', id).single();
      if (error || !data) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); navigate('/admin/developments'); return; }
      const d: any = data;
      setForm({ ...empty, ...d, highlights: d.highlights || [], specs: d.specs || [], connectivity: d.connectivity || [], gallery: d.gallery || [], seo: d.seo || {}, faqs: d.faqs || [] });
      setInitialLoading(false);
    })();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    try {
      const res = id ? await supabase.from('developments').update(payload).eq('id', id) : await supabase.from('developments').insert([payload]);
      if (res.error) throw res.error;
      toast({ title: 'Success', description: id ? 'Development updated' : 'Development created' });
      navigate('/admin/developments');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  // generic repeatable list helpers
  const addItem = (key: string, item: any) => set({ [key]: [...(form[key] || []), item] });
  const updItem = (key: string, i: number, patch: any) => set({ [key]: form[key].map((x: any, idx: number) => idx === i ? { ...x, ...patch } : x) });
  const delItem = (key: string, i: number) => set({ [key]: form[key].filter((_: any, idx: number) => idx !== i) });

  const gallery: string[] = form.gallery || [];

  if (initialLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/developments')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <h1 className="text-3xl font-bold text-foreground flex-1">{id ? 'Edit Development' : 'New Development'}</h1>
        {id && form.slug && <a href={`/new-launch/${form.slug}`} target="_blank" rel="noreferrer" className="text-sm text-primary inline-flex items-center gap-1"><ExternalLink className="h-4 w-4" />Preview</a>}
      </div>

      <form onSubmit={onSubmit}>
        <Tabs defaultValue="basic">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="content">Overview</TabsTrigger>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
            <TabsTrigger value="specs">Specs</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="media">Media &amp; Gallery</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* BASIC */}
          <TabsContent value="basic" className="mt-4">
            <Card><CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="aurelia-damansara-heights" required /></div>
                <div className="space-y-2"><Label>Price From</Label><Input value={form.price_from || ''} onChange={(e) => set({ price_from: e.target.value })} placeholder="From RM2,800,000" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name (EN)</Label><Input value={form.name_en} onChange={(e) => set({ name_en: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Name (中文)</Label><Input value={form.name_zh} onChange={(e) => set({ name_zh: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Tagline (EN)</Label><Input value={form.tagline_en || ''} onChange={(e) => set({ tagline_en: e.target.value })} /></div>
                <div className="space-y-2"><Label>Tagline (中文)</Label><Input value={form.tagline_zh || ''} onChange={(e) => set({ tagline_zh: e.target.value })} /></div>
                <div className="space-y-2"><Label>Location (EN)</Label><Input value={form.location_en || ''} onChange={(e) => set({ location_en: e.target.value })} /></div>
                <div className="space-y-2"><Label>Location (中文)</Label><Input value={form.location_zh || ''} onChange={(e) => set({ location_zh: e.target.value })} /></div>
                <div className="space-y-2"><Label>Status label (EN)</Label><Input value={form.status_en || ''} onChange={(e) => set({ status_en: e.target.value })} /></div>
                <div className="space-y-2"><Label>Status label (中文)</Label><Input value={form.status_zh || ''} onChange={(e) => set({ status_zh: e.target.value })} /></div>
                <div className="space-y-2"><Label>Developer (EN)</Label><Input value={form.developer_en || ''} onChange={(e) => set({ developer_en: e.target.value })} /></div>
                <div className="space-y-2"><Label>Developer (中文)</Label><Input value={form.developer_zh || ''} onChange={(e) => set({ developer_zh: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3"><Label>Featured</Label><Switch checked={form.featured} onCheckedChange={(c) => set({ featured: c })} /></div>
                <div className="flex items-center gap-3"><Label>Published</Label><Switch checked={form.published} onCheckedChange={(c) => set({ published: c })} /></div>
                <div className="space-y-2"><Label>Sort order</Label><Input type="number" value={form.sort_order || 0} onChange={(e) => set({ sort_order: Number(e.target.value) })} /></div>
              </div>
            </CardContent></Card>
          </TabsContent>

          {/* OVERVIEW */}
          <TabsContent value="content" className="mt-4">
            <Card><CardHeader><CardTitle>Overview</CardTitle></CardHeader><CardContent>
              <Tabs defaultValue="en">
                <TabsList className="grid w-full grid-cols-2 mb-4"><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="zh">中文</TabsTrigger></TabsList>
                <TabsContent value="en"><RichTextEditor value={form.overview_en} onChange={(h) => set({ overview_en: h })} /></TabsContent>
                <TabsContent value="zh"><RichTextEditor value={form.overview_zh} onChange={(h) => set({ overview_zh: h })} /></TabsContent>
              </Tabs>
            </CardContent></Card>
          </TabsContent>

          {/* HIGHLIGHTS */}
          <TabsContent value="highlights" className="mt-4">
            <Card><CardHeader><CardTitle>Highlights</CardTitle></CardHeader><CardContent className="space-y-4">
              {(form.highlights || []).map((h: any, i: number) => (
                <div key={i} className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between items-center"><span className="text-sm font-medium">#{i + 1}</span><Button type="button" variant="ghost" size="icon" onClick={() => delItem('highlights', i)}><Trash2 className="h-4 w-4" /></Button></div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Title (EN)" value={h.title_en || ''} onChange={(e) => updItem('highlights', i, { title_en: e.target.value })} />
                    <Input placeholder="标题 (中文)" value={h.title_zh || ''} onChange={(e) => updItem('highlights', i, { title_zh: e.target.value })} />
                    <Textarea placeholder="Description (EN)" rows={2} value={h.desc_en || ''} onChange={(e) => updItem('highlights', i, { desc_en: e.target.value })} />
                    <Textarea placeholder="描述 (中文)" rows={2} value={h.desc_zh || ''} onChange={(e) => updItem('highlights', i, { desc_zh: e.target.value })} />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addItem('highlights', { title_en: '', title_zh: '', desc_en: '', desc_zh: '' })}><Plus className="h-4 w-4 mr-2" />Add highlight</Button>
            </CardContent></Card>
          </TabsContent>

          {/* SPECS */}
          <TabsContent value="specs" className="mt-4 space-y-6">
            <Card><CardHeader><CardTitle>Fact Sheet / Specs</CardTitle></CardHeader><CardContent className="space-y-3">
              {(form.specs || []).map((s: any, i: number) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <Input className="col-span-3" placeholder="Label EN" value={s.label_en || ''} onChange={(e) => updItem('specs', i, { label_en: e.target.value })} />
                  <Input className="col-span-3" placeholder="标签 中文" value={s.label_zh || ''} onChange={(e) => updItem('specs', i, { label_zh: e.target.value })} />
                  <Input className="col-span-3" placeholder="Value EN" value={s.value_en || ''} onChange={(e) => updItem('specs', i, { value_en: e.target.value })} />
                  <Input className="col-span-2" placeholder="值 中文" value={s.value_zh || ''} onChange={(e) => updItem('specs', i, { value_zh: e.target.value })} />
                  <Button type="button" variant="ghost" size="icon" className="col-span-1" onClick={() => delItem('specs', i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addItem('specs', { label_en: '', label_zh: '', value_en: '', value_zh: '' })}><Plus className="h-4 w-4 mr-2" />Add spec</Button>
            </CardContent></Card>
          </TabsContent>

          {/* LOCATION */}
          <TabsContent value="location" className="mt-4">
            <Card><CardHeader><CardTitle>Location &amp; Connectivity</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Latitude</Label><Input type="number" step="0.0001" value={form.location_lat ?? ''} onChange={(e) => set({ location_lat: e.target.value === '' ? null : Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Longitude</Label><Input type="number" step="0.0001" value={form.location_lng ?? ''} onChange={(e) => set({ location_lng: e.target.value === '' ? null : Number(e.target.value) })} /></div>
              </div>
              <Label>Connectivity points</Label>
              {(form.connectivity || []).map((c: any, i: number) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <Input className="col-span-5" placeholder="EN" value={c.text_en || ''} onChange={(e) => updItem('connectivity', i, { text_en: e.target.value })} />
                  <Input className="col-span-6" placeholder="中文" value={c.text_zh || ''} onChange={(e) => updItem('connectivity', i, { text_zh: e.target.value })} />
                  <Button type="button" variant="ghost" size="icon" className="col-span-1" onClick={() => delItem('connectivity', i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => addItem('connectivity', { text_en: '', text_zh: '' })}><Plus className="h-4 w-4 mr-2" />Add point</Button>
            </CardContent></Card>
          </TabsContent>

          {/* MEDIA */}
          <TabsContent value="media" className="mt-4 space-y-6">
            <Card><CardHeader><CardTitle>Hero</CardTitle></CardHeader><CardContent className="space-y-4">
              <ImageUploader label="Hero Image" value={form.hero_image} onChange={(url) => set({ hero_image: url })} folder="developments" />
              <div className="space-y-2"><Label>Hero Video URL (optional)</Label><Input value={form.hero_video_url || ''} onChange={(e) => set({ hero_video_url: e.target.value })} placeholder="YouTube / Vimeo / .mp4" /></div>
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Gallery</CardTitle></CardHeader><CardContent className="space-y-4">
              {gallery.map((url: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={url} alt="" className="w-24 h-16 object-cover rounded border" />
                  <Input className="flex-1 text-xs" value={url} onChange={(e) => set({ gallery: gallery.map((g, idx) => idx === i ? e.target.value : g) })} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => set({ gallery: gallery.filter((_, idx) => idx !== i) })}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <ImageUploader label="Add image to gallery" value="" onChange={(url) => url && set({ gallery: [...gallery, url] })} folder="developments" />
            </CardContent></Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="mt-4">
            <Card><CardHeader><CardTitle>SEO &amp; Social</CardTitle></CardHeader><CardContent><SeoFields value={form.seo || {}} onChange={(seo) => set({ seo })} /></CardContent></Card>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="mt-4">
            <Card><CardHeader><CardTitle>FAQ (AEO)</CardTitle></CardHeader><CardContent><FaqEditor value={form.faqs || []} onChange={(faqs) => set({ faqs })} /></CardContent></Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/developments')} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="h-4 w-4 mr-2" />{id ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminDevelopmentEditor;
