import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isAdmin, logoutAdmin } from "@/lib/admin-auth";
import { Trash2, Plus, LogOut, Package, ShoppingBag, ShieldCheck, Pencil } from "lucide-react";
import { useProducts, createProduct, updateProduct, deleteProduct } from "@/lib/use-products";
import { useOrders, setOrderStatus, type OrderStatus } from "@/lib/orders";
import type { Product } from "@/lib/products";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

const STATUS_FLOW = ["confirmed", "packed", "shipped", "out_for_delivery", "delivered"] as const;

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdmin()) navigate({ to: "/admin/login" });
    else setReady(true);
  }, [navigate]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-gold-gradient text-gold-foreground shadow-gold">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">2mendevs Admin</h1>
              <p className="text-xs text-muted-foreground">Control panel</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/"><Button variant="outline" size="sm">View store</Button></Link>
            <Button
              variant="ghost" size="sm"
              onClick={() => { logoutAdmin(); navigate({ to: "/admin/login" }); }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders"><Package className="mr-2 h-4 w-4" /> Orders</TabsTrigger>
            <TabsTrigger value="products"><ShoppingBag className="mr-2 h-4 w-4" /> Products</TabsTrigger>
          </TabsList>
          <TabsContent value="orders"><OrdersPanel /></TabsContent>
          <TabsContent value="products"><ProductsPanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ---------- Orders ---------- */

function OrdersPanel() {
  const orders = useOrders();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
          No orders yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="hidden grid-cols-[140px_1fr_1fr_120px_180px] gap-3 border-b border-border bg-secondary/40 p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <span>Order</span>
            <span>Customer</span>
            <span>Items</span>
            <span className="text-right">Total</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-border">
            {orders.map((o) => {
              const progressIdx = STATUS_FLOW.indexOf(o.status as (typeof STATUS_FLOW)[number]);
              return (
                <div key={o.id} className="p-4 md:p-5">
                  <div className="grid gap-3 md:grid-cols-[140px_1fr_1fr_120px_180px] md:items-start">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">
                        #{o.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{o.full_name}</p>
                      <p className="truncate text-xs text-muted-foreground">{o.user_email}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {o.address_line}, {o.city}, {o.state} - {o.pincode}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ☎ {o.phone} · {o.payment_method.toUpperCase()}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          {it.image && <img src={it.image} alt="" className="h-9 w-9 rounded object-cover" />}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-foreground">{it.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Size {it.size} · Qty {it.quantity} · ₹{(it.price * it.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-left md:text-right">
                      <p className="font-display text-lg font-bold text-foreground">
                        ₹{Number(o.total).toLocaleString()}
                      </p>
                      <Badge className="mt-1 bg-gold-gradient text-gold-foreground">
                        {STATUS_LABEL[o.status] ?? o.status}
                      </Badge>
                    </div>

                    <div>
                      <Select
                        value={o.status}
                        onValueChange={(v) => {
                          setOrderStatus(o.id, v as OrderStatus);
                          toast.success("Order status updated");
                        }}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_FLOW.map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {o.status !== "cancelled" && (
                    <div className="mt-4">
                      <div className="flex items-center gap-1">
                        {STATUS_FLOW.map((s, i) => (
                          <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= progressIdx ? "bg-gold-gradient" : "bg-muted"}`} />
                        ))}
                      </div>
                      <div className="mt-1 grid grid-cols-5 gap-1 text-[10px] text-muted-foreground">
                        {STATUS_FLOW.map((s) => <span key={s} className="text-center">{STATUS_LABEL[s]}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Products ---------- */

function ProductsPanel() {
  const { data: products } = useProducts();

  const [form, setForm] = useState({
    name: "", brand: "", price: "", mrp: "", category: "Men",
    description: "", image: "", images: "", sizes: "S,M,L,XL",
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.image) {
      toast.error("Name, brand and image URL are required");
      return;
    }
    createProduct({
      name: form.name,
      brand: form.brand,
      price: Number(form.price) || 0,
      mrp: Number(form.mrp) || 0,
      category: form.category,
      description: form.description,
      image: form.image,
      images: form.images
        ? form.images.split(",").map((s) => s.trim()).filter(Boolean)
        : [form.image],
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
    });
    toast.success("Product added");
    setForm({ name: "", brand: "", price: "", mrp: "", category: "Men", description: "", image: "", images: "", sizes: "S,M,L,XL" });
  };

  const [editing, setEditing] = useState<Product | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <form
        onSubmit={handleCreate}
        className="h-fit space-y-4 rounded-xl border border-border bg-card p-5"
      >
        <h2 className="font-display text-lg font-semibold text-foreground">Add product</h2>
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₹)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          <Field label="MRP (₹)" type="number" value={form.mrp} onChange={(v) => setForm({ ...form, mrp: v })} />
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Men">Men</SelectItem>
              <SelectItem value="Women">Women</SelectItem>
              <SelectItem value="Kids">Kids</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Field label="Primary image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} placeholder="https://…" />
        <Field label="Extra images (comma-separated URLs)" value={form.images} onChange={(v) => setForm({ ...form, images: v })} placeholder="url1, url2, url3" />
        <Field label="Sizes (comma-separated)" value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} />
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
        </div>
        <Button type="submit" className="w-full bg-gold-gradient text-gold-foreground shadow-gold">
          <Plus className="mr-2 h-4 w-4" /> Add product
        </Button>
      </form>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Catalog ({products.length})</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {products.map((p) => (
            <div key={p.id} className="flex gap-3 rounded-lg border border-border bg-card p-3">
              <img src={p.image} alt={p.name} className="h-20 w-16 rounded object-cover" />
              <div className="flex flex-1 flex-col">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</p>
                <p className="line-clamp-1 text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category} · ₹{p.price.toLocaleString()} · {p.sizes.join("/")}</p>
                <div className="mt-auto flex justify-end gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>
                    <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm" variant="ghost" className="text-destructive"
                    onClick={() => {
                      if (confirm(`Remove "${p.name}"?`)) {
                        deleteProduct(p.id);
                        toast.success("Product removed");
                      }
                    }}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <EditProductDialog product={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function EditProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "", brand: "", price: "", mrp: "", category: "Men",
    description: "", image: "", images: "", sizes: "",
  });
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        brand: product.brand,
        price: String(product.price),
        mrp: String(product.mrp),
        category: product.category,
        description: product.description,
        image: product.image,
        images: (product.images ?? []).join(","),
        sizes: product.sizes.join(","),
      });
    }
  }, [product]);

  const save = () => {
    if (!product) return;
    updateProduct(product.id, {
      name: form.name,
      brand: form.brand,
      price: Number(form.price) || 0,
      mrp: Number(form.mrp) || 0,
      category: form.category,
      description: form.description,
      image: form.image,
      images: form.images
        ? form.images.split(",").map((s) => s.trim()).filter(Boolean)
        : [form.image],
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
    });
    toast.success("Product updated");
    onClose();
  };

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Edit product</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="space-y-4">
            {form.image && <img src={form.image} alt="" className="h-32 w-full rounded-lg object-cover" />}
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (₹)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
              <Field label="MRP (₹)" type="number" value={form.mrp} onChange={(v) => setForm({ ...form, mrp: v })} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Field label="Primary image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <Field label="Extra images (comma-separated)" value={form.images} onChange={(v) => setForm({ ...form, images: v })} />
            <Field label="Sizes (comma-separated)" value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} />
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save} className="bg-gold-gradient text-gold-foreground shadow-gold">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
