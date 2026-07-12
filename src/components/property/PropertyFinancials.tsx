'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface PropertyFinancialsProps {
  price: number;
  sqft: number;
  location: string;
}

/**
 * Indicative investment snapshot for UHNW buyers. All figures are derived
 * mathematically from the listing's price, size and district — clearly
 * labelled as indicative estimates (no live market feed).
 *
 *   Price / sq ft            = price / sqft
 *   Gross rental yield        = (district rent psf/mo × 12 × sqft) / price
 *   Value vs area benchmark   = (listing psf − district median psf) / district median psf
 */

// Reasonable indicative defaults for prime KL / JB districts (MYR).
const DISTRICTS: { keys: string[]; medianPsf: number; rentPsf: number }[] = [
  { keys: ['klcc', 'sultan ismail'], medianPsf: 3200, rentPsf: 6.0 },
  { keys: ['sentral'], medianPsf: 2200, rentPsf: 5.5 },
  { keys: ['bangsar'], medianPsf: 2300, rentPsf: 4.5 },
  { keys: ['damansara'], medianPsf: 2100, rentPsf: 4.0 },
  { keys: ['u-thant', 'u thant', 'ampang'], medianPsf: 1600, rentPsf: 4.5 },
  { keys: ['mont kiara'], medianPsf: 1100, rentPsf: 3.5 },
  { keys: ['leisure farm', 'johor'], medianPsf: 1800, rentPsf: 2.8 },
];
const DEFAULT_BENCH = { medianPsf: 2000, rentPsf: 4.0 };

const myr = (n: number, dp = 0) =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: dp }).format(n);

const PropertyFinancials = ({ price, sqft, location }: PropertyFinancialsProps) => {
  const { language } = useLanguage();
  const zh = language === 'zh';
  const L = (en: string, cn: string) => (zh ? cn : en);

  const bench = DISTRICTS.find((d) => d.keys.some((k) => (location || '').toLowerCase().includes(k))) || DEFAULT_BENCH;
  const hasArea = sqft > 0 && price > 0;

  const psf = hasArea ? price / sqft : 0;
  const monthlyRent = hasArea ? Math.round(sqft * bench.rentPsf) : 0;
  const grossYield = hasArea ? (monthlyRent * 12) / price : 0; // fraction
  const vsBench = hasArea ? (psf - bench.medianPsf) / bench.medianPsf : 0; // fraction

  const benchState = vsBench <= -0.03 ? 'value' : vsBench >= 0.03 ? 'premium' : 'inline';
  const benchColor =
    benchState === 'value' ? 'text-emerald-600' : benchState === 'premium' ? 'text-amber-600' : 'text-muted-foreground';
  const BenchIcon = benchState === 'value' ? TrendingDown : benchState === 'premium' ? TrendingUp : Minus;
  const benchLabel =
    benchState === 'value'
      ? L('Below area median — value buy', '低于区域中位数 — 价值之选')
      : benchState === 'premium'
      ? L('Above area median — premium', '高于区域中位数 — 溢价')
      : L('In line with area median', '与区域中位数持平');

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
          <div className="flex items-start justify-between">
            <span className="text-sm text-muted-foreground">
              {L('Value vs Area Benchmark', '相对区域基准')}
              <span className="mt-0.5 block text-xs text-muted-foreground/70">{benchLabel}</span>
            </span>
            <span className={`flex items-center gap-1 font-body text-base font-medium ${benchColor}`}>
              <BenchIcon className="h-4 w-4" />
              {vsBench > 0 ? '+' : ''}
              {(vsBench * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{L('Add floor area to see investment metrics.', '补充建筑面积以显示投资指标。')}</p>
      )}

      <p className="mt-5 flex items-start gap-1.5 border-t border-border pt-4 text-[11px] leading-snug text-muted-foreground/70">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        {L(
          'Indicative estimates using prevailing district rental and pricing assumptions — for guidance only, not financial advice.',
          '基于区域租金及价格假设的参考估算，仅供参考，不构成投资建议。'
        )}
      </p>
    </div>
  );
};

export default PropertyFinancials;
