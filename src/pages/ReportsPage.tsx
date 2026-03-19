import { useEbm } from "@/context/EbmContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ReportsPage = () => {
  const { sales, products, stockEntries } = useEbm();

  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const totalVat = sales.reduce((s, sale) => s + sale.vatAmount, 0);
  const totalSubtotal = sales.reduce((s, sale) => s + sale.subtotal, 0);

  // Sales by date
  const salesByDate: Record<string, { count: number; revenue: number; vat: number }> = {};
  sales.forEach((sale) => {
    const dateKey = new Date(sale.date).toLocaleDateString();
    if (!salesByDate[dateKey]) salesByDate[dateKey] = { count: 0, revenue: 0, vat: 0 };
    salesByDate[dateKey].count++;
    salesByDate[dateKey].revenue += sale.total;
    salesByDate[dateKey].vat += sale.vatAmount;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Reports</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Sales (excl. VAT)</p>
            <p className="text-2xl font-bold text-foreground">RWF {totalSubtotal.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total VAT Collected (18%)</p>
            <p className="text-2xl font-bold text-primary">RWF {totalVat.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Gross Revenue (incl. VAT)</p>
            <p className="text-2xl font-bold text-success">RWF {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Sales */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Daily Sales Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead className="text-right">VAT (RWF)</TableHead>
                <TableHead className="text-right">Revenue (RWF)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(salesByDate).map(([date, data]) => (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>
                  <TableCell className="text-right">{data.count}</TableCell>
                  <TableCell className="text-right font-mono">{data.vat.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">{data.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {Object.keys(salesByDate).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No sales data yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Report */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Current Stock Report</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Unit Price (RWF)</TableHead>
                <TableHead className="text-right">Stock Value (RWF)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-muted-foreground">{p.code}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className={`text-right font-mono ${p.stock < 20 ? "text-destructive font-bold" : ""}`}>
                    {p.stock}
                  </TableCell>
                  <TableCell className="text-right">{p.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">{(p.price * p.stock).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Movement */}
      {stockEntries.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Stock Movement Log</CardTitle>
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

export default ReportsPage;
