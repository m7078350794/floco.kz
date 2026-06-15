-- Add prices and old_prices jsonb columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS prices JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS old_prices JSONB DEFAULT '{}'::jsonb;

-- Migrate existing price to prices->>'kz'
UPDATE public.products
SET prices = jsonb_build_object('kz', price)
WHERE price IS NOT NULL;

-- Migrate existing old_price to old_prices->>'kz'
UPDATE public.products
SET old_prices = jsonb_build_object('kz', old_price)
WHERE old_price IS NOT NULL;

-- Note: In the future, we may want to drop the old columns once we are sure the new ones work perfectly.
-- ALTER TABLE public.products DROP COLUMN price;
-- ALTER TABLE public.products DROP COLUMN old_price;
