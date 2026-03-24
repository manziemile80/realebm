import { useState } from "react";
import { useEbm } from "@/context/EbmContext";
import { CartItem, Sale, VAT_RATE } from "@/types/ebm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Minus, X, Receipt, Search } from "lucide-react";
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
        return prev.map((c) => c.product.id === productId ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.product.id === productId ? { ...c, quantity: c.quantity + delta } : c).filter((c) => c.quantity > 0));
  };

  const removeItem = (productId: string) => setCart((prev) => prev.filter((c) => c.product.id !== productId));

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
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-3 h-[calc(100vh-6rem)]">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-card border border-border rounded-sm flex-1 flex flex-col overflow-hidden">
          <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between">
            <span className="text-sm font-bold">Point of Sale</span>
            <div className="flex gap-1">
              <button className="ebm-btn-yellow">Query</button>
              <button className="ebm-btn-red">Clear</button>
            </div>
          </div>

          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-7 text-xs rounded-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-2 grid grid-cols-2 md:grid-cols-3 gap-2 content-start">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p.id)}
                disabled={p.stock <= 0}
                className="rounded-sm border border-border bg-card p-2 text-left transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <p className="font-bold text-xs text-foreground truncate">{p.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{p.code}</p>
                <div className="flex justify-between mt-1 text-[10px]">
                  <span className="font-bold text-foreground">RWF {p.price.toLocaleString()}</span>
                  <span className={p.stock < 10 ? "text-destructive font-bold" : "text-muted-foreground"}>
                    Stk: {p.stock}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-72 flex flex-col bg-card border border-border rounded-sm shrink-0 overflow-hidden">
        <div className="bg-accent text-accent-foreground px-3 py-1.5 flex items-center gap-2">
          <ShoppingCart className="h-3 w-3" />
          <span className="text-xs font-bold">Current Cart</span>
        </div>

        <div className="flex-1 overflow-auto p-2 space-y-1">
          {cart.length === 0 && (
            <p className="text-[10px] text-muted-foreground text-center py-6">Cart is empty</p>
          )}
          {cart.map((c) => (
            <div key={c.product.id} className="flex items-center gap-1 bg-muted p-1.5 rounded-sm text-xs">
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate text-foreground text-[10px]">{c.product.name}</p>
                <p className="text-[9px] text-muted-foreground">
                  {c.product.price.toLocaleString()} × {c.quantity}
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => updateQty(c.product.id, -1)}>
                  <Minus className="h-2.5 w-2.5" />
                </Button>
                <span className="w-5 text-center font-mono text-[10px] text-foreground">{c.quantity}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => updateQty(c.product.id, 1)} disabled={c.quantity >= c.product.stock}>
                  <Plus className="h-2.5 w-2.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeItem(c.product.id)}>
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-border p-2 space-y-0.5 text-xs bg-muted">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono">{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>VAT (18%)</span>
            <span className="font-mono">{vatAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t border-border">
            <span>TOTAL</span>
            <span>RWF {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-2 pt-0">
          <Button
            variant="success"
            size="sm"
            className="w-full text-xs font-bold rounded-sm"
            onClick={handleCompleteSale}
            disabled={cart.length === 0}
          >
            <Receipt className="h-3 w-3" /> Complete Sale
          </Button>
        </div>
      </div>

      {receipt && <ReceiptModal sale={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
};

export default SalesPage;
