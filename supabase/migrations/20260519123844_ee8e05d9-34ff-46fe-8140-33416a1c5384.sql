
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  price numeric NOT NULL,
  mrp numeric NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  image text NOT NULL,
  sizes text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

INSERT INTO public.products (name, brand, price, mrp, category, description, image, sizes) VALUES
('Oversized Cotton Tee','2mendevs Essentials',899,1499,'Men','Premium combed cotton with a relaxed drop-shoulder fit. Tailored in soft ivory.','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', ARRAY['S','M','L','XL','XXL']),
('Linen Blend Shirt','2mendevs Resort',1799,2999,'Men','Lightweight linen-cotton blend, mother-of-pearl buttons, breezy structured drape.','https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80', ARRAY['S','M','L','XL']),
('Slim Fit Denim','2mendevs Denim Co.',2299,3499,'Men','Mid-rise stretch denim with subtle whiskering. Built to move, made to last.','https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', ARRAY['28','30','32','34','36']),
('Pleated Midi Dress','2mendevs Atelier',2499,3999,'Women','Fluid pleats in satin-finish crepe. Cinched waist, fluttering hem.','https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80', ARRAY['XS','S','M','L']),
('Tailored Blazer','2mendevs Atelier',4599,6999,'Women','Single-breasted wool blend with structured shoulders and silk lining.','https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', ARRAY['XS','S','M','L','XL']),
('Cashmere Crew Sweater','2mendevs Heritage',3899,5999,'Women','Pure cashmere knit, weightless warmth, in midnight blue.','https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80', ARRAY['S','M','L']),
('Pleated Trousers','2mendevs Heritage',2199,3499,'Men','High-rise pleated front, tapered leg, in stone wool blend.','https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80', ARRAY['30','32','34','36']),
('Silk Camisole','2mendevs Atelier',1899,2999,'Women','100% mulberry silk with delicate bias-cut drape.','https://images.unsplash.com/photo-1485518882345-15568b007407?w=800&q=80', ARRAY['XS','S','M','L']);
