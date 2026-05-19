import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/lib/admin-auth";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(email, password)) {
      toast.success("Welcome, admin");
      navigate({ to: "/admin" });
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <div className="min-h-screen bg-hero grid place-items-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-8 shadow-elegant"
      >
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-gradient shadow-gold">
            <ShieldCheck className="h-6 w-6 text-gold-foreground" />
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-foreground">Admin login</h1>
          <p className="mt-1 text-xs text-muted-foreground">2mendevs control panel</p>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full bg-gold-gradient text-gold-foreground shadow-gold">
          Sign in
        </Button>
        <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">
          ← Back to store
        </Link>
      </form>
    </div>
  );
}
