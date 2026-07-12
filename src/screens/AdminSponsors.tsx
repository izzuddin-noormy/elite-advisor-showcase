'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Copy } from 'lucide-react';
import type { SponsorRow } from '@/integrations/supabase/cms-types';

const AdminSponsors = () => {
  const router = useRouter();
  const [rows, setRows] = useState<SponsorRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('sponsors').select('*').order('sort_order', { ascending: true });
    setRows((data as unknown as SponsorRow[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!window.confirm('Delete this sponsor permanently?')) return;
    const { error } = await supabase.from('sponsors').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    setRows((rs) => rs.filter((r) => r.id !== id));
    toast({ title: 'Deleted' });
  };

  const duplicate = async (id: string) => {
    try {
      const { data, error } = await supabase.from('sponsors').select('*').eq('id', id).single();
      if (error || !data) throw error || new Error('Not found');
      const copy: any = { ...data };
      delete copy.id; delete copy.created_at; delete copy.updated_at;
      copy.slug = `${data.slug}-copy-${Math.random().toString(36).slice(2, 6)}`;
      copy.title_en = `${data.title_en} (Copy)`;
      copy.published = false;
      const { error: insErr } = await supabase.from('sponsors').insert([copy]);
      if (insErr) throw insErr;
      toast({ title: 'Duplicated', description: 'A copy was created' });
      load();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sponsors</h1>
          <p className="text-muted-foreground text-sm">Featured/sponsored projects shown in the homepage spotlight carousel.</p>
        </div>
        <Button asChild><Link href="/admin/sponsors/new"><Plus className="h-4 w-4 mr-2" />New Sponsor</Link></Button>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">No sponsors yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(`/admin/sponsors/${r.id}`)}>
              <CardContent className="pt-6 flex items-center gap-4">
                <img src={r.image_url || '/placeholder.svg'} alt="" className="w-24 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{r.title_en}</span>
                    {!r.published && <Badge variant="secondary">Draft</Badge>}
                    {r.badge_en && <Badge>{r.badge_en}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{r.subtitle_en} {r.price_en ? `· ${r.price_en}` : ''}</p>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" title="Edit" onClick={() => router.push(`/admin/sponsors/${r.id}`)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Duplicate" onClick={() => duplicate(r.id)}><Copy className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Delete" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSponsors;
