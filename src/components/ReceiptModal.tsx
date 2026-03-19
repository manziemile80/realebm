import { Sale } from "@/types/ebm";

interface ReceiptProps {
  sale: Sale;
  onClose: () => void;
}

const ReceiptModal = ({ sale, onClose }: ReceiptProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50" onClick={onClose}>
      <div
        className="w-80 animate-receipt-print overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receipt-edge-top" />
        <div className="receipt-paper bg-card px-6 py-4 font-receipt text-xs leading-relaxed text-foreground shadow-xl">
          <div className="text-center space-y-1 mb-3">
            <p className="text-sm font-bold">EDTECH SOLUTIONS</p>
            <p className="text-sm font-bold">TRAINING CENTER</p>
            <p className="text-[10px] text-muted-foreground">Electronic Billing Machine</p>
            <p className="text-[10px] text-muted-foreground">TIN: 000-000-000 (Simulation)</p>
            <div className="border-b border-dashed border-foreground/30 pt-2" />
          </div>

          <div className="space-y-1 mb-2">
            <p>Receipt: {sale.receiptNumber}</p>
            <p>Date: {new Date(sale.date).toLocaleString()}</p>
            <p>Cashier: {sale.servedBy}</p>
          </div>

          <div className="border-b border-dashed border-foreground/30 mb-2" />

          <table className="w-full mb-2">
            <thead>
              <tr className="text-left">
                <th className="pb-1">Item</th>
                <th className="pb-1 text-right">Qty</th>
                <th className="pb-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-0.5">{item.productName}</td>
                  <td className="py-0.5 text-right">{item.quantity}</td>
                  <td className="py-0.5 text-right">{item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-b border-dashed border-foreground/30 mb-2" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>RWF {sale.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (18%):</span>
              <span>RWF {sale.vatAmount.toLocaleString()}</span>
            </div>
            <div className="border-b border-dashed border-foreground/30 my-1" />
            <div className="flex justify-between text-sm font-bold">
              <span>TOTAL:</span>
              <span>RWF {sale.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-b border-dashed border-foreground/30 my-3" />

          <div className="text-center space-y-1">
            <p className="text-[10px]">*** SIMULATION RECEIPT ***</p>
            <p className="text-[10px]">For training purposes only</p>
            <p className="text-[10px] text-muted-foreground">Thank you for your purchase!</p>
          </div>
        </div>
        <div className="receipt-edge-bottom" />
      </div>
    </div>
  );
};

export default ReceiptModal;
