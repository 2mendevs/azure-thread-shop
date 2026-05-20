import { Link } from "@tanstack/react-router";
import { ShoppingBag, User as UserIcon, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { isAdmin as checkAdmin } from "@/lib/admin-auth";

import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "./auth-dialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    setAdmin(checkAdmin());
    const i = setInterval(() => setAdmin(checkAdmin()), 1000);
    return () => clearInterval(i);
  }, []);


  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gold-gradient font-display text-base font-bold text-gold-foreground shadow-gold">
            2m
          </span>
          <span className="font-display text-xl tracking-tight text-foreground">
            2men<span className="text-gold">devs</span>
          </span>
        </Link>

        <nav className="hidden gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">Home</Link>
          <Link to="/" hash="men" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">Men</Link>
          <Link to="/" hash="women" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">Women</Link>
          <Link to="/" hash="kids" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">Kids</Link>
          <Link to="/customize" className="text-sm font-semibold text-gold hover:opacity-80 transition-colors">Customize</Link>
        </nav>

        <div className="flex items-center gap-2">
          {admin && (
            <Link to="/admin">
              <Button size="sm" className="bg-gold-gradient text-gold-foreground shadow-gold">
                <ShieldCheck className="mr-1.5 h-4 w-4" /> Admin
              </Button>
            </Link>
          )}
          {user ? (

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><UserIcon className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate text-xs text-muted-foreground">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => setAuthOpen(true)} className="text-sm">Login</Button>
          )}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-gradient px-1 text-[10px] font-bold text-gold-foreground shadow-gold">
                  {count}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  );
}
