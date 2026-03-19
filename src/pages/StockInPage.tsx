import { useState } from "react";
import { useEbm } from "@/context/EbmContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    setProductId("");
    setQuantity(0);
    setNote("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Stock In</h1>

      <Card className="border-border max-w-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <PackagePlus className="h-4 w-4 text-primary" /> Record Stock Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.code} — {p.name} (stock: {p.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Quantity</Label>
              <Input type="number" min={1} value={quantity || ""} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label>Note (optional)</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Supplier delivery" />
            </div>
            <Button type="submit" className="w-full">Record Stock In</Button>
          </form>
        </CardContent>
      </Card>

      {stockEntries.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Stock Entry History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty Added</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockEntries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(e.date).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{e.productName}</TableCell>
                    <TableCell className="text-right font-mono text-success">+{e.quantity}</TableCell>
                    <TableCell className="text-muted-foreground">{e.note || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StockInPage;
