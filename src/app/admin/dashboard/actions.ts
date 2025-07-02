'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { Order, Product } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

interface AdminDashboardData {
    orders: Order[];
    products: Product[];
}

/**
 * Fetches all orders and products for the admin dashboard.
 * This function uses the Firebase Admin SDK to bypass security rules,
 * and should only be called from a secured admin environment.
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
    const db = adminDb;

    try {
        // Fetch data sequentially to improve stability in some environments.
        const ordersSnapshot = await db.collection('orders').get();
        const productsSnapshot = await db.collection('products').get();

        const orders: Order[] = ordersSnapshot.docs
            .map(doc => {
                const data = doc.data();
                // This check prevents crashes if a document is somehow empty.
                if (!data) return null;

                // Safely convert Firestore Timestamps to JS Dates, defaulting to now.
                const date = (data.date && typeof data.date.toDate === 'function') 
                    ? data.date.toDate() 
                    : new Date();
                
                // Provide default values for every field to create a valid Order object.
                return {
                    id: doc.id,
                    userId: data.userId || undefined,
                    date: date,
                    status: data.status || 'Processing',
                    items: Array.isArray(data.items) ? data.items : [], // Ensure items is an array
                    total: typeof data.total === 'number' ? data.total : 0,
                    deliveryFee: typeof data.deliveryFee === 'number' ? data.deliveryFee : 0,
                    deliveryAddress: data.deliveryAddress || 'N/A',
                    customerName: data.customerName || 'N/A',
                    customerPhone: data.customerPhone || 'N/A',
                    orderNumber: typeof data.orderNumber === 'number' ? data.orderNumber : 0,
                    createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : undefined,
                    updatedAt: (data.updatedAt && typeof data.updatedAt.toDate === 'function') ? data.updatedAt.toDate() : undefined,
                } as Order;
            })
            .filter((order): order is Order => order !== null); // Filter out any null entries

        // Sort orders by date in descending order (newest first)
        orders.sort((a, b) => b.date.getTime() - a.date.getTime());

        const products: Product[] = productsSnapshot.docs
            .map(doc => {
                const data = doc.data();
                if (!data) return null;
                // Provide default values for every product field
                return {
                    id: doc.id,
                    name: data.name || 'Unnamed Product',
                    description: data.description || '',
                    price: typeof data.price === 'number' ? data.price : 0,
                    image: data.image || 'https://placehold.co/400x400.png',
                    category: data.category || 'Uncategorized',
                    stock: typeof data.stock === 'number' ? data.stock : 0,
                    rating: typeof data.rating === 'number' ? data.rating : 0,
                    reviews: typeof data.reviews === 'number' ? data.reviews : 0,
                    aiHint: data.aiHint || '',
                } as Product;
            })
            .filter((product): product is Product => product !== null);

        return { orders, products };

    } catch (error: any) {
        console.error("Critical error in getAdminDashboardData:", error);
        // Re-throwing with a more specific message helps debug future issues.
        throw new Error(`Failed to fetch dashboard data. Original error: ${error.message}`);
    }
}
