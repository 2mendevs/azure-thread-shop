import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (product: Product, size: string) => void;
  remove: (productId: string, size: string) => void;
  setQty: (productId: string, size: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "2mendevs.cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const add: CartContextValue["add"] = (product, size) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === product.id && i.size === size);
      if (found) {
        return prev.map((i) =>
          i.productId === product.id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: product.price,
          size,
          quantity: 1,
        },
      ];
    });
  };

  const remove: CartContextValue["remove"] = (productId, size) =>
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));

  const setQty: CartContextValue["setQty"] = (productId, size, qty) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.size === size ? { ...i, quantity: Math.max(0, qty) } : i,
        )
        .filter((i) => i.quantity > 0),
    );

  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.quantity * i.price, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
