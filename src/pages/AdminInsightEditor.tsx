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

interface InsightFormData {
  slug: string;
  title_en: string;
  title_zh: string;
  content_en: string;
  content_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  author: string;
  category: string;
  read_time: number;
  image_url: string;
  featured: boolean;
}

const AdminInsightEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, watch, setValue, reset } = useForm<InsightFormData>({
    defaultValues: {
      slug: '',
      title_en: '',
      title_zh: '',
      content_en: '',
      content_zh: '',
      excerpt_en: '',
      excerpt_zh: '',
      author: 'Mu SiChen',
      category: 'Market Analysis',
      read_time: 5,
      image_url: '',
      featured: false,
    },
  });

  const featured = watch('featured');
  const imageUrl = watch('image_url');

  useEffect(() => {
    if (id) {
      fetchInsight();
    }
  }, [id]);

  const fetchInsight = async () => {
    try {
      const { data, error } = await supabase
        .from('insights')
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
      navigate('/admin/insights');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `insights/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('cms-images')
        .getPublicUrl(filePath);

      setValue('image_url', data.publicUrl);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: InsightFormData) => {
    setLoading(true);

    try {
      if (id) {
        const { error } = await supabase
          .from('insights')
          .update(data)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Insight updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('insights')
          .insert([data]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Insight created successfully',
        });
      }

      navigate('/admin/insights');
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/insights')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {id ? 'Edit Insight' : 'New Insight'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="klcc-market-trends-2025"
                    {...register('slug', { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="Market Analysis"
                    {...register('category')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    placeholder="Mu SiChen"
                    {...register('author')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="read_time">Read Time (minutes)</Label>
                  <Input
                    id="read_time"
                    type="number"
                    placeholder="5"
                    {...register('read_time', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Display this insight in featured sections
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
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              </div>
              {imageUrl && (
                <div className="rounded-lg overflow-hidden border">
                  <img src={imageUrl} alt="Featured" className="w-full h-48 object-cover" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bilingual Content</CardTitle>
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
                      placeholder="KLCC Market Trends 2025"
                      {...register('title_en', { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerpt_en">Excerpt (English)</Label>
                    <Textarea
                      id="excerpt_en"
                      placeholder="A brief summary of the article..."
                      rows={3}
                      {...register('excerpt_en')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content_en">Content (English)</Label>
                    <Textarea
                      id="content_en"
                      placeholder="Full article content in English..."
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
                      placeholder="KLCC 市场趋势 2025"
                      {...register('title_zh', { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerpt_zh">Excerpt (中文)</Label>
                    <Textarea
                      id="excerpt_zh"
                      placeholder="文章摘要..."
                      rows={3}
                      {...register('excerpt_zh')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content_zh">Content (中文)</Label>
                    <Textarea
                      id="content_zh"
                      placeholder="完整文章内容..."
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
              onClick={() => navigate('/admin/insights')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {id ? 'Update Insight' : 'Create Insight'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminInsightEditor;
