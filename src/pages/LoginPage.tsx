import { useState } from "react";
import { useEbm } from "@/context/EbmContext";
import { UserRole } from "@/types/ebm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor } from "lucide-react";

const LoginPage = () => {
  const { login } = useEbm();
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) login(name.trim(), role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-primary">
            <Monitor className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            EdTech Solutions Training Center
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Electronic Billing Machine Simulator
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Select Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`rounded-md border p-3 text-sm font-medium transition-colors ${
                    role === "admin"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`rounded-md border p-3 text-sm font-medium transition-colors ${
                    role === "student"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  Student
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
