import { useEbm } from "@/context/EbmContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const { products, sales } = useEbm();

  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const totalVat = sales.reduce((s, sale) => s + sale.vatAmount, 0);
  const lowStockProducts = products.filter((p) => p.stock < 20);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-primary" },
    { label: "Total Sales", value: sales.length, icon: ShoppingCart, color: "text-success" },
    { label: "Revenue (RWF)", value: totalRevenue.toLocaleString(), icon: DollarSign, color: "text-success" },
    { label: "VAT Collected", value: totalVat.toLocaleString(), icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-3 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lowStockProducts.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="h-4 w-4" /> Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-md bg-destructive/5 px-3 py-2 text-sm">
                  <span className="font-medium text-foreground">{p.name}</span>
                  <span className="font-mono text-destructive">{p.stock} left</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {sales.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-sm">
                  <span className="font-mono text-muted-foreground">{sale.receiptNumber}</span>
                  <span className="font-medium text-foreground">RWF {sale.total.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(sale.date).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
