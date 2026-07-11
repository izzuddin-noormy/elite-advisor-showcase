'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Lightbulb, Sparkles, Mail, BarChart3, Users, Filter, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettings } from '@/lib/useSettings';

const AdminDashboard = () => {
  const { settings } = useSettings();
  const [stats, setStats] = useState({ properties: 0, developments: 0, insights: 0, unread: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [prop, dev, ins, msg, unread] = await Promise.all([
          supabase.from('properties').select('id', { count: 'exact', head: true }),
          supabase.from('developments').select('id', { count: 'exact', head: true }),
          supabase.from('insights').select('id', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false),
        ]);
        setStats({
          properties: prop.count || 0,
          developments: dev.count || 0,
          insights: ins.count || 0,
          messages: msg.count || 0,
          unread: unread.count || 0,
        });
      } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, []);

  const cards = [
    { title: 'Properties', value: stats.properties, icon: Building2, color: 'text-green-600' },
    { title: 'New Launch', value: stats.developments, icon: Sparkles, color: 'text-amber-600' },
    { title: 'Insights', value: stats.insights, icon: Lightbulb, color: 'text-purple-600' },
    { title: 'Messages', value: stats.messages, icon: Mail, color: 'text-blue-600', note: stats.unread ? `${stats.unread} unread` : undefined },
  ];

  const dash = settings.posthog_dashboard_url;
  const proj = (settings.posthog_project_url || '').replace(/\/$/, '');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Content overview and visitor analytics.</p>
      </div>

      {/* Content stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
                <Icon className={`h-5 w-5 ${c.color}`} />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-16 mb-1" /> : <div className="text-3xl font-bold text-foreground">{c.value}</div>}
                {c.note && <p className="text-xs text-primary mt-1">{c.note}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Visitor analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Visitor Analytics</CardTitle>
          </div>
          <CardDescription>
            Unique visitors, CTA clicks, page/panel views, form submissions and geography — powered by PostHog.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {proj && (
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline"><a href={`${proj}/web`} target="_blank" rel="noreferrer"><BarChart3 className="h-4 w-4 mr-2" />Web & Geo <ExternalLink className="h-3 w-3 ml-2" /></a></Button>
              <Button asChild variant="outline"><a href={`${proj}/insights`} target="_blank" rel="noreferrer"><Filter className="h-4 w-4 mr-2" />Funnels <ExternalLink className="h-3 w-3 ml-2" /></a></Button>
              <Button asChild variant="outline"><a href={`${proj}/persons`} target="_blank" rel="noreferrer"><Users className="h-4 w-4 mr-2" />Visitor drill-down <ExternalLink className="h-3 w-3 ml-2" /></a></Button>
            </div>
          )}

          {dash ? (
            <div className="rounded-lg overflow-hidden border" style={{ height: '70vh' }}>
              <iframe title="PostHog dashboard" src={dash} className="w-full h-full" style={{ border: 0 }} />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-foreground">Finish analytics setup:</p>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Create a free project at <a className="text-primary underline" href="https://posthog.com" target="_blank" rel="noreferrer">posthog.com</a> and copy the Project API key.</li>
                <li>Set <code>VITE_POSTHOG_KEY</code> (and optionally <code>VITE_POSTHOG_HOST</code>) in your local <code>.env</code> and in Vercel, then redeploy — tracking starts immediately.</li>
                <li>In PostHog, build a dashboard, click Share → “Share publicly”, and paste the embed link plus your project URL under <strong>Settings → Analytics</strong>. The dashboard will appear here and the deep-dive buttons will light up.</li>
              </ol>
              <p>Funnels and per-visitor journeys (select an anonymous ID → see their full path) live in PostHog under Product analytics → Funnels and People.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
