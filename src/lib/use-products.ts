import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./products";

type ProductRow = {
  id: string;
  name: string;
  brand: string;
  price: number | string;
  mrp: number | string;
  category: string;
  description: string;
  image: string;
  images?: string[] | null;
  sizes?: string[] | null;
};

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as ProductRow[]).map((r) => {
    const imgs: string[] = Array.isArray(r.images) && r.images.length ? r.images : [r.image];
    return {
      id: r.id,
      name: r.name,
      brand: r.brand,
      price: Number(r.price),
      mrp: Number(r.mrp),
      category: r.category,
      description: r.description,
      image: r.image,
      images: imgs,
      sizes: r.sizes ?? [],
    };
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
}

export function useProduct(id: string) {
  const q = useProducts();
  return { ...q, product: q.data?.find((p) => p.id === id) };
}
