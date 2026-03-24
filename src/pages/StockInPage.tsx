import { useState } from "react";
import { useEbm } from "@/context/EbmContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PackagePlus } from "lucide-react";
import { toast } from "sonner";

const StockInPage = () => {
  const { products, stockEntries, addStockEntry } = useEbm();
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || quantity <= 0) return;
    addStockEntry(productId, quantity, note);
    toast.success("Stock entry recorded");
    setProductId(""); setQuantity(0); setNote("");
  };

  return (
    <div className="space-y-3">
      <div className="bg-card border border-border rounded-sm max-w-lg">
        <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between">
          <span className="text-sm font-bold flex items-center gap-2">
            <PackagePlus className="h-3.5 w-3.5" /> Stock In
          </span>
          <div className="flex gap-1">
            <button className="ebm-btn-green">New</button>
            <button className="ebm-btn-yellow">Save</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-3 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-bold">Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="h-8 text-xs rounded-sm"><SelectValue placeholder="Select product" /></SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.code} — {p.name} (stock: {p.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold">Quantity</Label>
            <Input type="number" min={1} value={quantity || ""} onChange={(e) => setQuantity(Number(e.target.value))} className="h-8 text-xs rounded-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold">Note (optional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Supplier delivery" className="h-8 text-xs rounded-sm" />
          </div>
          <Button type="submit" className="w-full text-xs font-bold rounded-sm h-8">Record Stock In</Button>
        </form>
      </div>

      {stockEntries.length > 0 && (
        <div className="bg-card border border-border rounded-sm">
          <div className="bg-secondary text-secondary-foreground px-3 py-1.5">
            <span className="text-xs font-bold">Stock Entry History</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-xs font-bold py-1.5">Date</TableHead>
                <TableHead className="text-xs font-bold py-1.5">Product</TableHead>
                <TableHead className="text-xs font-bold py-1.5 text-right">Qty Added</TableHead>
                <TableHead className="text-xs font-bold py-1.5">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockEntries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-muted-foreground text-xs py-1.5">{new Date(e.date).toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-xs py-1.5">{e.productName}</TableCell>
                  <TableCell className="text-right font-mono text-xs py-1.5 text-success font-bold">+{e.quantity}</TableCell>
                  <TableCell className="text-muted-foreground text-xs py-1.5">{e.note || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StockInPage;
