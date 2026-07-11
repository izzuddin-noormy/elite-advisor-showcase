'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from './ImageUploader';
import type { SEO } from '@/integrations/supabase/cms-types';

interface SeoFieldsProps {
  value: SEO;
  onChange: (seo: SEO) => void;
}

const SeoFields = ({ value, onChange }: SeoFieldsProps) => {
  const set = (patch: Partial<SEO>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Controls how this content appears in search engines, social shares, and AI answer engines. Leave blank to fall back to the title/description.
      </p>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="zh">中文</TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="space-y-4">
          <div className="space-y-2">
            <Label>Meta Title (EN)</Label>
            <Input value={value.meta_title_en || ''} onChange={(e) => set({ meta_title_en: e.target.value })} placeholder="Up to ~60 characters" />
          </div>
          <div className="space-y-2">
            <Label>Meta Description (EN)</Label>
            <Textarea rows={2} value={value.meta_description_en || ''} onChange={(e) => set({ meta_description_en: e.target.value })} placeholder="Up to ~155 characters" />
          </div>
        </TabsContent>
        <TabsContent value="zh" className="space-y-4">
          <div className="space-y-2">
            <Label>Meta Title (中文)</Label>
            <Input value={value.meta_title_zh || ''} onChange={(e) => set({ meta_title_zh: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Meta Description (中文)</Label>
            <Textarea rows={2} value={value.meta_description_zh || ''} onChange={(e) => set({ meta_description_zh: e.target.value })} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <Label>Keywords (comma-separated)</Label>
        <Input value={value.keywords || ''} onChange={(e) => set({ keywords: e.target.value })} placeholder="luxury property, KLCC, Kuala Lumpur" />
      </div>
      <div className="space-y-2">
        <Label>Canonical URL (optional)</Label>
        <Input value={value.canonical || ''} onChange={(e) => set({ canonical: e.target.value })} placeholder="https://..." />
      </div>
      <ImageUploader label="Social / OG Image" value={value.og_image || ''} onChange={(url) => set({ og_image: url })} folder="seo" />
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-0.5">
          <Label>Hide from search engines (noindex)</Label>
          <p className="text-sm text-muted-foreground">Prevents this page from being indexed.</p>
        </div>
        <Switch checked={!!value.noindex} onCheckedChange={(c) => set({ noindex: c })} />
      </div>
    </div>
  );
};

export default SeoFields;
