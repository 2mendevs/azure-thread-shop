import { getLocal, setLocal, uid, useLocal } from "./local-db";
import type { CartItem } from "./cart-context";

export type OrderStatus =
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  user_id: string;
  user_email: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
};

const KEY = "2mendevs.orders";

export function listOrders(): Order[] {
  return getLocal<Order[]>(KEY, []);
}

export function createOrder(input: Omit<Order, "id" | "status" | "created_at">): Order {
  const order: Order = {
    ...input,
    id: uid("ord"),
    status: "confirmed",
    created_at: new Date().toISOString(),
  };
  setLocal<Order[]>(KEY, [order, ...listOrders()]);
  return order;
}

export function setOrderStatus(orderId: string, status: OrderStatus) {
  setLocal<Order[]>(
    KEY,
    listOrders().map((o) => (o.id === orderId ? { ...o, status } : o)),
  );
}

export function useOrders() {
  return useLocal<Order[]>(KEY, []);
}
