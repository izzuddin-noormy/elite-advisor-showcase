import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/lib/useSettings';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { DevelopmentRow } from '@/integrations/supabase/cms-types';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { getVideoEmbed } from '@/lib/video';
import { Loader2, MapPin, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';

const NewLaunchDetail = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const [d, setD] = useState<DevelopmentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('developments').select('*').eq('slug', slug).eq('published', true).maybeSingle();
      if (active) { setD(data as unknown as DevelopmentRow); setLoading(false); }
    })();
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="min-h-screen"><Navigation /><div className="flex items-center justify-center py-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div><Footer /></div>;
  if (!d) return <div className="min-h-screen"><Navigation /><div className="container mx-auto px-6 py-40 text-center"><h1 className="text-2xl font-serif text-primary">{t('notFound.message')}</h1></div><Footer /></div>;

  const name = pick(language, d.name_en, d.name_zh);
  const tagline = pick(language, d.tagline_en, d.tagline_zh);
  const loc = pick(language, d.location_en, d.location_zh);
  const status = pick(language, d.status_en, d.status_zh);
  const overview = pick(language, d.overview_en, d.overview_zh);
  const seo = d.seo || {};
  const gallery = d.gallery || [];
  const highlights = d.highlights || [];
  const specs = d.specs || [];
  const connectivity = d.connectivity || [];
  const video = getVideoEmbed(d.hero_video_url);
  const whatsapp = settings.whatsapp || '60168280399';

  const openLightbox = (i: number) => setLightbox(i);
  const nextImg = () => setLightbox((p) => (p === null ? p : (p + 1) % gallery.length));
  const prevImg = () => setLightbox((p) => (p === null ? p : (p - 1 + gallery.length) % gallery.length));

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={pick(language, seo.meta_title_en, seo.meta_title_zh) || `${name} | Mu SiChen`}
        description={pick(language, seo.meta_description_en, seo.meta_description_zh) || tagline}
        keywords={seo.keywords}
        ogImage={seo.og_image || d.hero_image || undefined}
        ogType="article"
        lang={language}
        jsonLd={[
          breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: t('nav.newLaunch'), url: '/new-launch' }, { name, url: `/new-launch/${d.slug}` }]),
          faqJsonLd(d.faqs || [], language),
        ]}
      />
      <Navigation />

      {/* HERO */}
      <section className="relative h-[88vh] min-h-[520px] w-full overflow-hidden">
        {video ? (
          video.type === 'file'
            ? <video src={video.src} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
            : <iframe src={video.src} title={name} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
        ) : (
          <img src={d.hero_image || '/placeholder.svg'} alt={name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pb-16 text-white">
          <span className="inline-block w-fit px-4 py-2 bg-gold text-primary text-xs font-body font-medium tracking-[0.2em] uppercase mb-6">{status}</span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light max-w-4xl leading-tight">{name}</h1>
          <p className="font-body text-lg md:text-xl font-light mt-4 max-w-2xl opacity-90">{tagline}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mt-6 font-body font-light">
            <span className="inline-flex items-center"><MapPin className="h-4 w-4 mr-2 text-gold" />{loc}</span>
            {d.price_from && <span className="text-gold font-serif text-2xl">{d.price_from}</span>}
          </div>
          <div className="mt-8">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center px-8 py-3 bg-gold text-primary hover:bg-gold-dark transition-colors font-body text-sm font-medium tracking-wide">
              {t('newLaunch.register')}
            </a>
          </div>
        </div>
      </section>

      {/* OVERVIEW + quick facts */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="section-heading text-primary mb-6">{t('newLaunch.overview')}</h2>
            <div className="prose prose-lg max-w-none font-body text-muted-foreground" dangerouslySetInnerHTML={{ __html: overview }} />
          </div>
          <div className="bg-secondary/40 rounded-lg p-8 h-fit space-y-4">
            <h3 className="font-serif text-xl text-primary mb-2">{t('newLaunch.factSheet')}</h3>
            {specs.map((s, i) => (
              <div key={i} className="flex justify-between border-b border-border pb-2 last:border-0">
                <span className="font-body text-sm text-muted-foreground">{pick(language, s.label_en, s.label_zh)}</span>
                <span className="font-body text-sm font-medium text-primary text-right">{pick(language, s.value_en, s.value_zh)}</span>
              </div>
            ))}
            {d.developer_en && (
              <div className="flex justify-between border-b border-border pb-2">
                <span className="font-body text-sm text-muted-foreground">{t('newLaunch.developer')}</span>
                <span className="font-body text-sm font-medium text-primary text-right">{pick(language, d.developer_en, d.developer_zh)}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      {highlights.length > 0 && (
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <h2 className="section-heading text-primary text-center mb-14">{t('newLaunch.highlights')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {highlights.map((h, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/15 flex items-center justify-center"><Check className="h-5 w-5 text-gold" /></div>
                  <h3 className="font-serif text-xl text-primary mb-2">{pick(language, h.title_en, h.title_zh)}</h3>
                  <p className="font-body text-sm text-muted-foreground font-light leading-relaxed">{pick(language, h.desc_en, h.desc_zh)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCATION & CONNECTIVITY */}
      {(connectivity.length > 0 || d.location_lat) && (
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-heading text-primary mb-6">{t('newLaunch.location')}</h2>
              <p className="font-body text-muted-foreground mb-6">{loc}</p>
              <ul className="space-y-3">
                {connectivity.map((c, i) => (
                  <li key={i} className="flex items-start font-body text-foreground/90"><MapPin className="h-4 w-4 mr-3 mt-1 text-gold shrink-0" />{pick(language, c.text_en, c.text_zh)}</li>
                ))}
              </ul>
            </div>
            {d.location_lat && d.location_lng && (
              <div className="rounded-lg overflow-hidden shadow-luxury h-80">
                <iframe title="map" className="w-full h-full" loading="lazy" src={`https://www.google.com/maps?q=${d.location_lat},${d.location_lng}&output=embed`} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* GALLERY (second-last section) */}
      {gallery.length > 0 && (
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-6">
            <h2 className="section-heading text-primary text-center mb-12">{t('newLaunch.gallery')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto">
              {gallery.map((url, i) => (
                <button key={i} onClick={() => openLightbox(i)} className="group relative overflow-hidden rounded-md aspect-[4/3]">
                  <img src={url} alt={`${name} ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA (last section) */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="section-heading text-primary mb-4">{t('newLaunch.registerTitle')}</h2>
          <p className="font-body text-muted-foreground mb-8">{t('newLaunch.registerSubtitle')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-body text-sm tracking-wide">{t('newLaunch.register')}</a>
            <Link to="/#contact" className="inline-flex items-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-body text-sm tracking-wide">{t('nav.contact')}</Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={lightbox !== null} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-screen-lg w-full h-screen bg-black/95 border-0 p-0 flex items-center justify-center [&>button]:hidden">
          {lightbox !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 z-50 h-11 w-11 rounded-full bg-black/50 text-white border border-white/30 flex items-center justify-center hover:bg-black/70"><X className="h-6 w-6" /></button>
              {gallery.length > 1 && <button onClick={prevImg} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-black/50 text-white border border-white/30 flex items-center justify-center hover:bg-black/70"><ChevronLeft className="h-7 w-7" /></button>}
              <img src={gallery[lightbox]} alt="" className="max-w-full max-h-full object-contain" />
              {gallery.length > 1 && <button onClick={nextImg} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-black/50 text-white border border-white/30 flex items-center justify-center hover:bg-black/70"><ChevronRight className="h-7 w-7" /></button>}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">{lightbox + 1} / {gallery.length}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default NewLaunchDetail;
