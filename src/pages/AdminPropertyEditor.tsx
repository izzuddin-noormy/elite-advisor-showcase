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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2, Upload } from 'lucide-react';

interface PropertyFormData {
  slug: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  price: number;
  location: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  status: 'available' | 'under_contract' | 'sold' | 'pending';
  image_url: string;
  featured: boolean;
}

const AdminPropertyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, watch, setValue, reset } = useForm<PropertyFormData>({
    defaultValues: {
      slug: '',
      title_en: '',
      title_zh: '',
      description_en: '',
      description_zh: '',
      price: 0,
      location: '',
      address: '',
      beds: 0,
      baths: 0,
      sqft: 0,
      status: 'available',
      image_url: '',
      featured: false,
    },
  });

  const featured = watch('featured');
  const status = watch('status');
  const imageUrl = watch('image_url');

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
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
      navigate('/admin/properties');
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
      const filePath = `properties/${fileName}`;

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

  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);

    try {
      if (id) {
        const { error } = await supabase
          .from('properties')
          .update(data)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Property updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([data]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Property created successfully',
        });
      }

      navigate('/admin/properties');
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
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/properties')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {id ? 'Edit Property' : 'New Property'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="imperial-heights-klcc"
                    {...register('slug', { required: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="under_contract">Under Contract</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (MYR)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="8880000"
                    {...register('price', { required: true, valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="KLCC, Kuala Lumpur"
                    {...register('location', { required: true })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  placeholder="Jalan Ampang, KLCC"
                  {...register('address')}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beds">Bedrooms</Label>
                  <Input
                    id="beds"
                    type="number"
                    placeholder="3"
                    {...register('beds', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baths">Bathrooms</Label>
                  <Input
                    id="baths"
                    type="number"
                    placeholder="2"
                    {...register('baths', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sqft">Square Feet</Label>
                  <Input
                    id="sqft"
                    type="number"
                    placeholder="2500"
                    {...register('sqft', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Display this property in featured sections
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
              <CardTitle>Property Image</CardTitle>
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
                  <img src={imageUrl} alt="Property" className="w-full h-48 object-cover" />
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
                      placeholder="Imperial Heights, KLCC"
                      {...register('title_en', { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_en">Description (English)</Label>
                    <Textarea
                      id="description_en"
                      placeholder="Luxury condominium in the heart of KLCC..."
                      rows={8}
                      {...register('description_en', { required: true })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="zh" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_zh">Title (中文)</Label>
                    <Input
                      id="title_zh"
                      placeholder="帝豪轩，KLCC"
                      {...register('title_zh', { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description_zh">Description (中文)</Label>
                    <Textarea
                      id="description_zh"
                      placeholder="位于 KLCC 中心的豪华公寓..."
                      rows={8}
                      {...register('description_zh', { required: true })}
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
              onClick={() => navigate('/admin/properties')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {id ? 'Update Property' : 'Create Property'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminPropertyEditor;
