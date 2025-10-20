import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PageFormData {
  slug: string;
  title_en: string;
  title_zh: string;
  content_en: string;
  content_zh: string;
  featured: boolean;
  type: 'static' | 'listing' | 'insight';
}

const AdminPageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const { register, handleSubmit, watch, setValue, reset } = useForm<PageFormData>({
    defaultValues: {
      slug: '',
      title_en: '',
      title_zh: '',
      content_en: '',
      content_zh: '',
      featured: false,
      type: 'static',
    },
  });

  const featured = watch('featured');
  const type = watch('type');

  useEffect(() => {
    if (id) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      reset(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/admin/pages');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: PageFormData) => {
    setLoading(true);

    try {
      if (id) {
        const { error } = await supabase
          .from('pages')
          .update(data)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Page updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('pages')
          .insert([data]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Page created successfully',
        });
      }

      navigate('/admin/pages');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/pages')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {id ? 'Edit Page' : 'New Page'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="about-us"
                    {...register('slug', { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={(value) => setValue('type', value as 'static' | 'listing' | 'insight')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="listing">Listing</SelectItem>
                      <SelectItem value="insight">Insight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Display this page in featured sections
                  </p>
                </div>
                <Switch
                  checked={featured}
                  onCheckedChange={(checked) => setValue('featured', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="zh">中文</TabsTrigger>
                </TabsList>
                
                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_en">Title (English)</Label>
                    <Input
                      id="title_en"
                      placeholder="About Us"
                      {...register('title_en', { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content_en">Content (English)</Label>
                    <Textarea
                      id="content_en"
                      placeholder="Page content in English..."
                      rows={12}
                      {...register('content_en', { required: true })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="zh" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_zh">Title (中文)</Label>
                    <Input
                      id="title_zh"
                      placeholder="关于我们"
                      {...register('title_zh', { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content_zh">Content (中文)</Label>
                    <Textarea
                      id="content_zh"
                      placeholder="中文页面内容..."
                      rows={12}
                      {...register('content_zh', { required: true })}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/pages')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {id ? 'Update Page' : 'Create Page'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminPageEditor;
