import PropertyDetail from '@/screens/PropertyDetail';
import { supabaseServer } from '@/integrations/supabase/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data } = await supabaseServer()
      .from('properties')
      .select('title_en, title_zh, description_en, seo, image_url')
      .eq('slug', params.id)
      .eq('published', true)
      .maybeSingle();
    if (!data) return { title: 'Property' };
    const d: any = data;
    const seo = d.seo || {};
    return {
      title: seo.meta_title_en ? { absolute: seo.meta_title_en } : d.title_en,
      description: seo.meta_description_en || d.description_en,
      openGraph: { images: [seo.og_image || d.image_url].filter(Boolean) },
    };
  } catch {
    return { title: 'Property' };
  }
}

export default function Page() {
  return <PropertyDetail />;
}
