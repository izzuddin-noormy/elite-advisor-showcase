'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Save, Search } from 'lucide-react';
import type { SiteContentRow } from '@/integrations/supabase/cms-types';

const AdminSiteContent = () => {
  const [rows, setRows] = useState<SiteContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState<Record<string, { value_en: string; value_zh: string }>>({});
  const [filter, setFilter] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_content').select('*').order('key');
      setRows((data as unknown as SiteContentRow[]) || []);
      setLoading(false);
    })();
  }, []);

  const grouped = useMemo(() => {
    const q = filter.toLowerCase();
    const g: Record<string, SiteContentRow[]> = {};
    for (const r of rows) {
      if (q && !r.key.toLowerCase().includes(q) && !(r.value_en || '').toLowerCase().includes(q)) continue;
      const key = r.group || 'other';
      (g[key] = g[key] || []).push(r);
    }
    return g;
  }, [rows, filter]);

  const edit = (key: string, patch: Partial<{ value_en: string; value_zh: string }>) => {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
    setDirty((d) => {
      const cur = rows.find((r) => r.key === key)!;
      return { ...d, [key]: { value_en: patch.value_en ?? cur.value_en ?? '', value_zh: patch.value_zh ?? cur.value_zh ?? '', ...d[key], ...patch } };
    });
  };

  const saveAll = async () => {
    const keys = Object.keys(dirty);
    if (!keys.length) { toast({ title: 'Nothing to save' }); return; }
    setSaving(true);
    try {
      for (const key of keys) {
        const row = rows.find((r) => r.key === key)!;
        const { error } = await supabase.from('site_content').update({ value_en: row.value_en, value_zh: row.value_zh }).eq('key', key);
        if (error) throw error;
      }
      toast({ title: 'Saved', description: `${keys.length} item(s) updated` });
      setDirty({});
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Site Content</h1>
          <p className="text-muted-foreground text-sm">Edit every interface label in English &amp; 中文. Changes appear on the live site immediately.</p>
        </div>
        <Button onClick={saveAll} disabled={saving || !Object.keys(dirty).length}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="h-4 w-4 mr-2" />Save {Object.keys(dirty).length || ''}</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search content..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      {Object.entries(grouped).map(([group, items]) => (
        <Card key={group}>
          <CardHeader><CardTitle className="capitalize">{group}</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {items.map((r) => (
              <div key={r.key} className="grid grid-cols-1 md:grid-cols-[220px_1fr_1fr] gap-3 items-start border-b border-border pb-4 last:border-0">
                <code className="text-xs text-muted-foreground pt-2 break-all">{r.key}</code>
                {(r.value_en || '').length > 60 ? (
                  <Textarea rows={3} value={r.value_en || ''} onChange={(e) => edit(r.key, { value_en: e.target.value })} placeholder="English" />
                ) : (
                  <Input value={r.value_en || ''} onChange={(e) => edit(r.key, { value_en: e.target.value })} placeholder="English" />
                )}
                {(r.value_zh || '').length > 60 ? (
                  <Textarea rows={3} value={r.value_zh || ''} onChange={(e) => edit(r.key, { value_zh: e.target.value })} placeholder="中文" />
                ) : (
                  <Input value={r.value_zh || ''} onChange={(e) => edit(r.key, { value_zh: e.target.value })} placeholder="中文" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminSiteContent;
