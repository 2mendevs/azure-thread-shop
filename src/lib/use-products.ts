import { getLocal, setLocal, uid, useLocal } from "./local-db";
import type { Product } from "./products";

const KEY = "2mendevs.products";

const SEED: Product[] = [
  {
    id: "p-men-1",
    name: "Tailored Oxford Shirt",
    brand: "2mendevs",
    price: 2499,
    mrp: 3499,
    category: "Men",
    description: "Crisp cotton oxford cut for a tailored modern fit.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80",
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "p-men-2",
    name: "Wool Blazer",
    brand: "2mendevs Atelier",
    price: 6499,
    mrp: 8999,
    category: "Men",
    description: "Italian wool blazer with structured shoulder.",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "p-men-3",
    name: "Slim Chinos",
    brand: "2mendevs",
    price: 1899,
    mrp: 2799,
    category: "Men",
    description: "Stretch cotton chinos in a tapered silhouette.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    ],
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: "p-women-1",
    name: "Silk Slip Dress",
    brand: "2mendevs",
    price: 4299,
    mrp: 5999,
    category: "Women",
    description: "Bias-cut silk slip dress with adjustable straps.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "p-women-2",
    name: "Power Blazer",
    brand: "2mendevs Atelier",
    price: 5499,
    mrp: 7499,
    category: "Women",
    description: "Sharp double-breasted blazer with gold buttons.",
    image: "https://images.unsplash.com/photo-1632149877166-f75d49000351?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1632149877166-f75d49000351?w=600&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80",
      "https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "p-women-3",
    name: "Pleated Midi Skirt",
    brand: "2mendevs",
    price: 2299,
    mrp: 3299,
    category: "Women",
    description: "Flowing pleats in lightweight crepe.",
    image: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600&q=80",
      "https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=600&q=80",
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "p-kids-1",
    name: "Mini Knit Sweater",
    brand: "2mendevs Kids",
    price: 1299,
    mrp: 1899,
    category: "Kids",
    description: "Soft cotton knit, sized for the little ones.",
    image: "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80",
    ],
    sizes: ["2Y", "4Y", "6Y", "8Y"],
  },
  {
    id: "p-kids-2",
    name: "Party Tutu Dress",
    brand: "2mendevs Kids",
    price: 1599,
    mrp: 2199,
    category: "Kids",
    description: "Tulle layered tutu with satin bodice.",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80",
      "https://images.unsplash.com/photo-1611042553365-9b101441c135?w=600&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
      "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&q=80",
    ],
    sizes: ["2Y", "4Y", "6Y", "8Y"],
  },
];

function seed() {
  if (typeof window === "undefined") return SEED;
  const existing = getLocal<Product[] | null>(KEY, null as Product[] | null);
  if (!existing || existing.length === 0) {
    setLocal(KEY, SEED);
    return SEED;
  }
  return existing;
}

export function listProducts(): Product[] {
  return seed();
}

export function createProduct(input: Omit<Product, "id" | "images"> & { images?: string[] }): Product {
  const product: Product = {
    ...input,
    id: uid("prod"),
    images: input.images && input.images.length ? input.images : [input.image],
  };
  setLocal<Product[]>(KEY, [...listProducts(), product]);
  return product;
}

export function updateProduct(id: string, patch: Partial<Product>) {
  const next = listProducts().map((p) => (p.id === id ? { ...p, ...patch } : p));
  setLocal<Product[]>(KEY, next);
}

export function deleteProduct(id: string) {
  setLocal<Product[]>(
    KEY,
    listProducts().filter((p) => p.id !== id),
  );
}

export function useProducts() {
  // ensure seed before subscribing
  if (typeof window !== "undefined") seed();
  const data = useLocal<Product[]>(KEY, SEED);
  return { data, isLoading: false };
}

export function useProduct(id: string) {
  const { data, isLoading } = useProducts();
  return { product: data.find((p) => p.id === id), isLoading, data };
}
