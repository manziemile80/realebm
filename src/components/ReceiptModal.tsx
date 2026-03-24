import { useRef } from "react";
import { Sale } from "@/types/ebm";
import { Printer, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReceiptProps {
  sale: Sale;
  onClose: () => void;
}

const ReceiptModal = ({ sale, onClose }: ReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=350,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Receipt ${sale.receiptNumber}</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 11px; margin: 0; padding: 16px; width: 280px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .right { text-align: right; }
        .divider { border-top: 1px dashed #999; margin: 6px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 2px 0; }
        .flex-row { display: flex; justify-content: space-between; }
        .small { font-size: 9px; color: #666; }
      </style></head><body>
        ${content.innerHTML}
        <script>window.onload=function(){window.print();window.close();}<\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPDF = () => {
    const content = receiptRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=350,height=600");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Receipt ${sale.receiptNumber}</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 11px; margin: 0; padding: 16px; width: 280px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .right { text-align: right; }
        .divider { border-top: 1px dashed #999; margin: 6px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 2px 0; }
        .flex-row { display: flex; justify-content: space-between; }
        .small { font-size: 9px; color: #666; }
      </style></head><body>
        ${content.innerHTML}
        <p class="center small" style="margin-top:12px">Save as PDF: use Print → "Save as PDF"</p>
        <script>window.onload=function(){window.print();}<\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50" onClick={onClose}>
      <div
        className="w-80 animate-receipt-print overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receipt-edge-top" />
        <div ref={receiptRef} className="receipt-paper bg-card px-6 py-4 font-receipt text-xs leading-relaxed text-foreground shadow-xl">
          <div className="center" style={{ textAlign: "center" }}>
            <p className="text-sm font-bold">EDTECH SOLUTIONS</p>
            <p className="text-sm font-bold">TRAINING CENTER</p>
            <p className="text-[10px] text-muted-foreground small">Electronic Billing Machine</p>
            <p className="text-[10px] text-muted-foreground small">TIN: 000-000-000 (Simulation)</p>
            <div className="divider border-b border-dashed border-foreground/30 pt-2" />
          </div>

          <div className="space-y-1 mb-2">
            <p>Receipt: {sale.receiptNumber}</p>
            <p>Date: {new Date(sale.date).toLocaleString()}</p>
            <p>Cashier: {sale.servedBy}</p>
          </div>

          <div className="divider border-b border-dashed border-foreground/30 mb-2" />

          <table className="w-full mb-2">
            <thead>
              <tr className="text-left">
                <th className="pb-1">Item</th>
                <th className="pb-1 right" style={{ textAlign: "right" }}>Qty</th>
                <th className="pb-1 right" style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-0.5">{item.productName}</td>
                  <td className="py-0.5 right" style={{ textAlign: "right" }}>{item.quantity}</td>
                  <td className="py-0.5 right" style={{ textAlign: "right" }}>{item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="divider border-b border-dashed border-foreground/30 mb-2" />

          <div className="space-y-1">
            <div className="flex-row flex justify-between">
              <span>Subtotal:</span>
              <span>RWF {sale.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex-row flex justify-between">
              <span>VAT (18%):</span>
              <span>RWF {sale.vatAmount.toLocaleString()}</span>
            </div>
            <div className="divider border-b border-dashed border-foreground/30 my-1" />
            <div className="flex-row flex justify-between text-sm font-bold bold">
              <span>TOTAL:</span>
              <span>RWF {sale.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="divider border-b border-dashed border-foreground/30 my-3" />

          <div className="center" style={{ textAlign: "center" }}>
            <p className="text-[10px] small">*** SIMULATION RECEIPT ***</p>
            <p className="text-[10px] small">For training purposes only</p>
            <p className="text-[10px] text-muted-foreground small">Thank you for your purchase!</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 justify-center py-2 bg-muted border-x border-border">
          <Button size="sm" variant="default" className="text-xs gap-1" onClick={handlePrint}>
            <Printer className="h-3 w-3" /> Print
          </Button>
          <Button size="sm" variant="secondary" className="text-xs gap-1" onClick={handleDownloadPDF}>
            <Download className="h-3 w-3" /> Save PDF
          </Button>
          <Button size="sm" variant="destructive" className="text-xs gap-1" onClick={onClose}>
            <X className="h-3 w-3" /> Close
          </Button>
        </div>

        <div className="receipt-edge-bottom" />
      </div>
    </div>
  );
};

export default ReceiptModal;
