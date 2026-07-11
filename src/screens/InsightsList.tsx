'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { pick } from '@/integrations/supabase/cms-types';
import type { InsightRow } from '@/integrations/supabase/cms-types';

const InsightsList = () => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [insights, setInsights] = useState<InsightRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('insights')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });
      setInsights((data as unknown as InsightRow[]) || []);
    })();
  }, []);

  const catLabel = (category: string | null) =>
    category === 'Market Analysis' ? t('insights.categories.marketAnalysis') :
    category === 'Strategy' ? t('insights.categories.strategy') :
    category === 'Investment' ? t('insights.categories.investment') : (category || '');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return insights;
    const q = searchQuery.toLowerCase();
    return insights.filter((a) =>
      pick(language, a.title_en, a.title_zh).toLowerCase().includes(q) ||
      pick(language, a.excerpt_en, a.excerpt_zh).toLowerCase().includes(q) ||
      (a.category || '').toLowerCase().includes(q)
    );
  }, [insights, searchQuery, language]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="min-h-screen">
      <Seo title={`${t('insights.title')} | Mu SiChen`} description={t('insights.subtitle')} lang={language} />
      <Navigation />

      <section className="pt-24 pb-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="section-heading text-primary mb-4">{t('insights.title')}</h1>
            <p className="font-body text-lg font-light text-muted-foreground max-w-2xl mx-auto">{t('insights.subtitle')}</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-muted-foreground" /></div>
              <Input
                type="text"
                placeholder={t('insights.title')}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-6 py-6 text-lg font-body font-light bg-card border-border/50 rounded-xl shadow-luxury"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="container mx-auto px-6">
          {paginated.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">—</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {paginated.map((insight) => {
                const dateStr = insight.published_at
                  ? new Date(insight.published_at).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : '';
                return (
                  <article key={insight.id} className="group cursor-pointer hover-lift" onClick={() => router.push(`/insights/${insight.slug}`)}>
                    {insight.image_url && (
                      <div className="overflow-hidden mb-5 rounded-sm">
                        <img src={insight.image_url} alt={pick(language, insight.title_en, insight.title_zh)} className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="px-3 py-1 bg-gold-light text-primary text-xs font-body font-light tracking-wide">{catLabel(insight.category)}</span>
                      <span className="text-sm text-muted-foreground font-body font-light">{dateStr}</span>
                    </div>
                    <h3 className="font-serif text-xl font-medium text-primary mb-3 group-hover:text-gold transition-colors duration-300">
                      {pick(language, insight.title_en, insight.title_zh)}
                    </h3>
                    <p className="font-body text-muted-foreground font-light leading-relaxed mb-4 line-clamp-3">
                      {pick(language, insight.excerpt_en, insight.excerpt_zh)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-body font-light">{insight.read_time ? `${insight.read_time} min read` : ''}</span>
                      <span className="font-body text-sm font-light text-primary elegant-underline">{t('insights.readMore')}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-14 flex-wrap">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-primary text-primary disabled:opacity-50 hover:bg-primary hover:text-primary-foreground transition-all duration-300">{t('properties.prev')}</button>
              <div className="hidden sm:flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 border ${currentPage === i + 1 ? 'bg-primary text-primary-foreground border-primary' : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'} transition-all duration-300`}>{i + 1}</button>
                ))}
              </div>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border border-primary text-primary disabled:opacity-50 hover:bg-primary hover:text-primary-foreground transition-all duration-300">{t('properties.next')}</button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InsightsList;
