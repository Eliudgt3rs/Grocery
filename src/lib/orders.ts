import type { Order } from '@/types';
import { products } from './products';

export const orders: Order[] = [
  {
    id: 'ORD-12345',
    date: new Date('2023-10-26'),
    status: 'Delivered',
    items: [
      { product: products.find(p => p.id === '1')!, quantity: 2 },
      { product: products.find(p => p.id === '3')!, quantity: 1 },
    ],
    total: 6.20,
    deliveryFee: 1.50,
    deliveryAddress: '123 Koinange St, Nairobi',
  },
  {
    id: 'ORD-12346',
    date: new Date('2023-10-28'),
    status: 'Processing',
    items: [
      { product: products.find(p => p.id === '5')!, quantity: 2 },
      { product: products.find(p => p.id === '7')!, quantity: 1 },
      { product: products.find(p => p.id === '11')!, quantity: 4 },
    ],
    total: 13.00,
    deliveryFee: 2.00,
    deliveryAddress: '456 Uhuru Hwy, Nairobi',
  },
];
