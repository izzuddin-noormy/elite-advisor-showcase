import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, MailOpen, Trash2, Phone } from 'lucide-react';
import type { ContactSubmission } from '@/integrations/supabase/cms-types';

const AdminMessages = () => {
  const [rows, setRows] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    setRows((data as unknown as ContactSubmission[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleRead = async (row: ContactSubmission) => {
    await supabase.from('contact_submissions').update({ is_read: !row.is_read }).eq('id', row.id);
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, is_read: !r.is_read } : r)));
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this message permanently?')) return;
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    setRows((rs) => rs.filter((r) => r.id !== id));
    toast({ title: 'Deleted' });
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const unread = rows.filter((r) => !r.is_read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground text-sm">Contact form submissions. {unread > 0 && <Badge variant="secondary">{unread} unread</Badge>}</p>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id} className={r.is_read ? '' : 'border-primary/40'}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{r.name}</span>
                      {!r.is_read && <Badge>New</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4">
                      <a href={`mailto:${r.email}`} className="hover:text-primary">{r.email}</a>
                      {r.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</span>}
                      <span>{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</span>
                    </div>
                    <p className="text-foreground/90 pt-2 whitespace-pre-line">{r.message}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button variant="ghost" size="icon" title={r.is_read ? 'Mark unread' : 'Mark read'} onClick={() => toggleRead(r)}>
                      {r.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
