import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAIL = "2mendevsadmin@gmail.com";
const ADMIN_PASSWORD = "Admin@1234";

const credsSchema = z.object({
  email: z.string(),
  password: z.string(),
});

function assertAdmin(creds: { email: string; password: string }) {
  if (
    creds.email.trim().toLowerCase() !== ADMIN_EMAIL ||
    creds.password !== ADMIN_PASSWORD
  ) {
    throw new Error("Unauthorized: invalid admin credentials");
  }
}

export const adminListOrders = createServerFn({ method: "POST" })
  .inputValidator((input) => credsSchema.parse(input))
  .handler(async ({ data }) => {
    assertAdmin(data);
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { orders: orders ?? [] };
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    credsSchema
      .extend({
        orderId: z.string().uuid(),
        status: z.enum(["confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    assertAdmin(data);
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.orderId);
    if (error) throw error;
    return { ok: true };
  });

export const adminCreateProduct = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    credsSchema
      .extend({
        name: z.string().min(1).max(200),
        brand: z.string().min(1).max(200),
        price: z.number().min(0),
        mrp: z.number().min(0),
        category: z.string().min(1).max(50),
        description: z.string().max(2000).default(""),
        image: z.string().url(),
        sizes: z.array(z.string().min(1).max(10)).min(1).max(20),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    assertAdmin(data);
    const { email: _e, password: _p, ...row } = data;
    const { data: created, error } = await supabaseAdmin
      .from("products")
      .insert(row)
      .select("id")
      .single();
    if (error) throw error;
    return { id: created.id };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    credsSchema.extend({ productId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    assertAdmin(data);
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", data.productId);
    if (error) throw error;
    return { ok: true };
  });
