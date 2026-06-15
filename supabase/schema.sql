-- ==========================================
-- FLOCO PWA - Supabase Schema
-- ==========================================

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC,
    old_price NUMERIC,
    category TEXT REFERENCES public.categories(slug) ON DELETE SET NULL,
    image TEXT,
    gallery TEXT[], -- Array of image URLs
    composition TEXT[], -- Array of composition items
    size TEXT CHECK (size IN ('S', 'M', 'L', 'XL')),
    is_featured BOOLEAN DEFAULT false,
    in_stock BOOLEAN DEFAULT true,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_time TEXT NOT NULL,
    address TEXT NOT NULL,
    card_text TEXT,
    comment TEXT,
    anonymous_delivery BOOLEAN DEFAULT false,
    total NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create settings table (for single row settings)
CREATE TABLE IF NOT EXISTS public.settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    whatsapp_phone TEXT NOT NULL DEFAULT '77001234567',
    instagram_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/floco.ala/',
    shop_name TEXT NOT NULL DEFAULT 'FLOCO',
    shop_address TEXT NOT NULL DEFAULT 'г. Алматы',
    shop_city TEXT NOT NULL DEFAULT 'Алматы',
    working_hours TEXT NOT NULL DEFAULT '10:00 - 22:00',
    delivery_info TEXT NOT NULL DEFAULT 'Бесплатная доставка по Алматы',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- ==========================================
-- Insert Default Data
-- ==========================================

-- Insert Default Categories
INSERT INTO public.categories (name, slug) VALUES 
('Монобукеты', 'mono'),
('Авторские', 'author'),
('В коробке', 'box'),
('Пионовидные', 'peony-roses'),
('Свадебные', 'wedding'),
('Подарки', 'gifts')
ON CONFLICT (slug) DO NOTHING;

-- Insert Default Settings
INSERT INTO public.settings (id, whatsapp_phone) VALUES (1, '77001234567')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- Row Level Security (RLS) Policies
-- ==========================================

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories are insertable by authenticated users only" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Categories are updatable by authenticated users only" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Categories are deletable by authenticated users only" ON public.categories FOR DELETE USING (auth.role() = 'authenticated');

-- Products Policies
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by authenticated users only" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Products are updatable by authenticated users only" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Products are deletable by authenticated users only" ON public.products FOR DELETE USING (auth.role() = 'authenticated');

-- Orders Policies
-- Allow anyone (even anonymous) to insert an order (since registration is not required)
CREATE POLICY "Orders can be created by anyone" ON public.orders FOR INSERT WITH CHECK (true);
-- Only authenticated admins can view orders
CREATE POLICY "Orders are viewable by authenticated users only" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Orders are updatable by authenticated users only" ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');

-- Settings Policies
CREATE POLICY "Settings are viewable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Settings are updatable by authenticated users only" ON public.settings FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_settings_modtime
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
