import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { ADMIN_EMAIL, ADMIN_PASSWORD, loginAdmin } from "@/lib/admin-auth";

export function AuthDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const tryAdmin = (): boolean => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      loginAdmin(email, password);
      toast.success("Welcome, admin");
      onOpenChange(false);
      navigate({ to: "/admin" });
      return true;
    }
    return false;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tryAdmin()) return;
    if (!email.trim()) return toast.error("Please enter your email");
    signIn(email, name);
    toast.success("Welcome back");
    onSuccess?.();
    onOpenChange(false);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (tryAdmin()) return;
    if (!email.trim()) return toast.error("Please enter your email");
    signIn(email, name);
    toast.success(`Welcome, ${name || email}`);
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Welcome to <span className="text-gold">2mendevs</span>
          </DialogTitle>
          <DialogDescription>Sign in with your name and email to continue.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="li-name">Name</Label>
                <Input id="li-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="li-email">Email</Label>
                <Input id="li-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="li-pw">Password</Label>
                <Input id="li-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="(optional)" />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground">Login</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="su-name">Name</Label>
                <Input id="su-name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-pw">Password</Label>
                <Input id="su-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="(optional)" />
              </div>
              <Button type="submit" className="w-full bg-gold-gradient text-gold-foreground shadow-gold">
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
