-- Create enum for content types
CREATE TYPE public.content_type AS ENUM ('static', 'listing', 'insight');

-- Create enum for property status
CREATE TYPE public.property_status AS ENUM ('available', 'under_contract', 'sold', 'pending');

-- Create pages table for static content
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_zh TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  type content_type DEFAULT 'static',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  beds INTEGER,
  baths INTEGER,
  sqft INTEGER,
  status property_status DEFAULT 'available',
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create insights table
CREATE TABLE public.insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_zh TEXT NOT NULL,
  excerpt_en TEXT,
  excerpt_zh TEXT,
  author TEXT DEFAULT 'Mu SiChen',
  category TEXT,
  read_time INTEGER DEFAULT 5,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view pages"
  ON public.pages FOR SELECT
  USING (true);

CREATE POLICY "Public can view properties"
  ON public.properties FOR SELECT
  USING (true);

CREATE POLICY "Public can view published insights"
  ON public.insights FOR SELECT
  USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Authenticated users can insert pages"
  ON public.pages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pages"
  ON public.pages FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete pages"
  ON public.pages FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert insights"
  ON public.insights FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update insights"
  ON public.insights FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete insights"
  ON public.insights FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_insights_updated_at
  BEFORE UPDATE ON public.insights
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Public can view CMS images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-images');

CREATE POLICY "Authenticated users can upload CMS images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cms-images');

CREATE POLICY "Authenticated users can update CMS images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cms-images');

CREATE POLICY "Authenticated users can delete CMS images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cms-images');