import { useEbm } from "@/context/EbmContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ReportsPage = () => {
  const { sales, products, stockEntries } = useEbm();

  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const totalVat = sales.reduce((s, sale) => s + sale.vatAmount, 0);
  const totalSubtotal = sales.reduce((s, sale) => s + sale.subtotal, 0);

  const salesByDate: Record<string, { count: number; revenue: number; vat: number }> = {};
  sales.forEach((sale) => {
    const dateKey = new Date(sale.date).toLocaleDateString();
    if (!salesByDate[dateKey]) salesByDate[dateKey] = { count: 0, revenue: 0, vat: 0 };
    salesByDate[dateKey].count++;
    salesByDate[dateKey].revenue += sale.total;
    salesByDate[dateKey].vat += sale.vatAmount;
  });

  return (
    <div className="space-y-3">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: "Total Sales (excl. VAT)", value: totalSubtotal, color: "bg-primary" },
          { label: "Total VAT Collected (18%)", value: totalVat, color: "bg-secondary" },
          { label: "Gross Revenue (incl. VAT)", value: totalRevenue, color: "bg-success" },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-sm overflow-hidden">
            <div className={`${item.color} text-primary-foreground px-3 py-1 text-[10px] font-bold`}>{item.label}</div>
            <div className="p-3">
              <p className="text-lg font-bold text-foreground">RWF {item.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Sales */}
      <div className="bg-card border border-border rounded-sm">
        <div className="bg-primary text-primary-foreground px-3 py-1.5">
          <span className="text-xs font-bold">Daily Sales Summary</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="text-xs font-bold py-1.5">Date</TableHead>
              <TableHead className="text-xs font-bold py-1.5 text-right">Transactions</TableHead>
              <TableHead className="text-xs font-bold py-1.5 text-right">VAT (RWF)</TableHead>
              <TableHead className="text-xs font-bold py-1.5 text-right">Revenue (RWF)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(salesByDate).map(([date, data]) => (
              <TableRow key={date}>
                <TableCell className="text-xs py-1.5">{date}</TableCell>
                <TableCell className="text-right text-xs py-1.5">{data.count}</TableCell>
                <TableCell className="text-right font-mono text-xs py-1.5">{data.vat.toLocaleString()}</TableCell>
                <TableCell className="text-right font-bold text-xs py-1.5">{data.revenue.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {Object.keys(salesByDate).length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6 text-xs">No sales data yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stock Report */}
      <div className="bg-card border border-border rounded-sm">
        <div className="bg-accent text-accent-foreground px-3 py-1.5">
          <span className="text-xs font-bold">Current Stock Report</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="text-xs font-bold py-1.5">Code</TableHead>
              <TableHead className="text-xs font-bold py-1.5">Product</TableHead>
              <TableHead className="text-xs font-bold py-1.5 text-right">Stock</TableHead>
              <TableHead className="text-xs font-bold py-1.5 text-right">Unit Price</TableHead>
              <TableHead className="text-xs font-bold py-1.5 text-right">Stock Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs py-1.5 text-muted-foreground">{p.code}</TableCell>
                <TableCell className="font-medium text-xs py-1.5">{p.name}</TableCell>
                <TableCell className={`text-right font-mono text-xs py-1.5 ${p.stock < 20 ? "text-destructive font-bold" : ""}`}>{p.stock}</TableCell>
                <TableCell className="text-right text-xs py-1.5">{p.price.toLocaleString()}</TableCell>
                <TableCell className="text-right font-bold text-xs py-1.5">{(p.price * p.stock).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Stock Movement */}
      {stockEntries.length > 0 && (
        <div className="bg-card border border-border rounded-sm">
          <div className="bg-secondary text-secondary-foreground px-3 py-1.5">
            <span className="text-xs font-bold">Stock Movement Log</span>
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

export default ReportsPage;
