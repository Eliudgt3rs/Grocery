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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Placed' | 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  total: number;
  deliveryFee: number;
  deliveryAddress: string;
}
