import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/order-success")({
  validateSearch: z.object({ id: z.string().optional() }),
  component: SuccessPage,
});

function SuccessPage() {
  const { id } = Route.useSearch();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-gold-gradient shadow-gold">
          <CheckCircle2 className="h-10 w-10 text-gold-foreground" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold text-foreground md:text-5xl">Order placed</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Thank you for shopping with <span className="font-semibold text-gold">2mendevs</span>. We've sent a confirmation to your email.
        </p>
        {id && (
          <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
            <Package className="h-4 w-4 text-gold" />
            <span className="text-muted-foreground">Order ID:</span>
            <span className="font-mono font-semibold text-foreground">{id.slice(0, 8).toUpperCase()}</span>
          </div>
        )}
        <p className="mt-8 text-sm text-muted-foreground">Expected delivery in 3–5 business days.</p>
        <div className="mt-8 flex gap-3">
          <Link to="/"><Button size="lg" className="bg-primary text-primary-foreground">Continue shopping</Button></Link>
        </div>
      </div>
    </div>
  );
}
