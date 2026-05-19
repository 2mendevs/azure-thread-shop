import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./products";

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    brand: r.brand,
    price: Number(r.price),
    mrp: Number(r.mrp),
    category: r.category,
    description: r.description,
    image: r.image,
    sizes: r.sizes ?? [],
  }));
}

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts });
}

export function useProduct(id: string) {
  const q = useProducts();
  return { ...q, product: q.data?.find((p) => p.id === id) };
}
