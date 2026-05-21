import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useCart } from "@/lib/cart-context";
import {
  Type, ImagePlus, Sparkles, Shirt, Trash2, ShoppingBag, Upload, MoveDiagonal,
} from "lucide-react";

export const Route = createFileRoute("/customize")({
  component: CustomizePage,
});

type Garment = {
  id: string;
  name: string;
  // simple SVG silhouette mask using currentColor
  svg: (color: string) => string;
  basePrice: number;
};

const GARMENTS: Garment[] = [
  {
    id: "tee",
    name: "Classic Tee",
    basePrice: 1499,
    svg: (c) => `<svg viewBox='0 0 400 480' xmlns='http://www.w3.org/2000/svg'><path fill='${c}' d='M120 60 L80 100 L40 180 L90 220 L110 200 L110 440 L290 440 L290 200 L310 220 L360 180 L320 100 L280 60 L240 90 Q200 130 160 90 Z'/></svg>`,
  },
  {
    id: "hoodie",
    name: "Hoodie",
    basePrice: 2499,
    svg: (c) => `<svg viewBox='0 0 400 480' xmlns='http://www.w3.org/2000/svg'><path fill='${c}' d='M130 50 Q200 20 270 50 L320 90 L370 200 L320 240 L300 220 L300 450 L100 450 L100 220 L80 240 L30 200 L80 90 Z M160 60 Q200 100 240 60 Q230 110 200 120 Q170 110 160 60 Z'/></svg>`,
  },
  {
    id: "dress",
    name: "A-Line Dress",
    basePrice: 2999,
    svg: (c) => `<svg viewBox='0 0 400 480' xmlns='http://www.w3.org/2000/svg'><path fill='${c}' d='M150 50 L120 100 L100 150 L130 170 L130 200 L60 460 L340 460 L270 200 L270 170 L300 150 L280 100 L250 50 L230 80 Q200 110 170 80 Z'/></svg>`,
  },
];

const COLORS = ["#ffffff", "#f5f1e6", "#e8c46b", "#1e3a8a", "#3b82f6", "#0f172a", "#dc2626", "#16a34a", "#9333ea", "#ec4899", "#64748b"];

const FONTS = [
  "Inter, sans-serif",
  '"Playfair Display", serif',
  "Georgia, serif",
  '"Courier New", monospace',
  "Impact, sans-serif",
  '"Comic Sans MS", cursive',
];

const SYMBOLS = ["★","♥","☀","✦","♛","✿","☁","⚡","☮","✈","♪","☘"];

type Element =
  | { id: string; type: "text"; x: number; y: number; text: string; font: string; size: number; color: string }
  | { id: string; type: "image"; x: number; y: number; src: string; width: number }
  | { id: string; type: "symbol"; x: number; y: number; text: string; size: number; color: string };

