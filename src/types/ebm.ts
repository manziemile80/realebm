export type UserRole = "admin" | "student";

export interface User {
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StockEntry {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  date: string;
  note: string;
}

export interface SaleItem {
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  receiptNumber: string;
  items: SaleItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  date: string;
  servedBy: string;
}

export const VAT_RATE = 0.18;

export const CATEGORIES = [
  "Electronics",
  "Stationery",
  "Books",
  "Accessories",
  "Services",
];
