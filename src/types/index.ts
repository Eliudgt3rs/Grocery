// In src/types/index.ts

import { Timestamp } from "firebase/firestore";

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  userId: string;
  date: Date;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  deliveryAddress: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  customerName: string;
  customerPhone: string;
  createdAt?: Date;
  updatedAt?: Date;
  orderNumber?: number;
};


// You'll also need your Product type definition
// export type Product = { ... }
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  aiHint?: string;
}