const SAMPLE_DESIGNS = [
  { name: "Royal Monogram", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80" },
  { name: "Golden Bloom", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" },
  { name: "Starlight Tee", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
  { name: "Indigo Dream", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80" },
  { name: "Heritage Crest", img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80" },
  { name: "Modern Letters", img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80" },
];

function CustomizePage() {
  const [garment, setGarment] = useState<Garment>(GARMENTS[0]);
  const [color, setColor] = useState("#1e3a8a");
  const [size, setSize] = useState("M");
  const [elements, setElements] = useState<Element[]>([
    { id: "t1", type: "text", x: 160, y: 200, text: "2mendevs", font: '"Playfair Display", serif', size: 28, color: "#e8c46b" },
  ]);
  const [selected, setSelected] = useState<string | null>("t1");
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const symbolImgRef = useRef<HTMLInputElement>(null);
  const { add } = useCart();
  const navigate = useNavigate();

  const sel = elements.find((e) => e.id === selected);

  const update = (id: string, patch: Partial<Element>) =>
    setElements((prev) => prev.map((e) => (e.id === id ? ({ ...e, ...patch } as Element) : e)));

  const remove = (id: string) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    if (selected === id) setSelected(null);
  };

  const addText = () => {
    const id = `t${Date.now()}`;
    setElements((p) => [...p, { id, type: "text", x: 150, y: 240, text: "Your text", font: FONTS[0], size: 24, color: "#ffffff" }]);
    setSelected(id);
  };

  const addSymbol = (sym: string) => {
    const id = `s${Date.now()}`;
    setElements((p) => [...p, { id, type: "symbol", x: 180, y: 260, text: sym, size: 48, color: "#e8c46b" }]);
    setSelected(id);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const id = `i${Date.now()}`;
      setElements((p) => [...p, { id, type: "image", x: 140, y: 220, src: reader.result as string, width: 120 }]);
      setSelected(id);
    };
    reader.readAsDataURL(file);
  };

  // Dragging
  const dragRef = useRef<{ id: string; startX: number; startY: number; ox: number; oy: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSelected(id);
    const el = elements.find((x) => x.id === id);
    if (!el) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { id, startX: e.clientX, startY: e.clientY, ox: el.x, oy: el.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    update(d.id, { x: d.ox + (e.clientX - d.startX), y: d.oy + (e.clientY - d.startY) });
  };
  const onPointerUp = () => { dragRef.current = null; };

  const orderNow = () => {
    const designId = `custom-${Date.now()}`;
    const preview = stageRef.current
      ? `data:image/svg+xml;utf8,${encodeURIComponent(garment.svg(color))}`
      : garment.svg(color);
    add(
      {
        id: designId,
        name: `Custom ${garment.name}`,
        brand: "2mendevs Atelier — Custom",
        price: garment.basePrice + 499,
        mrp: garment.basePrice + 999,
        category: "Custom",
        description: "Your bespoke design",
        image: preview,
        images: [preview],
        sizes: [size],
      },
      size,
    );
    toast.success("Custom design added to bag");
    navigate({ to: "/cart" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <p className="text-xs uppercase tracking-widest text-gold">Design studio</p>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Customize your couture</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Pick a silhouette, choose the fabric colour, then add text, symbols and your own photos. We stitch it and ship it.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
        {/* Stage */}
        <div className="space-y-4">
          <div
            ref={stageRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onClick={() => setSelected(null)}
            className="relative mx-auto aspect-[5/6] w-full max-w-[520px] overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-muted/50 to-muted shadow-elegant"
            style={{ touchAction: "none" }}
          >
            <div
              className="absolute inset-0"
              dangerouslySetInnerHTML={{ __html: garment.svg(color) }}
            />
            {elements.map((el) => {
              const isSel = el.id === selected;
              const baseStyle: React.CSSProperties = {
                position: "absolute",
                left: el.x,
                top: el.y,
                cursor: "move",
                outline: isSel ? "2px dashed hsl(var(--gold, 45 80% 60%))" : "none",
                outlineOffset: 4,
                userSelect: "none",
              };
              if (el.type === "text" || el.type === "symbol") {
                return (
                  <div
                    key={el.id}
                    onPointerDown={(e) => onPointerDown(e, el.id)}
                    style={{
                      ...baseStyle,
                      fontFamily: el.type === "text" ? (el as any).font : "system-ui",
                      fontSize: el.size,
                      color: el.color,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {el.text}
                  </div>
                );
              }
              return (
                <img
                  key={el.id}
                  src={el.src}
                  alt=""
                  draggable={false}
                  onPointerDown={(e) => onPointerDown(e, el.id)}
                  style={{ ...baseStyle, width: el.width, height: "auto", borderRadius: 6 }}
                />
              );
            })}
          </div>

          {/* Garment + color */}
          <div className="rounded-xl border border-border bg-card p-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Silhouette</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {GARMENTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGarment(g)}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition ${
                    garment.id === g.id ? "border-gold bg-gold/10 text-foreground" : "border-border hover:border-gold/50"
                  }`}
                >
                  <Shirt className="h-4 w-4" /> {g.name}
                </button>
              ))}
            </div>
            <Label className="mt-4 block text-xs uppercase tracking-wider text-muted-foreground">Fabric colour</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition ${color === c ? "border-gold scale-110" : "border-border"}`}
                  style={{ background: c }}
                  aria-label={c}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded-full border-2 border-border bg-transparent"
                aria-label="Custom colour"
              />
            </div>
          </div>
        </div>

        {/* Tools panel */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 font-display text-lg font-semibold">Add elements</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={addText}><Type className="mr-1.5 h-4 w-4" /> Text</Button>
              <Button variant="outline" onClick={() => photoRef.current?.click()}>
                <ImagePlus className="mr-1.5 h-4 w-4" /> Photo
              </Button>
              <Button variant="outline" onClick={() => symbolImgRef.current?.click()} className="col-span-2">
                <Upload className="mr-1.5 h-4 w-4" /> Upload symbol / logo
              </Button>
            </div>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <input
              ref={symbolImgRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <Label className="mt-4 block text-xs uppercase tracking-wider text-muted-foreground">Symbols</Label>
            <div className="mt-2 grid grid-cols-6 gap-1.5">
              {SYMBOLS.map((s) => (
                <button
                  key={s}
                  onClick={() => addSymbol(s)}
                  className="grid h-10 place-items-center rounded-md border border-border text-xl hover:border-gold hover:bg-gold/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Selected element controls */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Selected</h3>
              {sel && (
                <Button variant="ghost" size="sm" onClick={() => remove(sel.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
            {!sel && <p className="text-sm text-muted-foreground">Tap an element on the design to edit it.</p>}
            {sel?.type === "text" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Text</Label>
                  <Input value={sel.text} onChange={(e) => update(sel.id, { text: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Font</Label>
                  <Select value={sel.font} onValueChange={(v) => update(sel.id, { font: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FONTS.map((f) => (
                        <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f.split(",")[0].replace(/"/g, "")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Size: {sel.size}px</Label>
                  <Slider value={[sel.size]} min={10} max={80} step={1} onValueChange={(v) => update(sel.id, { size: v[0] })} />
                </div>
                <div>
                  <Label className="text-xs">Colour</Label>
                  <input type="color" value={sel.color} onChange={(e) => update(sel.id, { color: e.target.value })} className="h-9 w-full rounded-md border border-input" />
                </div>
              </div>
            )}
            {sel?.type === "symbol" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Size: {sel.size}px</Label>
                  <Slider value={[sel.size]} min={16} max={140} step={2} onValueChange={(v) => update(sel.id, { size: v[0] })} />
                </div>
                <div>
                  <Label className="text-xs">Colour</Label>
                  <input type="color" value={sel.color} onChange={(e) => update(sel.id, { color: e.target.value })} className="h-9 w-full rounded-md border border-input" />
                </div>
              </div>
            )}
            {sel?.type === "image" && (
              <div>
                <Label className="text-xs flex items-center gap-1"><MoveDiagonal className="h-3 w-3" /> Width: {sel.width}px</Label>
                <Slider value={[sel.width]} min={40} max={360} step={2} onValueChange={(v) => update(sel.id, { width: v[0] })} />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Size</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["XS","S","M","L","XL","XXL"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-10 min-w-10 rounded-md border px-3 text-sm font-semibold ${
                    size === s ? "border-gold bg-gold/10 text-foreground" : "border-border hover:border-gold/50"
                  }`}
                >{s}</button>
              ))}
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-xs text-muted-foreground">Base price</p>
              <p className="font-display text-xl font-bold">₹{(garment.basePrice + 499).toLocaleString()}</p>
            </div>
            <Button onClick={orderNow} className="mt-3 w-full bg-gold-gradient text-gold-foreground shadow-gold hover:opacity-90">
              <ShoppingBag className="mr-2 h-4 w-4" /> Order custom piece
            </Button>
          </div>
        </aside>
      </section>

      {/* Sample designs */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> Inspiration
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Designs from our studio</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {SAMPLE_DESIGNS.map((d) => (
            <div key={d.name} className="group overflow-hidden rounded-lg border border-border bg-card">
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img src={d.img} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="p-3 text-sm font-medium text-foreground">{d.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
