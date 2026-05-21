import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useProducts } from "@/lib/use-products";
import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Wand2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

type Slide = {
  kicker: string;
  title: string;
  highlight: string;
  copy: string;
  cta: { label: string; to: string; hash?: string };
  images: string[];
  accent: string;
};

const SLIDES: Slide[] = [
  {
    kicker: "Men's collection",
    title: "Sharp tailoring,",
    highlight: "everyday ease.",
    copy: "Premium menswear cut from breathable fabrics — built to move with you.",
    cta: { label: "Shop Men", to: "/", hash: "men" },
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80",
    ],
    accent: "Fall '26 · Men",
  },
  {
    kicker: "Women's edit",
    title: "Effortless silhouettes,",
    highlight: "couture finish.",
    copy: "From slip dresses to power blazers — wardrobe icons reimagined for her.",
    cta: { label: "Shop Women", to: "/", hash: "women" },
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
      "https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&q=80",
    ],
    accent: "Fall '26 · Women",
  },
  {
    kicker: "Kids' wardrobe",
    title: "Tiny humans,",
    highlight: "big style.",
    copy: "Soft, durable and adorably designed — couture for the little ones.",
    cta: { label: "Shop Kids", to: "/", hash: "kids" },
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1200&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
    ],
    accent: "New · Kids",
  },
  {
    kicker: "Design studio",
    title: "Design your own",
    highlight: "couture.",
    copy: "Upload a photo, add text & symbols, pick a fabric — stitch your one-of-a-kind piece.",
    cta: { label: "Start customizing", to: "/customize" },
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    ],
    accent: "Bespoke · Custom",
  },
];

function HeroSlideshow() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragDx, setDragDx] = useState(0);
  const startX = useRef(0);
  const lastDx = useRef(0);
  const dragging = useRef(false);
  const resumeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  const next = () => setI((p) => (p + 1) % SLIDES.length);
  const prev = () => setI((p) => (p - 1 + SLIDES.length) % SLIDES.length);

  const onDown = (clientX: number) => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    dragging.current = true;
    startX.current = clientX;
    lastDx.current = 0;
    setPaused(true);
  };
  const onMove = (clientX: number) => {
    if (!dragging.current) return;
    const nextDx = clientX - startX.current;
    lastDx.current = nextDx;
    setDragDx(nextDx);
  };
  const onUp = () => {
    if (!dragging.current) return;
    const dx = lastDx.current;
    dragging.current = false;
    lastDx.current = 0;
    setDragDx(0);
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
    resumeTimer.current = window.setTimeout(() => setPaused(false), 800);
  };

  return (
    <section
      className="relative overflow-hidden bg-hero select-none touch-pan-y"
      onMouseDown={(e) => onDown(e.clientX)}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={(e) => onDown(e.touches[0].clientX)}
      onTouchMove={(e) => {
        onMove(e.touches[0].clientX);
        if (Math.abs(lastDx.current) > 8) e.preventDefault();
      }}
      onTouchEnd={onUp}
      style={{ cursor: dragging.current ? "grabbing" : "grab" }}
    >
      <div
        className="container mx-auto grid h-[560px] gap-10 px-4 md:grid-cols-2 md:h-[600px]"
        style={{ transform: `translateX(${dragDx * 0.25}px)`, transition: dragging.current ? "none" : "transform 300ms ease" }}
      >
        {(() => {
          const s = SLIDES[i];
          return (
            <>
              <div key={`txt-${i}`} className="flex flex-col justify-center text-primary-foreground animate-in fade-in slide-in-from-left-6 duration-700">
                <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                  {s.cta.to === "/customize" ? <Wand2 className="h-3.5 w-3.5 text-gold" /> : <Sparkles className="h-3.5 w-3.5 text-gold" />}
                  {s.accent}
                </span>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">{s.kicker}</p>
                <h1 className="mt-2 font-display text-5xl font-bold leading-tight md:text-6xl">
                  {s.title} <span className="text-gold">{s.highlight}</span>
                </h1>
                <p className="mt-5 line-clamp-3 max-w-md text-base text-primary-foreground/85 md:text-lg">{s.copy}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to={s.cta.to} hash={s.cta.hash}>
                    <Button size="lg" className="bg-gold-gradient text-gold-foreground shadow-gold hover:opacity-90">
                      {s.cta.label} <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/customize">
                    <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20">
                      <Wand2 className="mr-1.5 h-4 w-4" /> Customize
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex items-center gap-2">
                  {SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setI(idx)}
                      className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-gold" : "w-3 bg-white/40"}`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="hidden md:block">
                <div key={`img-${i}`} className="relative h-full animate-in fade-in zoom-in-95 duration-700">
                  <img
                    src={s.images[0]}
                    alt={s.kicker}
                    draggable={false}
                    className="absolute right-0 top-4 h-[440px] w-[80%] rounded-2xl object-cover shadow-elegant"
                  />
                  <img
                    src={s.images[1]}
                    alt=""
                    draggable={false}
                    className="absolute bottom-6 left-0 h-44 w-44 rounded-2xl border-4 border-background object-cover shadow-gold"
                  />
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </section>
  );
}

function Home() {
  const { data: products = [] } = useProducts();
  const { men, women, kids } = useMemo(() => ({
    men: products.filter((p) => p.category === "Men"),
    women: products.filter((p) => p.category === "Women"),
    kids: products.filter((p) => p.category === "Kids"),
  }), [products]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <HeroSlideshow />

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

        <div id="women" className="mb-12 scroll-mt-20">
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

        <div id="kids" className="scroll-mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">For little ones</p>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Kids' edit</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {kids.map((p) => <ProductCard key={p.id} product={p} />)}
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
