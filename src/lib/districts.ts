// Prime KL / JB districts used for the property Financial panel benchmarks.
// medianPsf / rentPsf are indicative FALLBACKS (MYR) used only when there is
// no admin override and too few live listings to compute a median.

export interface District {
  key: string;
  label: string;
  keywords: string[];
  medianPsf: number;
  rentPsf: number; // per sq ft, per month
}

export const DISTRICTS: District[] = [
  { key: 'klcc', label: 'KLCC / Golden Triangle', keywords: ['klcc', 'sultan ismail'], medianPsf: 3200, rentPsf: 6.0 },
  { key: 'kl-sentral', label: 'KL Sentral', keywords: ['sentral'], medianPsf: 2200, rentPsf: 5.5 },
  { key: 'bangsar', label: 'Bangsar', keywords: ['bangsar'], medianPsf: 2300, rentPsf: 4.5 },
  { key: 'damansara-heights', label: 'Damansara Heights', keywords: ['damansara'], medianPsf: 2100, rentPsf: 4.0 },
  { key: 'u-thant', label: 'U-Thant / Ampang Hilir', keywords: ['u-thant', 'u thant', 'ampang'], medianPsf: 1600, rentPsf: 4.5 },
  { key: 'mont-kiara', label: 'Mont Kiara', keywords: ['mont kiara'], medianPsf: 1100, rentPsf: 3.5 },
  { key: 'johor', label: 'Johor / Leisure Farm', keywords: ['leisure farm', 'johor'], medianPsf: 1800, rentPsf: 2.8 },
];

export const DEFAULT_DISTRICT: District = { key: 'other', label: 'Other', keywords: [], medianPsf: 2000, rentPsf: 4.0 };

/** All districts including the catch-all, for admin listing. */
export const ALL_DISTRICTS: District[] = [...DISTRICTS, DEFAULT_DISTRICT];

/** Classify a free-text location into a district. */
export function districtOf(location: string): District {
  const s = (location || '').toLowerCase();
  return DISTRICTS.find((d) => d.keywords.some((k) => s.includes(k))) || DEFAULT_DISTRICT;
}

/** Median of a list of numbers (0 if empty). */
export function median(nums: number[]): number {
  if (!nums.length) return 0;
  const a = [...nums].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
