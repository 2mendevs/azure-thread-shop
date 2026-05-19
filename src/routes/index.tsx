import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/lib/use-products";
import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Truck, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data: products = [] } = useProducts();
  const men = products.filter((p) => p.category === "Men");
  const women = products.filter((p) => p.category === "Women");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="container mx-auto grid gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center text-primary-foreground">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> New season • Fall '26 drop
            </span>
            <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">
              Dress in <span className="text-gold">gold-standard</span> essentials.
            </h1>
            <p className="mt-5 max-w-md text-base text-primary-foreground/85 md:text-lg">
              Premium fabrics, considered cuts, and a curated edit of menswear and womenswear — only at 2mendevs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#shop">
                <Button size="lg" className="bg-gold-gradient text-gold-foreground shadow-gold hover:opacity-90">
                  Shop the edit <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </a>
              <a href="#women">
                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20">
                  Women
                </Button>
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative h-full min-h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
                alt="Editorial fashion"
                className="absolute right-0 top-0 h-[420px] w-[80%] rounded-2xl object-cover shadow-elegant"
              />
              <img
                src="https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&q=80"
                alt="Detail"
                className="absolute -bottom-6 left-0 h-44 w-44 rounded-2xl border-4 border-background object-cover shadow-gold"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 text-sm md:grid-cols-3">
          <div className="flex items-center gap-3 text-foreground/80"><Truck className="h-5 w-5 text-gold" /> Free shipping over ₹1,499</div>
          <div className="flex items-center gap-3 text-foreground/80"><ShieldCheck className="h-5 w-5 text-gold" /> 30-day easy returns</div>
          <div className="flex items-center gap-3 text-foreground/80"><Sparkles className="h-5 w-5 text-gold" /> Premium fabrics, ethically sourced</div>
        </div>
      </section>

      <section id="shop" className="container mx-auto px-4 py-16">
        <div id="men" className="mb-12 scroll-mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">For him</p>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Men's edit</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {men.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

        <div id="women" className="scroll-mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">For her</p>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Women's edit</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {women.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row">
          <p>© 2026 <span className="text-gold font-semibold">2mendevs</span>. Crafted with care.</p>
          <p>support@2mendevs.com</p>
        </div>
      </footer>
    </div>
  );
}
