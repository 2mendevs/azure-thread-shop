import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { createOrder } from "@/lib/orders";
import { toast } from "sonner";
import { CreditCard, Wallet, Banknote, Truck, Lock } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

type Step = "address" | "payment";

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("address");
  const [submitting, setSubmitting] = useState(false);

  const [address, setAddress] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  const shipping = subtotal > 1499 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/cart" });
    if (!loading && items.length === 0) navigate({ to: "/cart" });
  }, [user, loading, items.length, navigate]);

  useEffect(() => {
    if (user?.name && !address.full_name) {
      setAddress((a) => ({ ...a, full_name: user.name! }));
    }
  }, [user, address.full_name]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const [, v] of Object.entries(address)) {
      if (!v.trim()) return toast.error("Please complete all address fields");
    }
    if (!/^\d{10}$/.test(address.phone)) return toast.error("Enter a valid 10-digit phone");
    if (!/^\d{6}$/.test(address.pincode)) return toast.error("Enter a valid 6-digit pincode");
    setStep("payment");
  };

  const handlePay = async () => {
    if (!user) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const order = createOrder({
      user_id: user.id,
      user_email: user.email,
      full_name: address.full_name,
      phone: address.phone,
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      payment_method: paymentMethod,
      items: items.map((i) => ({ ...i })),
      total,
    });
    setSubmitting(false);
    clear();
    navigate({ to: "/order-success", search: { id: order.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">Checkout</h1>
        <div className="mb-8 flex items-center gap-3 text-sm">
          <StepBadge active={step === "address"} done={step === "payment"} label="1. Address" />
          <div className="h-px w-8 bg-border" />
          <StepBadge active={step === "payment"} done={false} label="2. Payment" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-lg border border-border bg-card p-6">
            {step === "address" ? (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <h2 className="font-display text-xl font-semibold text-foreground">Shipping address</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Full name" value={address.full_name} onChange={(v) => setAddress({ ...address, full_name: v })} />
                  <Field label="Phone" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} placeholder="10-digit" />
                </div>
                <Field label="Address line" value={address.address_line} onChange={(v) => setAddress({ ...address, address_line: v })} />
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                  <Field label="State" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} />
                  <Field label="Pincode" value={address.pincode} onChange={(v) => setAddress({ ...address, pincode: v })} />
                </div>
                <Button type="submit" className="h-14 w-full bg-primary text-base text-primary-foreground md:w-auto md:px-8">
                  Continue to payment
                </Button>
              </form>
            ) : (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-semibold text-foreground">Payment method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <PayOption value="card" current={paymentMethod} icon={<CreditCard className="h-5 w-5" />} title="Credit / Debit card" desc="Visa, Mastercard, Rupay" />
                  <PayOption value="upi" current={paymentMethod} icon={<Wallet className="h-5 w-5" />} title="UPI" desc="GPay, PhonePe, Paytm" />
                  <PayOption value="netbanking" current={paymentMethod} icon={<Banknote className="h-5 w-5" />} title="Net banking" desc="All major banks" />
                  <PayOption value="cod" current={paymentMethod} icon={<Truck className="h-5 w-5" />} title="Cash on delivery" desc="Pay when it arrives" />
                </RadioGroup>

                <div className="flex items-center gap-2 rounded-md bg-secondary p-3 text-xs text-secondary-foreground">
                  <Lock className="h-3.5 w-3.5 text-gold" /> This is a demo checkout — no real payment is processed.
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" onClick={() => setStep("address")} className="h-14 flex-1 text-base">Back</Button>
                  <Button onClick={handlePay} disabled={submitting} className="h-14 flex-1 bg-gold-gradient text-base text-gold-foreground shadow-gold">
                    {submitting ? "Processing…" : `Pay ₹${total.toLocaleString()}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-lg border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((i) => (
                <div key={`${i.productId}-${i.size}`} className="flex gap-3 text-sm">
                  <img src={i.image} alt={i.name} className="h-14 w-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="line-clamp-1 font-medium text-foreground">{i.name}</p>
                    <p className="text-xs text-muted-foreground">Size {i.size} • Qty {i.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">₹{(i.price * i.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="my-4 h-px bg-border" />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
              <div className="mt-3 flex justify-between text-base font-semibold text-foreground">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/cart" className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground">Edit bag</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StepBadge({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
      active ? "bg-gold-gradient text-gold-foreground shadow-gold" :
      done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
    }`}>{label}</span>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required />
    </div>
  );
}

function PayOption({ value, current, icon, title, desc }: { value: string; current: string; icon: React.ReactNode; title: string; desc: string }) {
  const selected = value === current;
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
      selected ? "border-gold bg-secondary shadow-gold" : "border-border hover:border-foreground/30"
    }`}>
      <RadioGroupItem value={value} />
      <span className={`grid h-9 w-9 place-items-center rounded-md ${selected ? "bg-gold-gradient text-gold-foreground" : "bg-secondary text-foreground"}`}>{icon}</span>
      <span className="flex-1">
        <span className="block font-medium text-foreground">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
    </label>
  );
}
