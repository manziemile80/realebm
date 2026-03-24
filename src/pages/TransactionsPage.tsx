import { useState } from "react";
import { useEbm } from "@/context/EbmContext";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/ebm";
import ReceiptModal from "@/components/ReceiptModal";
import { Eye, Search } from "lucide-react";

const TransactionsPage = () => {
  const { sales } = useEbm();
  const [search, setSearch] = useState("");
  const [viewReceipt, setViewReceipt] = useState<Sale | null>(null);

  const filtered = sales.filter(
    (s) => s.receiptNumber.toLowerCase().includes(search.toLowerCase()) || s.servedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="bg-card border border-border rounded-sm">
        <div className="bg-primary text-primary-foreground px-3 py-1.5 flex items-center justify-between">
          <span className="text-sm font-bold">Transaction History</span>
          <div className="flex gap-1">
            <button className="ebm-btn-yellow">Export VAT</button>
            <button className="ebm-btn-orange">Export</button>
            <button className="ebm-btn-red">Close</button>
          </div>
        </div>

        <div className="p-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by receipt # or cashier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 text-xs rounded-sm max-w-xs"
            />
          </div>
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-xs font-bold py-1.5">Receipt #</TableHead>
                <TableHead className="text-xs font-bold py-1.5">Date</TableHead>
                <TableHead className="text-xs font-bold py-1.5">Cashier</TableHead>
                <TableHead className="text-xs font-bold py-1.5 text-right">Items</TableHead>
                <TableHead className="text-xs font-bold py-1.5 text-right">VAT</TableHead>
                <TableHead className="text-xs font-bold py-1.5 text-right">Total (RWF)</TableHead>
                <TableHead className="text-xs font-bold py-1.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs py-1.5">{s.receiptNumber}</TableCell>
                  <TableCell className="text-muted-foreground text-xs py-1.5">{new Date(s.date).toLocaleString()}</TableCell>
                  <TableCell className="text-xs py-1.5">{s.servedBy}</TableCell>
                  <TableCell className="text-right text-xs py-1.5">{s.items.length}</TableCell>
                  <TableCell className="text-right font-mono text-xs py-1.5">{s.vatAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold text-xs py-1.5">{s.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right py-1.5">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setViewReceipt(s)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6 text-xs">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {viewReceipt && <ReceiptModal sale={viewReceipt} onClose={() => setViewReceipt(null)} />}
    </div>
  );
};

export default TransactionsPage;
