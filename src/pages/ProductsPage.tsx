import { useState } from "react";
import { useEbm } from "@/context/EbmContext";
import { Product, CATEGORIES } from "@/types/ebm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const emptyForm = { name: "", code: "", category: "Electronics", price: 0, stock: 0, unit: "pcs" };

const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, user } = useEbm();
  const isAdmin = user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const openAdd = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, code: p.code, category: p.category, price: p.price, stock: p.stock, unit: p.unit });
    setOpen(true);
  };
  const handleSave = () => {
    if (!form.name || !form.code) return;
    if (editing) updateProduct({ ...editing, ...form });
    else addProduct(form);
    setOpen(false);
  };

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* EBM-style page header with action buttons */}
      <div className="bg-card border border-border rounded-sm">
        <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between">
          <span className="text-sm font-bold">Item</span>
          <div className="flex gap-1">
            {isAdmin && (
              <>
                <button onClick={openAdd} className="ebm-btn-green">New</button>
                <button className="ebm-btn-yellow">Query</button>
                <button className="ebm-btn-orange">Save</button>
              </>
            )}
            <button className="ebm-btn-red">Back</button>
          </div>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 text-xs rounded-sm max-w-xs"
            />
          </div>
        </div>

        {/* Product table */}
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-xs font-bold py-1.5">Item Code</TableHead>
                <TableHead className="text-xs font-bold py-1.5">Item Name</TableHead>
                <TableHead className="text-xs font-bold py-1.5">Category</TableHead>
                <TableHead className="text-xs font-bold py-1.5 text-right">Sale Price</TableHead>
                <TableHead className="text-xs font-bold py-1.5 text-right">Stock</TableHead>
                <TableHead className="text-xs font-bold py-1.5">Unit</TableHead>
                {isAdmin && <TableHead className="text-xs font-bold py-1.5 text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs py-1.5">{p.code}</TableCell>
                  <TableCell className="font-medium text-xs py-1.5">{p.name}</TableCell>
                  <TableCell className="text-xs py-1.5">{p.category}</TableCell>
                  <TableCell className="text-right text-xs py-1.5 font-mono">{p.price.toLocaleString()}</TableCell>
                  <TableCell className={`text-right text-xs py-1.5 font-mono ${p.stock < 20 ? "text-destructive font-bold" : ""}`}>
                    {p.stock}
                  </TableCell>
                  <TableCell className="text-xs py-1.5">{p.unit}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right py-1.5">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(p)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteProduct(p.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6 text-xs">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">{editing ? "Edit Item" : "New Item"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Item Code</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="h-8 text-xs rounded-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Item Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-8 text-xs rounded-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Sale Price</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="h-8 text-xs rounded-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Beginning Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="h-8 text-xs rounded-sm" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Class Name (Category)</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="h-8 text-xs rounded-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Pkg Unit</Label>
              <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="h-8 text-xs rounded-sm" />
            </div>
          </div>
          <DialogFooter className="gap-1">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="text-xs rounded-sm">Cancel</Button>
            <Button size="sm" onClick={handleSave} className="text-xs rounded-sm">{editing ? "Save" : "New"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
