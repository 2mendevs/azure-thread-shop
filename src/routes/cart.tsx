import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { AuthDialog } from "@/components/auth-dialog";
import { useState } from "react";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  const shipping = subtotal > 1499 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    navigate({ to: "/checkout" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-8 font-display text-3xl font-bold text-foreground md:text-4xl">Your bag</h1>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-16 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">Your bag is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Start exploring our curated edit.</p>
            <Link to="/" className="mt-6 inline-block">
              <Button className="bg-gold-gradient text-gold-foreground shadow-gold">Shop now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}`} className="flex gap-4 rounded-lg border border-border bg-card p-4">
                  <img src={i.image} alt={i.name} className="h-28 w-24 rounded-md object-cover" />
                  <div className="flex flex-1 flex-col">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{i.brand}</p>
                    <p className="font-semibold text-foreground">{i.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Size: {i.size}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-md border border-border">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQty(i.productId, i.size, i.quantity - 1)}>
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{i.quantity}</span>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQty(i.productId, i.size, i.quantity + 1)}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">₹{(i.price * i.quantity).toLocaleString()}</span>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(i.productId, i.size)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-lg border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold text-foreground">Order summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-foreground/80"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-foreground/80"><span>Shipping</span><span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                <div className="my-3 h-px bg-border" />
                <div className="flex justify-between text-base font-semibold text-foreground"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              </div>
              <Button onClick={handleCheckout} size="lg" className="mt-6 w-full bg-gold-gradient text-gold-foreground shadow-gold">
                {user ? "Proceed to checkout" : "Login & checkout"}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Secure payment • SSL encrypted</p>
            </aside>
          </div>
        )}
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} onSuccess={() => navigate({ to: "/checkout" })} />
    </div>
  );
}
