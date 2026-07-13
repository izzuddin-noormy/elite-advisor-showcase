'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { ALL_DISTRICTS, districtOf, median } from '@/lib/districts';

type Draft = Record<string, { median: string; rent: string }>;

const AdminBenchmarks = () => {
  const [draft, setDraft] = useState<Draft>({});
  const [live, setLive] = useState<Record<string, { count: number; median: number }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase.from('site_content').select('key, value_en, value_zh').like('key', 'benchmark.%');
      const map: Draft = {};
      for (const d of ALL_DISTRICTS) map[d.key] = { median: '', rent: '' };
      for (const r of rows || []) {
        const key = (r.key as string).replace('benchmark.', '');
        if (map[key]) map[key] = { median: (r as any).value_en || '', rent: (r as any).value_zh || '' };
      }
      setDraft(map);

      // live medians from published listings
      const { data: props } = await supabase.from('properties').select('price, sqft, location').eq('published', true);
      const acc: Record<string, number[]> = {};
      for (const p of props || []) {
        const pp: any = p;
        if (pp.sqft > 0 && pp.price > 0) {
          const k = districtOf(pp.location || '').key;
          (acc[k] ||= []).push(pp.price / pp.sqft);
        }
      }
      const lv: Record<string, { count: number; median: number }> = {};
      for (const [k, arr] of Object.entries(acc)) lv[k] = { count: arr.length, median: median(arr) };
      setLive(lv);
      setLoading(false);
    })();
  }, []);

  const set = (key: string, field: 'median' | 'rent', value: string) =>
    setDraft((d) => ({ ...d, [key]: { ...d[key], [field]: value } }));

  const save = async () => {
    setSaving(true);
    const rows = ALL_DISTRICTS.map((d) => ({
      key: `benchmark.${d.key}`,
      group: 'benchmarks',
      label: `${d.label} benchmark`,
      value_en: draft[d.key]?.median?.trim() || '',
      value_zh: draft[d.key]?.rent?.trim() || '',
    }));
    const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' });
    setSaving(false);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Saved', description: 'Benchmarks updated' });
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">District Benchmarks</h1>
          <p className="text-muted-foreground text-sm max-w-2xl mt-1">
            Used by the property “Financial” panel. Leave <strong>Median PSF</strong> blank to auto-compute the median from your live listings
            (recomputed on every page load). Set a value only to override with real market data. Rent PSF drives the rental-yield estimate.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save
        </Button>
      </div>

      <div className="space-y-3">
        {ALL_DISTRICTS.map((d) => {
          const lv = live[d.key];
          return (
            <Card key={d.key}>
              <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4 items-end">
                <div>
                  <p className="font-medium text-foreground">{d.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {lv && lv.count >= 3
                      ? `Live median: RM ${Math.round(lv.median).toLocaleString()} (${lv.count} listings)`
                      : lv
                      ? `Only ${lv.count} listing(s) — fallback RM ${d.medianPsf.toLocaleString()} until ≥3`
                      : `No listings yet — fallback RM ${d.medianPsf.toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Median PSF override</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="Auto"
                    value={draft[d.key]?.median ?? ''}
                    onChange={(e) => set(d.key, 'median', e.target.value)}
                    className="w-36"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Rent PSF / mo</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder={String(d.rentPsf)}
                    value={draft[d.key]?.rent ?? ''}
                    onChange={(e) => set(d.key, 'rent', e.target.value)}
                    className="w-36"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBenchmarks;
