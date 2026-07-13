'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { districtOf, median } from '@/lib/districts';
import { Info } from 'lucide-react';

interface PropertyFinancialsProps {
  price: number;
  sqft: number;
  location: string;
}

/**
 * Indicative investment snapshot for UHNW buyers, refreshed on every page load.
 *
 *   Price / sq ft            = price / sqft
 *   Gross rental yield        = (district rent psf/mo × 12 × sqft) / price
 *   Value vs area benchmark   = (listing psf − district median psf) / district median psf
 *
 * District median psf resolution (freshest first):
 *   1. Admin override  (site_content key "benchmark.<district>", value_en)
 *   2. Live median of published listings in the same district (needs ≥ 3)
 *   3. Code fallback   (districts.ts)
 * Rent psf: admin override (value_zh) → code fallback.
 */

const myr = (n: number, dp = 0) =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: dp }).format(n);

const numOrNull = (v: unknown) => {
  const n = parseFloat(String(v ?? ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const PropertyFinancials = ({ price, sqft, location }: PropertyFinancialsProps) => {
  const { language } = useLanguage();
  const zh = language === 'zh';
  const L = (en: string, cn: string) => (zh ? cn : en);

  const district = districtOf(location);
  const [medianPsf, setMedianPsf] = useState(district.medianPsf);
  const [rentPsf, setRentPsf] = useState(district.rentPsf);
  const [source, setSource] = useState<'override' | 'live' | 'fallback'>('fallback');

  useEffect(() => {
    let active = true;
    (async () => {
      // 1. Admin override (median in value_en, rent in value_zh)
      const { data: ov } = await supabase
        .from('site_content')
        .select('value_en, value_zh')
        .eq('key', `benchmark.${district.key}`)
        .maybeSingle();
      const overrideMedian = numOrNull(ov?.value_en);
      const overrideRent = numOrNull(ov?.value_zh);

      // 2. Live median of published listings in this district
      const { data: props } = await supabase.from('properties').select('price, sqft, location').eq('published', true);
      let liveMedian: number | null = null;
      if (props) {
        const psfs = props
          .filter((p: any) => p.sqft > 0 && p.price > 0 && districtOf(p.location || '').key === district.key)
          .map((p: any) => p.price / p.sqft);
        if (psfs.length >= 3) liveMedian = median(psfs);
      }

      if (!active) return;
      setMedianPsf(overrideMedian ?? liveMedian ?? district.medianPsf);
      setRentPsf(overrideRent ?? district.rentPsf);
      setSource(overrideMedian ? 'override' : liveMedian ? 'live' : 'fallback');
    })();
    return () => { active = false; };
  }, [district.key, district.medianPsf, district.rentPsf]);

  const hasArea = sqft > 0 && price > 0;
  const psf = hasArea ? price / sqft : 0;
  const monthlyRent = hasArea ? Math.round(sqft * rentPsf) : 0;
  const grossYield = hasArea ? (monthlyRent * 12) / price : 0;
  const vsBench = hasArea && medianPsf > 0 ? (psf - medianPsf) / medianPsf : 0;

  const benchState = vsBench <= -0.03 ? 'below' : vsBench >= 0.03 ? 'above' : 'inline';
  const benchLabel =
    benchState === 'below'
      ? L('Below area median', '低于区域中位数')
      : benchState === 'above'
      ? L('Above area median', '高于区域中位数')
      : L('In line with area median', '与区域中位数持平');

  const sourceNote =
    source === 'override'
      ? L('district benchmark', '区域基准')
      : source === 'live'
      ? L('from current listings', '基于当前房源')
      : L('indicative estimate', '参考估算');

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className="font-serif text-xl font-light text-primary">{L('Financial', '财务概览')}</h3>
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          {L('Indicative', '参考')}
        </span>
      </div>

      {/* Sales Price */}
      <div className="mb-4 border-b border-border pb-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{L('Sales Price', '售价')}</p>
        <p className="font-serif text-2xl font-light text-primary">{myr(price)}</p>
      </div>

      {hasArea ? (
        <div className="space-y-4">
          {/* Price per sq ft */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{L('Price / sq ft', '每平方英尺价格')}</span>
            <span className="font-body text-base font-medium text-foreground">{myr(psf)}</span>
          </div>

          {/* Gross rental yield */}
          <div className="flex items-start justify-between">
            <span className="text-sm text-muted-foreground">
              {L('Gross Rental Yield', '毛租金回报率')}
              <span className="mt-0.5 block text-xs text-muted-foreground/70">
                {L('est.', '约')} {myr(monthlyRent)}/{L('mo', '月')}
              </span>
            </span>
            <span className="font-body text-base font-medium text-foreground">{(grossYield * 100).toFixed(1)}%</span>
          </div>

          {/* Value vs area benchmark */}
          <div>
            <div className="flex items-start justify-between">
              <span className="text-sm text-muted-foreground">
                {L('Value vs Area Benchmark', '相对区域基准')}
                <span className="mt-0.5 block text-xs text-muted-foreground/70">
                  {benchLabel} · {sourceNote}
                </span>
              </span>
              <span className="font-body text-base font-medium text-foreground">
                {vsBench > 0 ? '+' : ''}
                {(vsBench * 100).toFixed(0)}%
              </span>
            </div>
            <p className="mt-2 text-xs leading-snug text-muted-foreground/70">
              {L(
                'How this home’s price per sq ft compares with the typical price per sq ft for its district. A positive figure is above the local median; negative is below.',
                '本房产的每平方英尺价格与其所在区域典型每平方英尺价格的比较。正数表示高于区域中位数，负数表示低于。'
              )}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{L('Add floor area to see investment metrics.', '补充建筑面积以显示投资指标。')}</p>
      )}

      <p className="mt-5 flex items-start gap-1.5 border-t border-border pt-4 text-[11px] leading-snug text-muted-foreground/70">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        {L(
          'Indicative estimates refreshed on each visit from current listings and district assumptions — for guidance only, not financial advice.',
          '每次访问时根据当前房源及区域假设刷新的参考估算，仅供参考，不构成投资建议。'
        )}
      </p>
    </div>
  );
};

export default PropertyFinancials;
