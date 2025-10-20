import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Building2, Lightbulb, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pages: 0,
    properties: 0,
    insights: 0,
    featuredProperties: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [pagesRes, propertiesRes, insightsRes, featuredRes] = await Promise.all([
        supabase.from('pages').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('insights').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('featured', true),
      ]);

      setStats({
        pages: pagesRes.count || 0,
        properties: propertiesRes.count || 0,
        insights: insightsRes.count || 0,
        featuredProperties: featuredRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Pages',
      value: stats.pages,
      description: 'Static content pages',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Properties',
      value: stats.properties,
      description: 'Listed properties',
      icon: Building2,
      color: 'text-green-600',
    },
    {
      title: 'Insights',
      value: stats.insights,
      description: 'Published articles',
      icon: Lightbulb,
      color: 'text-purple-600',
    },
    {
      title: 'Featured',
      value: stats.featuredProperties,
      description: 'Featured properties',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your bilingual CMS. Manage content for English and Chinese audiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16 mb-1" />
                ) : (
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>Get started with managing your bilingual content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold text-foreground mb-1">1. Manage Static Pages</h3>
            <p className="text-sm text-muted-foreground">
              Create and edit pages like About, Services, and Contact with content in both English and Chinese.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold text-foreground mb-1">2. Add Properties</h3>
            <p className="text-sm text-muted-foreground">
              List new properties with bilingual descriptions, images, and pricing information.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold text-foreground mb-1">3. Publish Insights</h3>
            <p className="text-sm text-muted-foreground">
              Share market insights and articles in both languages to engage your audience.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold text-foreground mb-1">4. Feature Content</h3>
            <p className="text-sm text-muted-foreground">
              Mark items as featured to automatically display them on the homepage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
