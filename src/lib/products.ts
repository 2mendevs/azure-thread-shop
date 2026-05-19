export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  category: string;
  description: string;
  image: string;
  sizes: string[];
};

export const products: Product[] = [
  {
    id: "1",
    name: "Oversized Cotton Tee",
    brand: "2mendevs Essentials",
    price: 899,
    mrp: 1499,
    category: "Men",
    description: "Premium combed cotton with a relaxed drop-shoulder fit. Tailored in soft ivory.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "2",
    name: "Linen Blend Shirt",
    brand: "2mendevs Resort",
    price: 1799,
    mrp: 2999,
    category: "Men",
    description: "Lightweight linen-cotton blend, mother-of-pearl buttons, breezy structured drape.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "3",
    name: "Slim Fit Denim",
    brand: "2mendevs Denim Co.",
    price: 2299,
    mrp: 3499,
    category: "Men",
    description: "Mid-rise stretch denim with subtle whiskering. Built to move, made to last.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: "4",
    name: "Pleated Midi Dress",
    brand: "2mendevs Atelier",
    price: 2499,
    mrp: 3999,
    category: "Women",
    description: "Fluid pleats in satin-finish crepe. Cinched waist, fluttering hem.",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "5",
    name: "Tailored Blazer",
    brand: "2mendevs Atelier",
    price: 4599,
    mrp: 6999,
    category: "Women",
    description: "Single-breasted wool blend with structured shoulders and silk lining.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "6",
    name: "Cashmere Crew Sweater",
    brand: "2mendevs Heritage",
    price: 3899,
    mrp: 5999,
    category: "Women",
    description: "Pure cashmere knit, weightless warmth, in midnight blue.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    sizes: ["S", "M", "L"],
  },
  {
    id: "7",
    name: "Pleated Trousers",
    brand: "2mendevs Heritage",
    price: 2199,
    mrp: 3499,
    category: "Men",
    description: "High-rise pleated front, tapered leg, in stone wool blend.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    sizes: ["30", "32", "34", "36"],
  },
  {
    id: "8",
    name: "Silk Camisole",
    brand: "2mendevs Atelier",
    price: 1899,
    mrp: 2999,
    category: "Women",
    description: "100% mulberry silk with delicate bias-cut drape.",
    image: "https://images.unsplash.com/photo-1485518882345-15568b007407?w=800&q=80",
    sizes: ["XS", "S", "M", "L"],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
