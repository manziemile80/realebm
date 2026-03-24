import { useEbm } from "@/context/EbmContext";
import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const { products, sales } = useEbm();

  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const totalVat = sales.reduce((s, sale) => s + sale.vatAmount, 0);
  const lowStockProducts = products.filter((p) => p.stock < 20);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, bgClass: "bg-primary" },
    { label: "Total Sales", value: sales.length, icon: ShoppingCart, bgClass: "bg-success" },
    { label: "Revenue (RWF)", value: totalRevenue.toLocaleString(), icon: DollarSign, bgClass: "bg-accent" },
    { label: "VAT Collected", value: totalVat.toLocaleString(), icon: DollarSign, bgClass: "bg-secondary" },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-sm">
        <div className="bg-primary text-primary-foreground px-3 py-1.5">
          <span className="text-sm font-bold">Dashboard</span>
        </div>
        <div className="p-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border border-border rounded-sm overflow-hidden">
              <div className={`${s.bgClass} text-primary-foreground px-3 py-1 text-[10px] font-bold`}>
                {s.label}
              </div>
              <div className="bg-card px-3 py-3 flex items-center gap-3">
                <s.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-bold text-foreground">{s.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-card border border-border rounded-sm">
          <div className="bg-destructive text-destructive-foreground px-3 py-1.5 flex items-center gap-2">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs font-bold">Low Stock Alerts</span>
          </div>
          <div className="p-3 space-y-1">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-muted px-3 py-1.5 rounded-sm text-xs">
                <span className="font-medium text-foreground">{p.name}</span>
                <span className="font-mono text-destructive font-bold">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sales.length > 0 && (
        <div className="bg-card border border-border rounded-sm">
          <div className="bg-secondary text-secondary-foreground px-3 py-1.5">
            <span className="text-xs font-bold">Recent Sales</span>
          </div>
          <div className="p-3 space-y-1">
            {sales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between bg-muted px-3 py-1.5 rounded-sm text-xs">
                <span className="font-mono text-muted-foreground">{sale.receiptNumber}</span>
                <span className="font-bold text-foreground">RWF {sale.total.toLocaleString()}</span>
                <span className="text-muted-foreground">
                  {new Date(sale.date).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
