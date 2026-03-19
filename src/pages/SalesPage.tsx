import { useState } from "react";
import { useEbm } from "@/context/EbmContext";
import { CartItem, Sale, VAT_RATE } from "@/types/ebm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Plus, Minus, X, Receipt } from "lucide-react";
import ReceiptModal from "@/components/ReceiptModal";

const SalesPage = () => {
  const { products, completeSale, user } = useEbm();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [receipt, setReceipt] = useState<Sale | null>(null);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === productId);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((c) =>
          c.product.id === productId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product.id === productId ? { ...c, quantity: c.quantity + delta } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const subtotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);
  const vatAmount = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vatAmount;

  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    const sale = completeSale(cart, user?.name || "Unknown");
    setReceipt(sale);
    setCart([]);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-4 h-[calc(100vh-5rem)]">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-foreground">Point of Sale</h1>
        </div>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />
        <div className="flex-1 overflow-auto grid grid-cols-2 md:grid-cols-3 gap-2 content-start">
          {filteredProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p.id)}
              disabled={p.stock <= 0}
              className="rounded-md border border-border bg-card p-3 text-left transition-colors hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <p className="font-medium text-sm text-foreground truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{p.code}</p>
              <div className="flex justify-between mt-2 text-xs">
                <span className="font-semibold text-foreground">RWF {p.price.toLocaleString()}</span>
                <span className={p.stock < 10 ? "text-destructive" : "text-muted-foreground"}>
                  Stock: {p.stock}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <Card className="w-80 flex flex-col border-border shrink-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingCart className="h-4 w-4 text-primary" /> Current Cart
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden p-3 pt-0">
          <div className="flex-1 overflow-auto space-y-1">
            {cart.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Cart is empty. Select products to begin.
              </p>
            )}
            {cart.map((c) => (
              <div key={c.product.id} className="flex items-center gap-2 rounded-md bg-muted p-2 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-foreground">{c.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    RWF {c.product.price.toLocaleString()} × {c.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(c.product.id, -1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center font-mono text-foreground">{c.quantity}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(c.product.id, 1)} disabled={c.quantity >= c.product.stock}>
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(c.product.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-border pt-3 mt-3 space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>RWF {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT (18%)</span>
              <span>RWF {vatAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-foreground pt-1 border-t border-border">
              <span>Total</span>
              <span>RWF {total.toLocaleString()}</span>
            </div>
          </div>

          <Button
            variant="success"
            size="lg"
            className="w-full mt-3"
            onClick={handleCompleteSale}
            disabled={cart.length === 0}
          >
            <Receipt className="h-4 w-4" /> Complete Sale
          </Button>
        </CardContent>
      </Card>

      {receipt && <ReceiptModal sale={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
};

export default SalesPage;
