import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import { clearSettingsCache } from '@/lib/useSettings';
import type { GlobalSettings } from '@/integrations/supabase/cms-types';

const AdminSettings = () => {
  const [form, setForm] = useState<GlobalSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<GlobalSettings>) => setForm((f) => ({ ...f, ...patch }));

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('settings').select('value').eq('key', 'global').maybeSingle();
      setForm(((data?.value as GlobalSettings) || {}));
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('settings').upsert({ key: 'global', value: form as any }, { onConflict: 'key' });
      if (error) throw error;
      clearSettingsCache();
      toast({ title: 'Saved', description: 'Settings updated' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const field = (label: string, key: keyof GlobalSettings, placeholder?: string) => (
    <div className="space-y-2"><Label>{label}</Label><Input value={(form[key] as string) || ''} onChange={(e) => set({ [key]: e.target.value } as any)} placeholder={placeholder} /></div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
          <p className="text-muted-foreground text-sm">Global contact details, social links, and default SEO.</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="h-4 w-4 mr-2" />Save</Button>
      </div>

      <Card><CardHeader><CardTitle>Brand &amp; Contact</CardTitle></CardHeader><CardContent className="space-y-4">
        {field('Brand Name', 'brand_name')}
        <div className="grid grid-cols-2 gap-4">
          {field('Phone', 'phone')}
          {field('Email', 'email')}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Office (EN)</Label><Textarea rows={3} value={form.office_en || ''} onChange={(e) => set({ office_en: e.target.value })} /></div>
          <div className="space-y-2"><Label>Office (中文)</Label><Textarea rows={3} value={form.office_zh || ''} onChange={(e) => set({ office_zh: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {field('Service Areas (EN)', 'service_areas_en')}
          {field('Service Areas (中文)', 'service_areas_zh')}
        </div>
        {field('WhatsApp Number', 'whatsapp', '60168280399')}
        {field('Booking Calendar URL', 'calendar_url')}
      </CardContent></Card>

      <Card><CardHeader><CardTitle>Social Links</CardTitle></CardHeader><CardContent className="space-y-4">
        {field('Facebook URL', 'facebook')}
        {field('Instagram URL', 'instagram')}
        {field('LinkedIn URL', 'linkedin')}
      </CardContent></Card>

      <Card><CardHeader><CardTitle>Default SEO</CardTitle></CardHeader><CardContent className="space-y-4">
        {field('Default Meta Title', 'default_meta_title')}
        <div className="space-y-2"><Label>Default Meta Description</Label><Textarea rows={2} value={form.default_meta_description || ''} onChange={(e) => set({ default_meta_description: e.target.value })} /></div>
        <ImageUploader label="Default Social Image" value={form.default_og_image || ''} onChange={(url) => set({ default_og_image: url })} folder="seo" />
      </CardContent></Card>

      <Card><CardHeader><CardTitle>Analytics (PostHog)</CardTitle></CardHeader><CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Paste links from your PostHog project so the Dashboard can embed a summary and deep-dive links. Tracking itself is enabled via the <code>VITE_POSTHOG_KEY</code> environment variable.</p>
        {field('Shared Dashboard URL (embed)', 'posthog_dashboard_url', 'https://us.posthog.com/shared/xxxxxxxx')}
        {field('Project URL (for deep-dive links)', 'posthog_project_url', 'https://us.posthog.com/project/12345')}
      </CardContent></Card>
    </div>
  );
};

export default AdminSettings;
