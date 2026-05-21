import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useProduct } from "@/lib/use-products";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { ChevronLeft, ShoppingBag, ShieldCheck, Truck } from "lucide-react";

export const Route = createFileRoute("/products/$id")({
  component: ProductPage,
  notFoundComponent: () => <div className="p-10 text-center">Product not found</div>,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { product, isLoading } = useProduct(id);
  const { add } = useCart();
  const navigate = useNavigate();
  const [size, setSize] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [dragDx, setDragDx] = useState(0);
  const startX = useRef(0);
  const lastDx = useRef(0);
  const dragging = useRef(false);
  const suppressClick = useRef(false);
  const dragFrame = useRef<number | null>(null);

  useEffect(() => {
    setActiveImg(0);
  }, [id]);

  useEffect(() => {
    return () => {
      if (dragFrame.current) window.cancelAnimationFrame(dragFrame.current);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl">Product not found</h1>
          <Link to="/" className="mt-4 inline-block text-gold underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const galleryImages = product.images?.length ? product.images : [product.image];

  const changeImage = (direction: 1 | -1) => {
    setActiveImg((p) => (p + direction + galleryImages.length) % galleryImages.length);
  };

  const onGalleryPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = true;
    startX.current = event.clientX;
    lastDx.current = 0;
  };
  const onGalleryPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const nextDx = event.clientX - startX.current;
    lastDx.current = nextDx;
    if (Math.abs(nextDx) > 8) event.preventDefault();
    if (dragFrame.current) return;
    dragFrame.current = window.requestAnimationFrame(() => {
      setDragDx(lastDx.current);
      dragFrame.current = null;
    });
  };
  const onGalleryPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    const dx = lastDx.current;
    dragging.current = false;
    lastDx.current = 0;
    setDragDx(0);
    if (galleryImages.length > 1 && Math.abs(dx) > 45) {
      suppressClick.current = true;
      changeImage(dx < 0 ? 1 : -1);
      window.setTimeout(() => { suppressClick.current = false; }, 0);
    }
  };

  const handleAdd = (goToCart = false) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    add(product, size);
    toast.success(`Added ${product.name} (${size}) to bag`);
    if (goToCart) navigate({ to: "/cart" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
      </div>
      <div className="container mx-auto grid gap-10 px-4 pb-16 md:grid-cols-2">
        <div className="space-y-3">
          <div
            className="aspect-[3/4] cursor-grab overflow-hidden rounded-xl border border-border bg-muted select-none touch-pan-y active:cursor-grabbing"
            onClickCapture={(e) => {
              if (!suppressClick.current) return;
              e.preventDefault();
              e.stopPropagation();
            }}
            onPointerDown={onGalleryPointerDown}
            onPointerMove={onGalleryPointerMove}
            onPointerUp={onGalleryPointerUp}
            onPointerCancel={onGalleryPointerUp}
          >
            <img
              src={galleryImages[activeImg] ?? product.image}
              alt={product.name}
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-300"
              style={{ transform: `translateX(${dragDx * 0.2}px)`, transition: dragging.current ? "none" : undefined }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {galleryImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                  activeImg === i ? "border-gold shadow-gold" : "border-border hover:border-gold/50"
                }`}
                aria-label={`Image ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" className="h-20 w-16 object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">{product.brand}</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">₹{product.price.toLocaleString()}</span>
            <span className="text-base text-muted-foreground line-through">₹{product.mrp.toLocaleString()}</span>
            <span className="text-sm font-semibold text-gold">({discount}% off)</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wider text-foreground">Select size</p>
              <span className="text-xs text-muted-foreground">Size guide</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`grid h-12 min-w-12 place-items-center rounded-full border px-4 text-sm font-medium transition-all ${
                    size === s
                      ? "border-gold bg-gold-gradient text-gold-foreground shadow-gold"
                      : "border-border bg-background text-foreground hover:border-gold"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => handleAdd(false)} className="h-14 flex-1 bg-primary text-base text-primary-foreground">
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to bag
            </Button>
            <Button onClick={() => handleAdd(true)} className="h-14 flex-1 bg-gold-gradient text-base text-gold-foreground shadow-gold">
              Buy now
            </Button>
          </div>

          <div className="mt-8 space-y-3 rounded-lg border border-border bg-card p-4 text-sm">
            <div className="flex items-center gap-3"><Truck className="h-4 w-4 text-gold" /> Free shipping over ₹1,499 • Delivery in 3-5 days</div>
            <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-gold" /> 30-day returns, no questions asked</div>
          </div>
        </div>
      </div>
    </div>
  );
}
