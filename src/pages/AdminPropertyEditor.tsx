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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import SeoFields from '@/components/admin/SeoFields';
import FaqEditor from '@/components/admin/FaqEditor';
import StringListEditor from '@/components/admin/StringListEditor';
import type { PropertyRow, School } from '@/integrations/supabase/cms-types';

const empty: any = {
  slug: '', title_en: '', title_zh: '', property_type: '', price: 0, location: '', address: '',
  beds: 0, baths: 0, sqft: 0, status: 'available', featured: false, published: true,
  image_url: '', video_url: '', gallery: [], description_en: '', description_zh: '', overview_en: '', overview_zh: '',
  features: { interior_en: [], interior_zh: [], exterior_en: [], exterior_zh: [], style_en: '', style_zh: '', lot_size: '' },
  schools: { elementary: [], high_school: [] },
  other_details: { days_on_market: 0, year_built: 0, garage_en: '', garage_zh: '', accessibility_en: [], accessibility_zh: [], heating_en: '', heating_zh: '', cooling_en: '', cooling_zh: '' },
  location_lat: null, location_lng: null, seo: {}, faqs: [],
};

const AdminPropertyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [form, setForm] = useState<any>(empty);

  const set = (patch: any) => setForm((f: any) => ({ ...f, ...patch }));
  const setNested = (key: string, patch: any) => setForm((f: any) => ({ ...f, [key]: { ...f[key], ...patch } }));

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
      if (error || !data) { toast({ title: 'Error', description: error?.message, variant: 'destructive' }); navigate('/admin/properties'); return; }
      setForm({ ...empty, ...data, features: { ...empty.features, ...(data as any).features }, schools: { ...empty.schools, ...(data as any).schools }, other_details: { ...empty.other_details, ...(data as any).other_details }, seo: (data as any).seo || {}, faqs: (data as any).faqs || [], gallery: (data as any).gallery || [] });
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
        ? await supabase.from('properties').update(payload).eq('id', id)
        : await supabase.from('properties').insert([payload]);
      if (res.error) throw res.error;
      toast({ title: 'Success', description: id ? 'Property updated' : 'Property created' });
      navigate('/admin/properties');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  // school list helpers
  const updateSchools = (group: 'elementary' | 'high_school', list: School[]) => setNested('schools', { [group]: list });
  const SchoolGroup = ({ group, title }: { group: 'elementary' | 'high_school'; title: string }) => {
    const list: School[] = form.schools?.[group] || [];
    return (
      <div className="space-y-3">
        <Label>{title}</Label>
        {list.map((s, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-6"><Input placeholder="School name" value={s.name} onChange={(e) => updateSchools(group, list.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} /></div>
            <div className="col-span-2"><Input type="number" placeholder="Rating /10" value={s.rating} onChange={(e) => updateSchools(group, list.map((x, idx) => idx === i ? { ...x, rating: Number(e.target.value) } : x))} /></div>
            <div className="col-span-3"><Input placeholder="Distance" value={s.distance} onChange={(e) => updateSchools(group, list.map((x, idx) => idx === i ? { ...x, distance: e.target.value } : x))} /></div>
            <div className="col-span-1"><Button type="button" variant="ghost" size="icon" onClick={() => updateSchools(group, list.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button></div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => updateSchools(group, [...list, { name: '', rating: 8, distance: '' }])}><Plus className="h-4 w-4 mr-2" />Add school</Button>
      </div>
    );
  };

  // gallery helpers
  const gallery: string[] = form.gallery || [];
  const setGallery = (g: string[]) => set({ gallery: g });

  if (initialLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/properties')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <h1 className="text-3xl font-bold text-foreground flex-1">{id ? 'Edit Property' : 'New Property'}</h1>
        {id && form.slug && (
          <a href={`/projects/${form.slug}`} target="_blank" rel="noreferrer" className="text-sm text-primary inline-flex items-center gap-1"><ExternalLink className="h-4 w-4" />Preview</a>
        )}
      </div>

      <form onSubmit={onSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* BASIC */}
          <TabsContent value="basic" className="mt-4">
            <Card><CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="imperial-suite" required /></div>
                <div className="space-y-2"><Label>Property Type</Label><Input value={form.property_type || ''} onChange={(e) => set({ property_type: e.target.value })} placeholder="Penthouse" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => set({ status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="under_contract">Under Contract</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Price (MYR)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => set({ price: Number(e.target.value) })} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Location (short)</Label><Input value={form.location} onChange={(e) => set({ location: e.target.value })} placeholder="KLCC, Kuala Lumpur" required /></div>
                <div className="space-y-2"><Label>Full Address</Label><Input value={form.address || ''} onChange={(e) => set({ address: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Bedrooms</Label><Input type="number" value={form.beds} onChange={(e) => set({ beds: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Bathrooms</Label><Input type="number" step="0.5" value={form.baths} onChange={(e) => set({ baths: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Square Feet</Label><Input type="number" value={form.sqft} onChange={(e) => set({ sqft: Number(e.target.value) })} /></div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center justify-between gap-4"><Label>Featured</Label><Switch checked={form.featured} onCheckedChange={(c) => set({ featured: c })} /></div>
                <div className="flex items-center justify-between gap-4"><Label>Published</Label><Switch checked={form.published} onCheckedChange={(c) => set({ published: c })} /></div>
              </div>
            </CardContent></Card>
          </TabsContent>

          {/* CONTENT */}
          <TabsContent value="content" className="mt-4">
            <Card><CardHeader><CardTitle>Bilingual Content</CardTitle></CardHeader><CardContent>
              <Tabs defaultValue="en">
                <TabsList className="grid w-full grid-cols-2 mb-4"><TabsTrigger value="en">English</TabsTrigger><TabsTrigger value="zh">中文</TabsTrigger></TabsList>
                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2"><Label>Title (EN)</Label><Input value={form.title_en} onChange={(e) => set({ title_en: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Short Description (EN)</Label><Textarea rows={3} value={form.description_en} onChange={(e) => set({ description_en: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Overview (EN)</Label><Textarea rows={8} value={form.overview_en || ''} onChange={(e) => set({ overview_en: e.target.value })} /></div>
                </TabsContent>
                <TabsContent value="zh" className="space-y-4">
                  <div className="space-y-2"><Label>Title (中文)</Label><Input value={form.title_zh} onChange={(e) => set({ title_zh: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Short Description (中文)</Label><Textarea rows={3} value={form.description_zh} onChange={(e) => set({ description_zh: e.target.value })} required /></div>
                  <div className="space-y-2"><Label>Overview (中文)</Label><Textarea rows={8} value={form.overview_zh || ''} onChange={(e) => set({ overview_zh: e.target.value })} /></div>
                </TabsContent>
              </Tabs>
            </CardContent></Card>
          </TabsContent>

          {/* DETAILS */}
          <TabsContent value="details" className="mt-4 space-y-6">
            <Card><CardHeader><CardTitle>Features</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StringListEditor label="Interior Features (EN)" value={form.features.interior_en || []} onChange={(l) => setNested('features', { interior_en: l })} />
                <StringListEditor label="Interior Features (中文)" value={form.features.interior_zh || []} onChange={(l) => setNested('features', { interior_zh: l })} />
                <StringListEditor label="Exterior Features (EN)" value={form.features.exterior_en || []} onChange={(l) => setNested('features', { exterior_en: l })} />
                <StringListEditor label="Exterior Features (中文)" value={form.features.exterior_zh || []} onChange={(l) => setNested('features', { exterior_zh: l })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Style (EN)</Label><Input value={form.features.style_en || ''} onChange={(e) => setNested('features', { style_en: e.target.value })} /></div>
                <div className="space-y-2"><Label>Style (中文)</Label><Input value={form.features.style_zh || ''} onChange={(e) => setNested('features', { style_zh: e.target.value })} /></div>
                <div className="space-y-2"><Label>Lot Size</Label><Input value={form.features.lot_size || ''} onChange={(e) => setNested('features', { lot_size: e.target.value })} /></div>
              </div>
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Schools</CardTitle></CardHeader><CardContent className="space-y-6">
              <SchoolGroup group="elementary" title="Elementary Schools" />
              <SchoolGroup group="high_school" title="High Schools" />
            </CardContent></Card>

            <Card><CardHeader><CardTitle>Additional Information</CardTitle></CardHeader><CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Days on Market</Label><Input type="number" value={form.other_details.days_on_market || 0} onChange={(e) => setNested('other_details', { days_on_market: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Year Built</Label><Input type="number" value={form.other_details.year_built || 0} onChange={(e) => setNested('other_details', { year_built: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Garage (EN)</Label><Input value={form.other_details.garage_en || ''} onChange={(e) => setNested('other_details', { garage_en: e.target.value })} /></div>
                <div className="space-y-2"><Label>Garage (中文)</Label><Input value={form.other_details.garage_zh || ''} onChange={(e) => setNested('other_details', { garage_zh: e.target.value })} /></div>
                <div className="space-y-2"><Label>Heating (EN)</Label><Input value={form.other_details.heating_en || ''} onChange={(e) => setNested('other_details', { heating_en: e.target.value })} /></div>
                <div className="space-y-2"><Label>Heating (中文)</Label><Input value={form.other_details.heating_zh || ''} onChange={(e) => setNested('other_details', { heating_zh: e.target.value })} /></div>
                <div className="space-y-2"><Label>Cooling (EN)</Label><Input value={form.other_details.cooling_en || ''} onChange={(e) => setNested('other_details', { cooling_en: e.target.value })} /></div>
                <div className="space-y-2"><Label>Cooling (中文)</Label><Input value={form.other_details.cooling_zh || ''} onChange={(e) => setNested('other_details', { cooling_zh: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StringListEditor label="Accessibility (EN)" value={form.other_details.accessibility_en || []} onChange={(l) => setNested('other_details', { accessibility_en: l })} />
                <StringListEditor label="Accessibility (中文)" value={form.other_details.accessibility_zh || []} onChange={(l) => setNested('other_details', { accessibility_zh: l })} />
              </div>
            </CardContent></Card>
          </TabsContent>

          {/* MEDIA */}
          <TabsContent value="media" className="mt-4 space-y-6">
            <Card><CardHeader><CardTitle>Cover Image</CardTitle></CardHeader><CardContent>
              <ImageUploader value={form.image_url} onChange={(url) => set({ image_url: url })} folder="properties" label="" />
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Video (optional)</CardTitle></CardHeader><CardContent className="space-y-2">
              <Label>Video URL</Label>
              <Input value={form.video_url || ''} onChange={(e) => set({ video_url: e.target.value })} placeholder="https://youtube.com/watch?v=... , Vimeo, or a direct .mp4 link" />
              <p className="text-sm text-muted-foreground">When set, the detail page shows this video in the main slot instead of the cover image. Supports YouTube, Vimeo, and direct video files.</p>
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Gallery</CardTitle></CardHeader><CardContent className="space-y-4">
              {gallery.map((url: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={url} alt="" className="w-24 h-16 object-cover rounded border" />
                  <Input className="flex-1 text-xs" value={url} onChange={(e) => setGallery(gallery.map((g, idx) => idx === i ? e.target.value : g))} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <ImageUploader label="Add image to gallery" value="" onChange={(url) => url && setGallery([...gallery, url])} folder="properties" />
            </CardContent></Card>
          </TabsContent>

          {/* LOCATION */}
          <TabsContent value="location" className="mt-4">
            <Card><CardHeader><CardTitle>Map Coordinates</CardTitle></CardHeader><CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Latitude &amp; longitude for the property map. Leave blank to hide the map.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Latitude</Label><Input type="number" step="0.0001" value={form.location_lat ?? ''} onChange={(e) => set({ location_lat: e.target.value === '' ? null : Number(e.target.value) })} placeholder="3.1578" /></div>
                <div className="space-y-2"><Label>Longitude</Label><Input type="number" step="0.0001" value={form.location_lng ?? ''} onChange={(e) => set({ location_lng: e.target.value === '' ? null : Number(e.target.value) })} placeholder="101.7123" /></div>
              </div>
            </CardContent></Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="mt-4">
            <Card><CardHeader><CardTitle>SEO &amp; Social</CardTitle></CardHeader><CardContent>
              <SeoFields value={form.seo || {}} onChange={(seo) => set({ seo })} />
            </CardContent></Card>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="mt-4">
            <Card><CardHeader><CardTitle>FAQ (AEO)</CardTitle></CardHeader><CardContent>
              <FaqEditor value={form.faqs || []} onChange={(faqs) => set({ faqs })} />
            </CardContent></Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/properties')} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="h-4 w-4 mr-2" />{id ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminPropertyEditor;
