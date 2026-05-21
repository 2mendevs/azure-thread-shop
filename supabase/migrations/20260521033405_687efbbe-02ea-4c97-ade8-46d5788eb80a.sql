ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';

-- Backfill: for every product, create 4 image variants by varying Unsplash crop params.
-- If image already has a query string we append &, else ?
UPDATE public.products
SET images = ARRAY[
  image,
  CASE WHEN image LIKE '%?%' THEN image || '&fit=crop&crop=top' ELSE image || '?fit=crop&crop=top' END,
  CASE WHEN image LIKE '%?%' THEN image || '&fit=crop&crop=entropy' ELSE image || '?fit=crop&crop=entropy' END,
  CASE WHEN image LIKE '%?%' THEN image || '&fit=crop&crop=faces' ELSE image || '?fit=crop&crop=faces' END
]
WHERE COALESCE(array_length(images, 1), 0) = 0;