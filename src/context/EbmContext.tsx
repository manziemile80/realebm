import React, { createContext, useContext, useState, useCallback } from "react";
import { User, Product, Sale, StockEntry, CartItem, VAT_RATE } from "@/types/ebm";

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Laptop Charger", code: "ELC-001", category: "Electronics", price: 25000, stock: 50, unit: "pcs" },
  { id: "2", name: "Notebook A5", code: "STN-001", category: "Stationery", price: 1500, stock: 200, unit: "pcs" },
  { id: "3", name: "Ballpoint Pen", code: "STN-002", category: "Stationery", price: 500, stock: 500, unit: "pcs" },
  { id: "4", name: "USB Flash Drive 32GB", code: "ELC-002", category: "Electronics", price: 8000, stock: 80, unit: "pcs" },
  { id: "5", name: "Accounting Textbook", code: "BKS-001", category: "Books", price: 15000, stock: 30, unit: "pcs" },
  { id: "6", name: "Mouse Pad", code: "ACC-001", category: "Accessories", price: 3000, stock: 100, unit: "pcs" },
  { id: "7", name: "Whiteboard Marker", code: "STN-003", category: "Stationery", price: 800, stock: 150, unit: "pcs" },
  { id: "8", name: "HDMI Cable", code: "ELC-003", category: "Electronics", price: 5000, stock: 60, unit: "pcs" },
];

interface EbmContextType {
  user: User | null;
  login: (name: string, role: User["role"]) => void;
  logout: () => void;
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  sales: Sale[];
  completeSale: (cart: CartItem[], servedBy: string) => Sale;
  stockEntries: StockEntry[];
  addStockEntry: (productId: string, quantity: number, note: string) => void;
}

const EbmContext = createContext<EbmContextType | null>(null);

let receiptCounter = 1000;

export const EbmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);

  const login = (name: string, role: User["role"]) => setUser({ name, role });
  const logout = () => setUser(null);

  const addProduct = (p: Omit<Product, "id">) => {
    setProducts((prev) => [...prev, { ...p, id: crypto.randomUUID() }]);
  };

  const updateProduct = (p: Product) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
  };

  const addStockEntry = (productId: string, quantity: number, note: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + quantity } : p))
    );
    setStockEntries((prev) => [
      {
        id: crypto.randomUUID(),
        productId,
        productName: product.name,
        quantity,
        date: new Date().toISOString(),
        note,
      },
      ...prev,
    ]);
  };

  const completeSale = useCallback(
    (cart: CartItem[], servedBy: string): Sale => {
      receiptCounter++;
      const items: Sale["items"] = cart.map((c) => ({
        productName: c.product.name,
        productCode: c.product.code,
        quantity: c.quantity,
        unitPrice: c.product.price,
        total: c.product.price * c.quantity,
      }));
      const subtotal = items.reduce((s, i) => s + i.total, 0);
      const vatAmount = Math.round(subtotal * VAT_RATE);
      const sale: Sale = {
        id: crypto.randomUUID(),
        receiptNumber: `EBM-${receiptCounter}`,
        items,
        subtotal,
        vatAmount,
        total: subtotal + vatAmount,
        date: new Date().toISOString(),
        servedBy,
      };
      setSales((prev) => [sale, ...prev]);
      // Deduct stock
      setProducts((prev) =>
        prev.map((p) => {
          const ci = cart.find((c) => c.product.id === p.id);
          return ci ? { ...p, stock: p.stock - ci.quantity } : p;
        })
      );
      return sale;
    },
    []
  );

  return (
    <EbmContext.Provider
      value={{ user, login, logout, products, addProduct, updateProduct, deleteProduct, sales, completeSale, stockEntries, addStockEntry }}
    >
      {children}
    </EbmContext.Provider>
  );
};

export const useEbm = () => {
  const ctx = useContext(EbmContext);
  if (!ctx) throw new Error("useEbm must be used within EbmProvider");
  return ctx;
};
