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
        // Fetch orders and products in parallel for efficiency.
        const [ordersSnapshot, productsSnapshot] = await Promise.all([
            db.collection('orders').get(),
            db.collection('products').get()
        ]);

        const orders: Order[] = ordersSnapshot.docs
            .map(doc => {
                const data = doc.data();
                if (!data) return null; // Handle cases where doc data is empty

                // Safely convert Firestore Timestamps to JS Dates
                const date = (data.date && typeof data.date.toDate === 'function') 
                    ? data.date.toDate() 
                    : new Date();
                
                // Provide default values for all fields to prevent crashes
                return {
                    id: doc.id,
                    userId: data.userId || undefined,
                    date: date,
                    status: data.status || 'Processing',
                    items: data.items || [],
                    total: data.total || 0,
                    deliveryFee: data.deliveryFee || 0,
                    deliveryAddress: data.deliveryAddress || 'N/A',
                    customerName: data.customerName || 'N/A',
                    customerPhone: data.customerPhone || 'N/A',
                    orderNumber: data.orderNumber || 0,
                    createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : undefined,
                    updatedAt: (data.updatedAt && typeof data.updatedAt.toDate === 'function') ? data.updatedAt.toDate() : undefined,
                } as Order;
            })
            .filter((order): order is Order => order !== null); // Filter out any null entries

        // Sort orders by date in descending order (newest first)
        orders.sort((a, b) => b.date.getTime() - a.date.getTime());

        const products: Product[] = productsSnapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() } as Product;
        });

        return { orders, products };

    } catch (error) {
        console.error("Error getting admin dashboard data from server action: ", error);
        // Propagate a user-friendly error message
        throw new Error("Failed to fetch dashboard data from the server.");
    }
}
