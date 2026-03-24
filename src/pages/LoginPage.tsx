import { useState } from "react";
import { useEbm } from "@/context/EbmContext";
import { UserRole } from "@/types/ebm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor } from "lucide-react";

const LoginPage = () => {
  const { login } = useEbm();
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("customer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) login(name.trim(), role);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* EBM-style green header */}
      <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Monitor className="h-3 w-3" />
            TIN: 100509911
          </span>
          <span>R#: 5</span>
        </div>
        <div className="flex items-center gap-3">
          <span>📅 {new Date().toLocaleDateString("en-GB")}</span>
          <span>{new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      {/* Yellow status bar */}
      <div className="bg-secondary text-secondary-foreground px-3 py-1 text-xs font-bold text-center">
        RWANDA TEST SERVER / v20210710 NEW.0129
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-card border border-border rounded-sm shadow-md">
          <div className="bg-primary text-primary-foreground px-4 py-2 text-center">
            <p className="text-sm font-bold">EdTech Solutions Training Center</p>
            <p className="text-[10px] opacity-80">Electronic Billing Machine Simulator</p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-foreground">User Name</Label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-8 text-sm rounded-sm border-border"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-foreground">Select Role</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`rounded-sm border p-2 text-xs font-bold transition-colors ${
                    role === "admin"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`rounded-sm border p-2 text-xs font-bold transition-colors ${
                    role === "customer"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Customer
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-9 text-sm font-bold rounded-sm" size="lg">
              Sign In
            </Button>
          </form>

          {/* Bottom nav mimicking EBM */}
          <div className="grid grid-cols-3 border-t border-border">
            <div className="bg-primary text-primary-foreground text-center py-2 text-[10px] font-bold border-r border-primary-foreground/20">
              Admin Menu
            </div>
            <div className="bg-secondary text-secondary-foreground text-center py-2 text-[10px] font-bold border-r border-secondary-foreground/20">
              POS Menu
            </div>
            <div className="bg-accent text-accent-foreground text-center py-2 text-[10px] font-bold">
              Sales
            </div>
          </div>
        </div>
      </div>

      {/* Error bar at bottom */}
      <div className="bg-destructive text-destructive-foreground px-3 py-1 text-xs text-center">
        ⚠ Please enter User ID
      </div>
    </div>
  );
};

export default LoginPage;
