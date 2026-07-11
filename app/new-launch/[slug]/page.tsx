import NewLaunchDetail from '@/screens/NewLaunchDetail';
import { supabaseServer } from '@/integrations/supabase/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { data } = await supabaseServer()
      .from('developments')
      .select('name_en, tagline_en, seo, hero_image')
      .eq('slug', params.slug)
      .eq('published', true)
      .maybeSingle();
    if (!data) return { title: 'New Launch' };
    const d: any = data;
    const seo = d.seo || {};
    return {
      title: seo.meta_title_en ? { absolute: seo.meta_title_en } : d.name_en,
      description: seo.meta_description_en || d.tagline_en,
      openGraph: { images: [seo.og_image || d.hero_image].filter(Boolean) },
    };
  } catch {
    return { title: 'New Launch' };
  }
}

export default function Page() {
  return <NewLaunchDetail />;
}
