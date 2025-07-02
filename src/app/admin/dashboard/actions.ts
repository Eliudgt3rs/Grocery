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

        const orders: Order[] = ordersSnapshot.docs.map(doc => {
            const data = doc.data();
            // Safely convert Firestore Timestamps to JS Dates for client-side compatibility
            const date = (data.date && typeof data.date.toDate === 'function') 
                ? data.date.toDate() 
                : new Date();
            
            return {
                id: doc.id,
                userId: data.userId,
                date: date,
                status: data.status,
                items: data.items,
                total: data.total,
                deliveryFee: data.deliveryFee,
                deliveryAddress: data.deliveryAddress,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                orderNumber: data.orderNumber,
            } as Order;
        });

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
