import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { PageRow } from '@/integrations/supabase/cms-types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import Brand from '@/components/Brand';

const Footer = () => {
  const { t, language } = useLanguage();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [page, setPage] = useState<PageRow | null>(null);
  const [loading, setLoading] = useState(false);

  const openLegal = async (slug: string) => {
    setOpenSlug(slug);
    setPage(null);
    setLoading(true);
    const { data } = await supabase.from('pages').select('*').eq('slug', slug).maybeSingle();
    setPage(data as unknown as PageRow);
    setLoading(false);
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Brand size="lg" />
            </div>
            <p className="font-body text-sm font-light text-primary-foreground/80 leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-body text-sm font-medium text-primary-foreground mb-4 tracking-wide">
              {t('footer.quickLinks')}
            </h3>
            <nav className="space-y-2">
              <a href="/" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">{t('nav.home')}</a>
              <a href="/#about" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">{t('nav.about')}</a>
              <a href="/properties" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">{t('nav.properties')}</a>
              <a href="/insights" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">{t('nav.insights')}</a>
              <a href="/#contact" className="block font-body text-sm font-light text-primary-foreground/80 hover:text-gold transition-colors duration-300">{t('nav.contact')}</a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-body text-sm font-medium text-primary-foreground mb-4 tracking-wide">
              {t('footer.contact')}
            </h3>
            <div className="space-y-2">
              <p className="font-body text-sm font-light text-primary-foreground/80">+(60) 16-828-0399</p>
              <p className="font-body text-sm font-light text-primary-foreground/80">musichen@propnex.com.my</p>
              <p className="font-body text-sm font-light text-primary-foreground/80">
                A-G-03 Marc Service Residence<br />
                No 3, Jalan Pinang<br />
                50450 Federal Territory of Kuala Lumpur<br />
                Malaysia
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-body text-xs font-light text-primary-foreground/60">
            {t('footer.copyright').replace(/\d{4}/, String(new Date().getFullYear()))}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => openLegal('privacy-policy')} className="font-body text-xs font-light text-primary-foreground/60 hover:text-gold transition-colors duration-300">
              {t('footer.privacy')}
            </button>
            <button onClick={() => openLegal('terms-of-service')} className="font-body text-xs font-light text-primary-foreground/60 hover:text-gold transition-colors duration-300">
              {t('footer.terms')}
            </button>
          </div>
        </div>
      </div>

      <Dialog open={openSlug !== null} onOpenChange={(o) => { if (!o) setOpenSlug(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {page ? pick(language, page.title_en, page.title_zh) : (openSlug === 'privacy-policy' ? t('footer.privacy') : t('footer.terms'))}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto pr-2">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : page ? (
              <div
                className="prose prose-sm max-w-none text-muted-foreground [&_h3]:text-foreground [&_h3]:font-serif [&_h3]:mt-5 [&_strong]:text-foreground [&_a]:text-primary"
                dangerouslySetInnerHTML={{ __html: pick(language, page.content_en, page.content_zh) }}
              />
            ) : (
              <p className="text-muted-foreground py-8 text-center">—</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
