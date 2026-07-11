'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Seo from '@/components/Seo';
import LanguageSwitch from '@/components/LanguageSwitch';
import Brand from '@/components/Brand';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/lib/useSettings';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { DevelopmentRow } from '@/integrations/supabase/cms-types';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { track } from '@/lib/analytics';
import { Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';

const stripHtml = (html?: string | null) => (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const firstSentence = (s?: string | null) => { const t = stripHtml(s); const m = t.match(/^[\s\S]*?[.。]/); return (m ? m[0] : t).trim(); };

// Cinematic background stills carried over from the Aurelia cinematic template
const CINE_BG = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2400&auto=format&fit=crop',
];

type Panel =
  | { type: 'hero'; video?: string | null; img?: string | null; eyebrow: string; title: string; text: string; price?: string | null }
  | { type: 'text'; video?: string | null; img?: string | null; eyebrow: string; title: string; text: string; specs?: { label: string; value: string }[]; center?: boolean }
  | { type: 'location'; img?: string | null; eyebrow: string; title: string; items: string[]; lat?: number | null; lng?: number | null }
  | { type: 'floorplans'; eyebrow: string; title: string; plans: import('@/integrations/supabase/cms-types').DevFloorplan[] }
  | { type: 'plan'; eyebrow: string; title: string; text: string }
  | { type: 'gallery'; eyebrow: string; title: string; images: string[] }
  | { type: 'contact'; img?: string | null; eyebrow: string; title: string; text: string };

const NewLaunchDetail = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const [d, setD] = useState<DevelopmentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('developments').select('*').eq('slug', slug).eq('published', true).maybeSingle();
      if (on) { setD(data as unknown as DevelopmentRow); setLoading(false); }
    })();
    return () => { on = false; };
  }, [slug]);

  // Keyboard navigation for the gallery lightbox (← / → / Esc)
  useEffect(() => {
    if (lightbox === null) return;
    const len = d?.gallery?.length || 0;
    if (!len) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightbox((v) => (v === null ? v : (v + 1) % len));
      else if (e.key === 'ArrowLeft') setLightbox((v) => (v === null ? v : (v - 1 + len) % len));
      else if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, d]);

  // Build panels from CMS data
  const buildPanels = (): Panel[] => {
    if (!d) return [];
    const name = pick(language, d.name_en, d.name_zh);
    const tagline = pick(language, d.tagline_en, d.tagline_zh);
    const loc = pick(language, d.location_en, d.location_zh);
    const status = pick(language, d.status_en, d.status_zh);
    const gallery = d.gallery || [];
    const g = (i: number) => gallery.length ? gallery[i % gallery.length] : d.hero_image;
    const specs = (d.specs || []).map((s) => ({ label: pick(language, s.label_en, s.label_zh), value: pick(language, s.value_en, s.value_zh) }));
    const highlights = d.highlights || [];
    const connectivity = (d.connectivity || []).map((c) => pick(language, c.text_en, c.text_zh)).filter(Boolean);

    // Cinematic background stills (from the Aurelia cinematic template)
    const bg = (i: number) => CINE_BG[i % CINE_BG.length];
    const overviewLead = firstSentence(pick(language, d.overview_en, d.overview_zh));

    const panels: Panel[] = [];
    panels.push({ type: 'hero', video: d.hero_video_url, img: d.hero_image, eyebrow: `${status} · ${loc}`, title: name, text: tagline, price: d.price_from });
    // 02 — Overview (minimal: short heading + one-line lead)
    panels.push({ type: 'text', img: bg(0), eyebrow: `— ${t('newLaunch.overview')}`, title: tagline || name, text: overviewLead, specs: specs.slice(0, 3) });
    // 03–06 — Highlights (panel 4 uses the uploaded showcase video)
    highlights.forEach((h, i) => {
      panels.push({
        type: 'text',
        img: bg(i + 1),
        video: i === 1 ? '/videos/hp-041426.mp4' : undefined,
        eyebrow: `0${i + 1} — ${pick(language, h.title_en, h.title_zh)}`,
        title: pick(language, h.title_en, h.title_zh),
        text: pick(language, h.desc_en, h.desc_zh),
      });
    });
    // 07 — Prime Location (with map)
    if (connectivity.length) panels.push({ type: 'location', img: bg(5), eyebrow: `— ${t('newLaunch.location')}`, title: loc, items: connectivity, lat: d.location_lat, lng: d.location_lng });
    // 08 — Floor Plans
    const plans = d.floorplans || [];
    if (plans.length) panels.push({ type: 'floorplans', eyebrow: `— ${t('newLaunch.floorplans')}`, title: t('newLaunch.floorplansTitle'), plans });
    // 09 — Gallery
    if (gallery.length) panels.push({ type: 'gallery', eyebrow: `— ${t('newLaunch.gallery')}`, title: t('newLaunch.gallery'), images: gallery });
    // 10 — Contact
    panels.push({ type: 'contact', img: bg(4), eyebrow: t('newLaunch.register'), title: t('newLaunch.registerTitle'), text: t('newLaunch.registerSubtitle') });
    return panels;
  };
  const panels = buildPanels();

  // Cinematic engine: media loader, in-view reveals, parallax, mouse, cursor, blueprint self-draw
  useEffect(() => {
    if (!d || !rootRef.current || !mainRef.current) return;
    const root = rootRef.current;
    const main = mainRef.current;
    const panelEls = [...root.querySelectorAll<HTMLElement>('.cine-panel')];
    const fine = window.matchMedia('(pointer:fine)').matches;

    // 1) media loader (video with Ken Burns image fallback)
    panelEls.forEach((panel) => {
      const holder = panel.querySelector<HTMLElement>('.cine-media');
      if (!holder) return;
      const vSrc = panel.dataset.video;
      const iSrc = panel.dataset.img;
      const useImage = () => {
        holder.innerHTML = '';
        if (!iSrc) return;
        const kb = document.createElement('div');
        kb.className = 'cine-kenburns';
        kb.style.backgroundImage = `url('${iSrc}')`;
        holder.appendChild(kb);
      };
      if (vSrc) {
        const v = document.createElement('video');
        v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
        v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
        v.preload = 'metadata'; v.src = vSrc; if (iSrc) v.poster = iSrc;
        v.addEventListener('error', useImage);
        const to = setTimeout(() => { if (v.readyState < 2) useImage(); }, 6000);
        v.addEventListener('canplay', () => clearTimeout(to));
        holder.appendChild(v);
      } else { useImage(); }
    });

    // 2) intersection observer → reveals, active index, video play/pause
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const idx = panelEls.indexOf(en.target as HTMLElement);
        const vid = (en.target as HTMLElement).querySelector('video');
        if (en.isIntersecting && en.intersectionRatio > 0.55) {
          (en.target as HTMLElement).classList.add('inview');
          setActive(idx);
          track('panel_view', { index: idx + 1, dev: slug });
          if (vid) vid.play().catch(() => {});
        } else if (en.intersectionRatio < 0.15) {
          if (vid) vid.pause();
        }
      });
    }, { root: main, threshold: [0.15, 0.55] });
    panelEls.forEach((p) => io.observe(p));

    // 3) parallax paint
    let ticking = false;
    const paint = () => {
      ticking = false;
      const vh = window.innerHeight;
      panelEls.forEach((p) => {
        const r = p.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const prog = (vh - r.top) / (vh + r.height);
        const c = prog - 0.5;
        const media = p.querySelector<HTMLElement>('.cine-media');
        const cap = p.querySelector<HTMLElement>('.cine-caption');
        if (media) media.style.transform = `translate3d(0, ${c * -9}%, 0) scale(${1.08 + Math.abs(c) * 0.1}) rotateX(${c * -3}deg)`;
        if (cap) cap.style.transform = `translate3d(0, ${c * 26}px, 0) rotateX(${c * 5}deg)`;
        const bp = p.querySelector<HTMLElement>('.bp-stage');
        if (bp) { const tilt = Math.max(0, -c * 130); bp.style.transform = `rotateX(${tilt}deg) translateY(${c * -6}%) scale(${1 - Math.abs(c) * 0.12})`; }
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    main.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', paint);
    paint();

    // 4) mouse parallax + 6) custom cursor
    let mx = 0, my = 0, tx = 0, ty = 0, raf1 = 0, raf2 = 0;
    let arrow: HTMLElement | null = null, liquid: HTMLElement | null = null;
    const onMove = (e: MouseEvent) => { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; };
    if (fine) {
      window.addEventListener('mousemove', onMove, { passive: true });
      const loop = () => {
        mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
        const act = panelEls.find((p) => { const r = p.getBoundingClientRect(); return r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5; });
        if (act) {
          const inner = act.querySelector<HTMLElement>('.cine-media video, .cine-media .cine-kenburns, .bp-svg');
          if (inner) inner.style.transform = `translate3d(${mx * -22}px, ${my * -14}px, 0) scale(1.06) rotateY(${mx * 2.4}deg) rotateX(${my * -1.6}deg)`;
        }
        raf1 = requestAnimationFrame(loop);
      };
      raf1 = requestAnimationFrame(loop);

      arrow = document.createElement('div'); arrow.className = 'cine-cursor-arrow';
      arrow.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 2.5l14.5 8.2-6.4 1.6-3.2 7.2z" fill="#fff" stroke="#0c0b09" stroke-width="1.3" stroke-linejoin="round"/></svg>';
      liquid = document.createElement('div'); liquid.className = 'cine-cursor-liquid';
      root.append(liquid, arrow);
      let cx = innerWidth / 2, cy = innerHeight / 2, lx = cx, ly = cy;
      const onMove2 = (e: MouseEvent) => { cx = e.clientX; cy = e.clientY; if (arrow) arrow.style.transform = `translate(${cx}px,${cy}px)`; };
      window.addEventListener('mousemove', onMove2, { passive: true });
      const cloop = () => {
        const dx = cx - lx, dy = cy - ly;
        lx += dx * 0.2; ly += dy * 0.2;
        const speed = Math.min(Math.hypot(dx, dy), 90);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        const s = speed / 90;
        if (liquid) liquid.style.transform = `translate(${lx}px,${ly}px) translate(-50%,-50%) rotate(${ang}deg) scale(${1 + s * 0.9}, ${1 - s * 0.5})`;
        raf2 = requestAnimationFrame(cloop);
      };
      raf2 = requestAnimationFrame(cloop);
      (window as any).__cineMove2 = onMove2;
    }

    // 5) blueprint self-drawing
    root.querySelectorAll<SVGGeometryElement>('.bp-svg .draw').forEach((el, i) => {
      let len = 300; try { len = (el as any).getTotalLength() + 2; } catch { /* noop */ }
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      el.style.transition = `stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1) ${0.15 + i * 0.05}s`;
    });

    return () => {
      io.disconnect();
      main.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', paint);
      window.removeEventListener('mousemove', onMove);
      if ((window as any).__cineMove2) window.removeEventListener('mousemove', (window as any).__cineMove2);
      cancelAnimationFrame(raf1); cancelAnimationFrame(raf2);
      arrow?.remove(); liquid?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, language]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0c0b09]"><Loader2 className="h-8 w-8 animate-spin text-[#c9a96a]" /></div>;
  if (!d) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0b09] text-[#f3efe7]"><p className="mb-4">{t('notFound.message')}</p><Link href="/new-launch" className="text-[#c9a96a]">← {t('nav.newLaunch')}</Link></div>;

  const name = pick(language, d.name_en, d.name_zh);
  const seo = d.seo || {};
  const whatsapp = settings.whatsapp || '60168280399';

  return (
    <div className="cine" ref={rootRef}>
      <Seo
        title={pick(language, seo.meta_title_en, seo.meta_title_zh) || `${name} | Mu SiChen`}
        description={pick(language, seo.meta_description_en, seo.meta_description_zh) || pick(language, d.tagline_en, d.tagline_zh)}
        keywords={seo.keywords} ogImage={seo.og_image || d.hero_image || undefined} ogType="article" lang={language}
        jsonLd={[breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: t('nav.newLaunch'), url: '/new-launch' }, { name, url: `/new-launch/${d.slug}` }]), faqJsonLd(d.faqs || [], language)]}
      />

      <style>{CINE_CSS}</style>

      <header className="cine-header">
        <div className="cine-header-left">
          <Link href="/" aria-label="Mu SiChen Estates & Co. — Home"><Brand size="sm" /></Link>
          <Link href="/" className="cine-menu cine-return">← {t('newLaunch.returnHome')}</Link>
        </div>
        <div className="cine-header-right">
          <LanguageSwitch />
          <a className="cine-menu" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" onClick={() => track('cta_click', { cta: 'register', location: 'header', dev: d.slug })}>{t('newLaunch.register')}</a>
        </div>
      </header>

      <nav className="cine-dots">
        {panels.map((_, i) => (
          <button key={i} aria-label={`Section ${i + 1}`} className={i === active ? 'on' : ''} onClick={() => mainRef.current?.querySelectorAll('.cine-panel')[i]?.scrollIntoView({ behavior: 'smooth' })} />
        ))}
      </nav>
      <div className="cine-counter"><b>{String(active + 1).padStart(2, '0')}</b> / {String(panels.length).padStart(2, '0')}</div>
      <div className="cine-grain" />

      <main className="cine-main" ref={mainRef}>
        {panels.map((p, i) => {
          if (p.type === 'gallery') {
            return (
              <section key={i} className="cine-panel cine-gallery-panel">
                <div className="cine-caption">
                  <div className="eyebrow">{p.eyebrow}</div>
                  <h2>{p.title}</h2>
                </div>
                <div className="cine-grid">
                  {p.images.map((url, gi) => (
                    <button key={gi} className="cine-grid-item" onClick={() => { track('gallery_open', { dev: d.slug, index: gi + 1 }); setLightbox(gi); }}>
                      <img src={url} alt={`${name} ${gi + 1}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              </section>
            );
          }
          if (p.type === 'plan') {
            return (
              <section key={i} className="cine-panel blueprint">
                <div className="bp-stage">{BLUEPRINT_SVG}</div>
                <div className="cine-caption">
                  <div className="eyebrow rv">{p.eyebrow}</div>
                  <h2 className="rv">{p.title}</h2>
                  <p className="rv">{p.text}</p>
                </div>
              </section>
            );
          }
          if (p.type === 'location') {
            return (
              <section key={i} className="cine-panel cine-location-panel" data-img={p.img || undefined}>
                <div className="cine-media" />
                <div className="cine-veil" />
                <div className="cine-loc-inner">
                  <div className="cine-caption">
                    <div className="eyebrow rv">{p.eyebrow}</div>
                    <h2 className="rv">{p.title}</h2>
                    <div className="cine-prox rv">
                      {p.items.map((it, ii) => (<div key={ii}>{it}</div>))}
                    </div>
                  </div>
                  {p.lat && p.lng && (
                    <div className="cine-map rv">
                      <iframe title="map" loading="lazy" src={`https://www.google.com/maps?q=${p.lat},${p.lng}&z=15&output=embed`} />
                    </div>
                  )}
                </div>
              </section>
            );
          }
          if (p.type === 'floorplans') {
            return (
              <section key={i} className="cine-panel cine-floorplans-panel">
                <div className="cine-caption">
                  <div className="eyebrow">{p.eyebrow}</div>
                  <h2>{p.title}</h2>
                </div>
                <div className="cine-fp-grid">
                  {p.plans.map((pl, pi) => (
                    <div key={pi} className="cine-fp-card">
                      <div className="cine-fp-visual">{pl.image ? <img src={pl.image} alt={pick(language, pl.label_en, pl.label_zh)} /> : FP_PLAN}</div>
                      <h3>{pick(language, pl.label_en, pl.label_zh)}</h3>
                      <div className="cine-fp-meta"><span>{pick(language, pl.spec_en, pl.spec_zh)}</span><span>{pl.size}</span></div>
                      {pl.price && <div className="cine-fp-price">{pl.price}</div>}
                    </div>
                  ))}
                </div>
              </section>
            );
          }
          const isHero = p.type === 'hero';
          return (
            <section key={i} className={`cine-panel${isHero ? ' cine-hero' : ''}`} data-video={(p as any).video || undefined} data-img={(p as any).img || undefined}>
              <div className="cine-media" />
              <div className="cine-veil" />
              <div className="cine-caption">
                <div className="eyebrow rv">{p.eyebrow}</div>
                {isHero ? <h1 className="rv">{p.title}</h1> : <h2 className="rv">{p.title}</h2>}
                {'text' in p && p.text && <p className="rv">{p.text}</p>}
                {p.type === 'hero' && p.price && <div className="cine-price rv">{p.price}</div>}
                {p.type === 'text' && p.specs && p.specs.length > 0 && (
                  <div className="specline rv">{p.specs.map((s, si) => (<div key={si}><b>{s.value}</b>{s.label}</div>))}</div>
                )}
                {p.type === 'location' && (
                  <ul className="cine-conn rv">{p.items.map((it, ii) => (<li key={ii}>{it}</li>))}</ul>
                )}
                {p.type === 'contact' && (
                  <div className="cta-row rv">
                    <a className="btn gold" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" onClick={() => track('cta_click', { cta: 'register', location: 'cta_panel', dev: d.slug })}>{t('newLaunch.register')}</a>
                    <button className="btn ghost" onClick={() => mainRef.current?.querySelector('.cine-panel')?.scrollIntoView({ behavior: 'smooth' })}>↑</button>
                  </div>
                )}
              </div>
              {isHero && <div className="cine-scrollcue">Scroll</div>}
            </section>
          );
        })}
      </main>

      {lightbox !== null && d.gallery && (
        <div className="cine-lightbox" onClick={() => setLightbox(null)}>
          <button className="cine-lb-btn" style={{ top: 20, right: 20 }} onClick={(e) => { e.stopPropagation(); setLightbox(null); }}><X /></button>
          {d.gallery.length > 1 && <button className="cine-lb-btn" style={{ left: 20, top: '50%' }} onClick={(e) => { e.stopPropagation(); setLightbox((v) => v === null ? v : (v - 1 + d.gallery!.length) % d.gallery!.length); }}><ChevronLeft /></button>}
          <img src={d.gallery[lightbox]} alt="" onClick={(e) => e.stopPropagation()} />
          {d.gallery.length > 1 && <button className="cine-lb-btn" style={{ right: 20, top: '50%' }} onClick={(e) => { e.stopPropagation(); setLightbox((v) => v === null ? v : (v + 1) % d.gallery!.length); }}><ChevronRight /></button>}
        </div>
      )}
    </div>
  );
};

/* The self-drawing floor-plan SVG (from the Aurelia cinematic template). */
const BLUEPRINT_SVG = (
  <svg className="bp-svg" viewBox="0 0 760 520" xmlns="http://www.w3.org/2000/svg" aria-label="Floor plan">
    <g className="thin" opacity=".16">
      <line className="draw" x1="40" y1="130" x2="720" y2="130" /><line className="draw" x1="40" y1="230" x2="720" y2="230" /><line className="draw" x1="40" y1="330" x2="720" y2="330" />
      <line className="draw" x1="140" y1="40" x2="140" y2="480" /><line className="draw" x1="240" y1="40" x2="240" y2="480" /><line className="draw" x1="340" y1="40" x2="340" y2="480" /><line className="draw" x1="540" y1="40" x2="540" y2="480" /><line className="draw" x1="640" y1="40" x2="640" y2="480" />
    </g>
    <rect className="ln draw" x="40" y="40" width="680" height="440" /><rect className="thin draw" x="48" y="48" width="664" height="424" />
    <line className="ln draw" x1="430" y1="40" x2="430" y2="180" /><line className="ln draw" x1="430" y1="250" x2="430" y2="480" /><line className="ln draw" x1="430" y1="300" x2="560" y2="300" /><line className="ln draw" x1="620" y1="300" x2="720" y2="300" />
    <path className="ln red draw" d="M150,478 A70,70 0 0 0 82,410" /><line className="ln red draw" x1="82" y1="410" x2="82" y2="478" />
    <rect className="ln draw" x="450" y="56" width="254" height="34" /><rect className="ln draw" x="670" y="100" width="34" height="110" /><rect className="ln draw" x="480" y="160" width="120" height="56" /><line className="thin draw" x1="480" y1="188" x2="600" y2="188" />
    <circle className="ln draw" cx="250" cy="150" r="34" /><circle className="thin draw" cx="250" cy="103" r="9" /><circle className="thin draw" cx="250" cy="197" r="9" /><circle className="thin draw" cx="203" cy="150" r="9" /><circle className="thin draw" cx="297" cy="150" r="9" />
    <rect className="ln draw" x="90" y="290" width="180" height="58" /><rect className="thin draw" x="300" y="298" width="52" height="42" />
    <rect className="ln draw" x="470" y="330" width="150" height="110" /><rect className="thin draw" x="482" y="342" width="40" height="26" /><rect className="thin draw" x="530" y="342" width="40" height="26" />
    <text x="155" y="252">LIVING</text><text x="510" y="130">KITCHEN</text><text x="500" y="400">BEDROOM</text><text x="98" y="500" className="redtxt">ENTRANCE</text>
  </svg>
);

/* A small static plan schematic used on floor-plan cards. */
const FP_PLAN = (
  <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" className="fp-plan" aria-hidden="true">
    <g fill="none" stroke="#c9a96a" strokeWidth="1.2" strokeLinecap="round" opacity="0.75">
      <rect x="6" y="6" width="108" height="78" />
      <line x1="70" y1="6" x2="70" y2="50" />
      <line x1="70" y1="50" x2="114" y2="50" />
      <line x1="6" y1="55" x2="70" y2="55" />
      <rect x="14" y="14" width="34" height="24" />
      <circle cx="90" cy="28" r="10" />
      <rect x="80" y="60" width="26" height="18" />
    </g>
  </svg>
);

const CINE_CSS = `
.cine{--ivory:#f3efe7;--ivory-dim:rgba(243,239,231,.62);--gold:#c9a96a;--ink:#0c0b09;--cserif:'Playfair Display',Georgia,serif;--csans:'Inter',system-ui,sans-serif;background:var(--ink);color:var(--ivory);font-family:var(--csans);position:fixed;inset:0;z-index:0;overflow:hidden}
@media (pointer:fine){.cine,.cine a,.cine button{cursor:none}}
.cine ::selection{background:var(--gold);color:var(--ink)}
.cine-main{height:100dvh;overflow-y:auto;scroll-snap-type:y mandatory;perspective:1200px;scroll-behavior:smooth}
.cine-panel{position:relative;height:100dvh;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden;display:flex;align-items:flex-end}
.cine-media{position:absolute;inset:-6%;z-index:0;will-change:transform;transform-style:preserve-3d}
.cine-media video,.cine-media .cine-kenburns{width:100%;height:100%;object-fit:cover;display:block}
.cine-kenburns{background-size:cover;background-position:center;animation:cinekb 26s ease-in-out infinite alternate}
@keyframes cinekb{from{transform:scale(1.02) translate3d(0,0,0)}to{transform:scale(1.14) translate3d(-1.5%,1.5%,0)}}
.cine-veil{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(12,11,9,.55) 0%,rgba(12,11,9,0) 28%,rgba(12,11,9,0) 55%,rgba(12,11,9,.78) 100%)}
.cine-grain{position:absolute;inset:0;z-index:40;pointer-events:none;opacity:.05;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E")}
.cine-caption{position:relative;z-index:2;padding:0 clamp(1.4rem,6vw,7rem) clamp(3.2rem,8vh,6.5rem);max-width:880px;will-change:transform,opacity;transform-style:preserve-3d}
.cine-caption::before{content:"";position:absolute;z-index:-1;pointer-events:none;inset:-11rem -14rem -9rem -14rem;background:radial-gradient(ellipse closest-side at 40% 58%,rgba(12,11,9,.9) 0%,rgba(12,11,9,.64) 58%,rgba(12,11,9,0) 100%)}
.cine-hero .cine-caption::before{inset:-13rem -16rem;background:radial-gradient(ellipse closest-side at 50% 50%,rgba(12,11,9,.88) 0%,rgba(12,11,9,.58) 60%,rgba(12,11,9,0) 100%)}
.cine .eyebrow{font-family:var(--csans);font-size:.66rem;letter-spacing:.42em;text-transform:uppercase;color:var(--gold);margin-bottom:1.1rem;display:flex;align-items:center;gap:.9rem}
.cine h1,.cine h2{font-family:var(--cserif);font-weight:300;font-size:clamp(2.6rem,6.5vw,5.4rem);line-height:1.02;letter-spacing:.01em;color:var(--ivory)}
.cine-caption p{margin-top:1.2rem;max-width:46ch;font-weight:300;font-size:clamp(.86rem,1.15vw,1rem);line-height:1.75;color:var(--ivory-dim)}
.cine-price{margin-top:1.4rem;font-family:var(--cserif);font-size:1.9rem;color:var(--gold)}
.specline{display:flex;gap:clamp(1.2rem,3vw,3rem);margin-top:1.8rem;flex-wrap:wrap}
.specline div{font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ivory-dim)}
.specline b{display:block;font-family:var(--cserif);font-size:1.7rem;font-weight:400;color:var(--ivory);letter-spacing:0;text-transform:none;margin-bottom:.25rem}
.cine-conn{margin-top:1.6rem;list-style:none;display:flex;flex-direction:column;gap:.7rem}
.cine-conn li{padding-left:1.4rem;position:relative;color:var(--ivory-dim);font-weight:300}
.cine-conn li::before{content:"";position:absolute;left:0;top:.55em;width:8px;height:8px;border-radius:50%;background:var(--gold)}
.cine .rv{opacity:0;transform:translateY(46px);transition:opacity 1s cubic-bezier(.2,.65,.2,1),transform 1s cubic-bezier(.2,.65,.2,1)}
.cine .inview .rv{opacity:1;transform:translateY(0)}
.cine .inview .rv:nth-child(2){transition-delay:.12s}.cine .inview .rv:nth-child(3){transition-delay:.24s}.cine .inview .rv:nth-child(4){transition-delay:.36s}
.cine-header{position:absolute;top:0;left:0;right:0;z-index:50;display:flex;justify-content:space-between;align-items:center;padding:1.5rem clamp(1.4rem,4vw,3.4rem)}
.cine-logo{font-family:var(--cserif);font-size:1.6rem;font-weight:500;letter-spacing:0;text-transform:none;text-decoration:none;line-height:1}
.cine-logo-mu{color:#fff}
.cine-logo-sc{color:var(--gold);margin-left:.3rem}
.cine-header-right{display:flex;align-items:center;gap:1rem}
.cine-menu{font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.4);padding:.6rem 1.2rem;border-radius:99px}
.cine-menu:hover{border-color:var(--gold);color:var(--gold)}
.cine-dots{position:absolute;right:clamp(.9rem,2.4vw,2.2rem);top:50%;transform:translateY(-50%);z-index:50;display:flex;flex-direction:column;gap:.85rem}
.cine-dots button{width:8px;height:8px;border-radius:50%;background:rgba(243,239,231,.28);transition:all .4s ease;display:block;border:0;padding:0}
.cine-dots button.on{background:var(--gold);transform:scale(1.5)}
.cine-counter{position:absolute;left:clamp(1.4rem,4vw,3.4rem);bottom:2rem;z-index:50;font-family:var(--cserif);font-size:.95rem;color:var(--ivory-dim);letter-spacing:.15em}
.cine-counter b{color:var(--ivory);font-weight:400;font-size:1.5rem}
.cine-scrollcue{position:absolute;left:50%;bottom:2.2rem;transform:translateX(-50%);z-index:3;font-size:.62rem;letter-spacing:.4em;text-transform:uppercase;color:var(--ivory-dim);display:flex;flex-direction:column;align-items:center;gap:.7rem}
.cine-scrollcue::after{content:"";width:1px;height:52px;background:linear-gradient(180deg,var(--gold),transparent);animation:cinedrip 2.2s ease-in-out infinite}
@keyframes cinedrip{0%{transform:scaleY(0);transform-origin:top}55%{transform:scaleY(1);transform-origin:top}56%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
.cine-hero{align-items:center;justify-content:center;text-align:center}
.cine-hero .cine-caption{padding-bottom:0;max-width:1000px}
.cine-hero .cine-caption p{margin-inline:auto}
.cine-hero .cine-price{text-align:center}
.cine-hero .eyebrow{justify-content:center}
.cta-row{margin-top:2.2rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center}
.cine .btn{font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;text-decoration:none;padding:1.05rem 2.3rem;border-radius:99px;transition:all .35s ease;border:0}
.cine .btn.gold{background:var(--gold);color:var(--ink)}
.cine .btn.gold:hover{background:var(--ivory)}
.cine .btn.ghost{border:1px solid rgba(243,239,231,.35);color:var(--ivory);background:transparent;padding:1.05rem 1.4rem}
.cine .btn.ghost:hover{border-color:var(--gold);color:var(--gold)}
.blueprint{background:#050505;perspective:1100px}
.bp-stage{position:absolute;inset:0;z-index:1;display:flex;align-items:center;justify-content:center;padding:4vh 4vw 16vh;will-change:transform;transform-style:preserve-3d;transform-origin:50% 60%}
.bp-svg{width:min(80vw,880px);height:auto;overflow:visible;will-change:transform}
.bp-svg .ln{stroke:rgba(243,239,231,.92);stroke-width:1.3;fill:none;stroke-linecap:round}
.bp-svg .thin{stroke:rgba(243,239,231,.4);stroke-width:.7;fill:none;stroke-linecap:round}
.bp-svg .red{stroke:#c9473a}
.bp-svg text{fill:rgba(243,239,231,.55);font-family:var(--csans);font-size:9.5px;letter-spacing:.24em;opacity:0;transition:opacity 1.2s ease 1.6s}
.bp-svg text.redtxt{fill:#c9473a}
.blueprint.inview .bp-svg text{opacity:1}
.blueprint.inview .bp-svg .draw{stroke-dashoffset:0 !important}
.blueprint .cine-caption{max-width:1100px}
.blueprint h2{font-size:clamp(3.4rem,9vw,7.5rem);mix-blend-mode:screen}
.cine-gallery-panel{background:#070706;flex-direction:column;justify-content:flex-start;align-items:stretch;padding:12vh clamp(1.4rem,6vw,6rem) 6vh;height:100dvh}
.cine-gallery-panel .cine-caption{padding:0 0 1.5rem;max-width:none;flex:0 0 auto}
.cine-grid{flex:1 1 auto;min-height:0;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;align-content:start}
.cine-grid-item{border:0;padding:0;overflow:hidden;background:#111;aspect-ratio:4/3;border-radius:2px}
.cine-grid-item img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}
.cine-grid-item:hover img{transform:scale(1.06)}
@media (max-width:640px){.cine-dots{display:none}.specline{gap:1.1rem}.cine-grid{grid-template-columns:repeat(2,1fr)}}
.cine-cursor-arrow,.cine-cursor-liquid{position:fixed;top:0;left:0;pointer-events:none;will-change:transform}
.cine-cursor-arrow{z-index:9999;filter:drop-shadow(0 2px 5px rgba(0,0,0,.55))}
.cine-cursor-liquid{z-index:9998;width:48px;height:48px;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(201,169,106,.6) 0%,rgba(201,169,106,.28) 42%,rgba(201,169,106,0) 72%);filter:blur(6px)}
@media (pointer:coarse){.cine-cursor-arrow,.cine-cursor-liquid{display:none}}
/* location panel */
.cine-location-panel{align-items:center}
.cine-loc-inner{position:relative;z-index:2;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.5rem,4vw,4rem);align-items:center;padding:0 clamp(1.4rem,6vw,7rem)}
.cine-location-panel .cine-caption{padding:0;max-width:none}
.cine-location-panel .cine-caption::before{inset:-6rem -8rem}
.cine-prox{margin-top:1.6rem;display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
.cine-prox div{border:1px solid rgba(201,169,106,.35);padding:.85rem 1rem;font-size:.8rem;color:var(--ivory-dim);letter-spacing:.03em;background:rgba(12,11,9,.35)}
.cine-map{height:60vh;border-radius:4px;overflow:hidden;box-shadow:0 20px 45px rgba(0,0,0,.55)}
.cine-map iframe{width:100%;height:100%;border:0;filter:grayscale(.35) contrast(1.05) brightness(.95)}
@media (max-width:900px){.cine-loc-inner{grid-template-columns:1fr;gap:1.2rem}.cine-map{height:34vh}}
/* floor plans panel */
.cine-floorplans-panel{background:#070706;flex-direction:column;justify-content:flex-start;align-items:stretch;padding:12vh clamp(1.4rem,6vw,6rem) 6vh;height:100dvh}
.cine-floorplans-panel .cine-caption{padding:0 0 1.5rem;max-width:none;flex:0 0 auto}
.cine-fp-grid{flex:1 1 auto;min-height:0;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;align-content:start}
.cine-fp-card{border:1px solid rgba(243,239,231,.14);background:rgba(255,255,255,.02);padding:1.2rem;display:flex;flex-direction:column;gap:.4rem;transition:border-color .3s}
.cine-fp-card:hover{border-color:var(--gold)}
.cine-fp-visual{height:120px;display:flex;align-items:center;justify-content:center;opacity:.85;margin-bottom:.4rem}
.cine-fp-visual svg{width:auto;height:100%}
.cine-fp-visual img{width:100%;height:100%;object-fit:contain}
.cine-fp-card h3{font-family:var(--cserif);font-size:1.25rem;color:var(--ivory);font-weight:400}
.cine-fp-meta span{display:inline-block;margin-right:1rem;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ivory-dim)}
.cine-fp-price{margin-top:.3rem;color:var(--gold);font-family:var(--cserif);font-size:1.15rem}
.cine-lightbox{position:fixed;inset:0;z-index:80;background:rgba(4,4,4,.96);display:flex;align-items:center;justify-content:center}
.cine-lightbox img{max-width:92vw;max-height:88vh;object-fit:contain}
.cine-lb-btn{position:absolute;transform:translateY(-50%);height:46px;width:46px;border-radius:50%;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.3);color:#fff;display:flex;align-items:center;justify-content:center}
@media (prefers-reduced-motion:reduce){.cine-kenburns{animation:none}.cine .rv{transition:none}}
`;

export default NewLaunchDetail;
