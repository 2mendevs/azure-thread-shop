import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-elegant"
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-foreground">₹{product.price.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground line-through">₹{product.mrp.toLocaleString()}</span>
          <span className="text-xs font-semibold text-gold">({discount}% off)</span>
        </div>
      </div>
    </Link>
  );
}
