import InsightDetail from '@/screens/InsightDetail';
import { supabaseServer } from '@/integrations/supabase/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { data } = await supabaseServer()
      .from('insights')
      .select('title_en, excerpt_en, seo, image_url')
      .eq('slug', params.id)
      .eq('published', true)
      .maybeSingle();
    if (!data) return { title: 'Insight' };
    const d: any = data;
    const seo = d.seo || {};
    return {
      title: seo.meta_title_en ? { absolute: seo.meta_title_en } : d.title_en,
      description: seo.meta_description_en || d.excerpt_en,
      openGraph: { type: 'article', images: [seo.og_image || d.image_url].filter(Boolean) },
    };
  } catch {
    return { title: 'Insight' };
  }
}

export default function Page() {
  return <InsightDetail />;
}
