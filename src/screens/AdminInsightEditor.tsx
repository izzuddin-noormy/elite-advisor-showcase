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
import { ArrowLeft, Save, Loader2, ExternalLink } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import SeoFields from '@/components/admin/SeoFields';
import FaqEditor from '@/components/admin/FaqEditor';

const empty: any = {
  slug: '', title_en: '', title_zh: '', excerpt_en: '', excerpt_zh: '', content_en: '', content_zh: '',
  author: 'Mu SiChen', author_title: 'Senior Real-Estate Negotiator', category: 'Market Analysis',
  read_time: 5, featured: false, published: true, image_url: '', published_at: new Date().toISOString().slice(0, 10),
  seo: {}, faqs: [],
};

const AdminInsightEditor = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [form, setForm] = useState<any>(empty);
  const set = (patch: any) => setForm((f: any) => ({ ...f, ...patch }));

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from('insights').select('*').eq('id', id).single();
      if (error || !data) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); router.push('/admin/insights'); return; }
      const d: any = data;
      setForm({ ...empty, ...d, seo: d.seo || {}, faqs: d.faqs || [], published_at: d.published_at ? String(d.published_at).slice(0, 10) : empty.published_at });
      setInitialLoading(false);
    })();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    try {
      const res = id
        ? await supabase.from('insights').update(payload).eq('id', id)
        : await supabase.from('insights').insert([payload]);
      if (res.error) throw res.error;
      toast({ title: 'Success', description: id ? 'Insight updated' : 'Insight created' });
      router.push('/admin/insights');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  if (initialLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/insights')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <h1 className="text-3xl font-bold text-foreground flex-1">{id ? 'Edit Insight' : 'New Insight'}</h1>
        {id && form.slug && <a href={`/insights/${form.slug}`} target="_blank" rel="noreferrer" className="text-sm text-primary inline-flex items-center gap-1"><ExternalLink className="h-4 w-4" />Preview</a>}
      </div>

      <form onSubmit={onSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="basic">Settings</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Image</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4">
            <Card><CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="klcc-market-trends-2025" required /></div>
                <div className="space-y-2"><Label>Category</Label><Input value={form.category || ''} onChange={(e) => set({ category: e.target.value })} placeholder="Market Analysis" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Author</Label><Input value={form.author || ''} onChange={(e) => set({ author: e.target.value })} /></div>
                <div className="space-y-2"><Label>Author Title</Label><Input value={form.author_title || ''} onChange={(e) => set({ author_title: e.target.value })} placeholder="Senior Real-Estate Negotiator" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Read Time (minutes)</Label><Input type="number" value={form.read_time || 0} onChange={(e) => set({ read_time: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Publish Date</Label><Input type="date" value={form.published_at || ''} onChange={(e) => set({ published_at: e.target.value })} /></div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4"><Label>Featured</Label><Switch checked={form.featured} onCheckedChange={(c) => set({ featured: c })} /></div>
                <div className="flex items-center gap-4"><Label>Published</Label><Switch checked={form.published} onCheckedChange={(c) => set({ published: c })} /></div>
              </div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="content" className="mt-4">
            <Card><CardHeader><CardTitle>Bilingual Content</CardTitle></CardHeader><CardContent>
              <Tabs defaultValue="en">
                <TabsList className="grid w-full grid-cols-2 mb-4"><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="zh">中文</TabsTrigger></TabsList>
                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2"><Label>Title (EN)</Label><Input value={form.title_en} onChange={(e) => set({ title_en: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Excerpt (EN)</Label><Textarea rows={3} value={form.excerpt_en || ''} onChange={(e) => set({ excerpt_en: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Content (EN)</Label><RichTextEditor value={form.content_en} onChange={(html) => set({ content_en: html })} /></div>
                </TabsContent>
                <TabsContent value="zh" className="space-y-4">
                  <div className="space-y-2"><Label>Title (中文)</Label><Input value={form.title_zh} onChange={(e) => set({ title_zh: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Excerpt (中文)</Label><Textarea rows={3} value={form.excerpt_zh || ''} onChange={(e) => set({ excerpt_zh: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Content (中文)</Label><RichTextEditor value={form.content_zh} onChange={(html) => set({ content_zh: html })} /></div>
                </TabsContent>
              </Tabs>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="media" className="mt-4">
            <Card><CardHeader><CardTitle>Featured Image</CardTitle></CardHeader><CardContent>
              <ImageUploader label="" value={form.image_url} onChange={(url) => set({ image_url: url })} folder="insights" />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="seo" className="mt-4">
            <Card><CardHeader><CardTitle>SEO &amp; Social</CardTitle></CardHeader><CardContent>
              <SeoFields value={form.seo || {}} onChange={(seo) => set({ seo })} />
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="faq" className="mt-4">
            <Card><CardHeader><CardTitle>FAQ (AEO)</CardTitle></CardHeader><CardContent>
              <FaqEditor value={form.faqs || []} onChange={(faqs) => set({ faqs })} />
            </CardContent></Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/insights')} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="h-4 w-4 mr-2" />{id ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminInsightEditor;
