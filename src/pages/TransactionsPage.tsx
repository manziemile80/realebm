import { useState } from "react";
import { useEbm } from "@/context/EbmContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/ebm";
import ReceiptModal from "@/components/ReceiptModal";
import { Eye } from "lucide-react";

const TransactionsPage = () => {
  const { sales } = useEbm();
  const [search, setSearch] = useState("");
  const [viewReceipt, setViewReceipt] = useState<Sale | null>(null);

  const filtered = sales.filter(
    (s) =>
      s.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.servedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>

      <Input
        placeholder="Search by receipt # or cashier..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Card className="border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">VAT</TableHead>
                <TableHead className="text-right">Total (RWF)</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono">{s.receiptNumber}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(s.date).toLocaleString()}
                  </TableCell>
                  <TableCell>{s.servedBy}</TableCell>
                  <TableCell className="text-right">{s.items.length}</TableCell>
                  <TableCell className="text-right font-mono">{s.vatAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">{s.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setViewReceipt(s)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {viewReceipt && <ReceiptModal sale={viewReceipt} onClose={() => setViewReceipt(null)} />}
    </div>
  );
};

export default TransactionsPage;
