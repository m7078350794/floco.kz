-- ==============================================================================
-- FLOCO: SQL Скрипт для настройки БД (Регионы и Изображения)
-- Инструкция: Скопируйте весь этот код и выполните его в разделе "SQL Editor" в Supabase.
-- ==============================================================================

-- 1. Создание хранилища для картинок (product-images)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Политика: картинки могут смотреть все
CREATE POLICY "Images are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product-images' );

-- Политика: загружать картинки может кто угодно (пока что)
CREATE POLICY "Anyone can upload an image"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'product-images' );

-- ==============================================================================
-- 2. Настройка таблицы settings для поддержки нескольких городов
-- ==============================================================================

-- Добавляем колонку city_id
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS city_id text UNIQUE;

-- Присваиваем существующей записи (id=1) город Almaty
UPDATE public.settings SET city_id = 'almaty' WHERE id = 1 AND city_id IS NULL;

-- Добавляем настройки для остальных городов (если их еще нет)
INSERT INTO public.settings (city_id, whatsapp_phone, shop_address, working_hours, delivery_info, instagram_url, shop_name, shop_city)
VALUES 
  ('astana', '77001234567', 'г. Астана', '10:00 - 22:00', 'Доставка по Астане', 'https://instagram.com/floco.kz', 'Floco', 'Астана'),
  ('tashkent', '998901234567', 'г. Ташкент', '10:00 - 22:00', 'Доставка по Ташкенту', 'https://instagram.com/floco.uz', 'Floco', 'Ташкент'),
  ('bishkek', '996700123456', 'г. Бишкек', '10:00 - 22:00', 'Доставка по Бишкеку', 'https://instagram.com/floco.kg', 'Floco', 'Бишкек'),
  ('dushanbe', '992901234567', 'г. Душанбе', '10:00 - 22:00', 'Доставка по Душанбе', 'https://instagram.com/floco.tj', 'Floco', 'Душанбе')
ON CONFLICT (city_id) DO NOTHING;
