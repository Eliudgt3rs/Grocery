'use server';

import * as admin from 'firebase-admin';
import type { Order, Product } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

function ensureAdminIsInitialized() {
  // Check if the app is already initialized to avoid errors
  if (admin.apps.length === 0) {
    try {
      // initializeApp() will use the service account credentials from the environment
      // when deployed on Firebase App Hosting. For local development, you would
      // need to set up the GOOGLE_APPLICATION_CREDENTIALS environment variable.
      admin.initializeApp();
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
      // Throw an error that the client can catch and display
      throw new Error("Server configuration error. Could not initialize Firebase Admin.");
    }
  }
}

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
    ensureAdminIsInitialized();
    const db = admin.firestore();

    try {
        // Fetch orders and products in parallel for efficiency
        const [ordersSnapshot, productsSnapshot] = await Promise.all([
            db.collection('orders').orderBy('date', 'desc').get(),
            db.collection('products').get()
        ]);

        const orders: Order[] = ordersSnapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Firestore Timestamps to JS Dates for client-side compatibility
            const date = (data.date as Timestamp)?.toDate() || new Date();
            
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
