'use server';

import { createOrder } from '@/lib/firestore';
import type { Order } from '@/types';

// Define the input type for the action
export type PlaceOrderInput = Omit<Order, 'id' | 'date' | 'createdAt' | 'updatedAt' | 'orderNumber'>;
export type PlaceOrderOutput = {
    success: boolean;
    orderId?: string;
    message: string;
    title: string;
};


export async function placeOrder(orderData: PlaceOrderInput): Promise<PlaceOrderOutput> {
    try {
        const newOrderId = await createOrder(orderData);
        if (!newOrderId) {
            throw new Error('Failed to create order in database.');
        }

        return {
            success: true,
            orderId: newOrderId,
            title: "Order Confirmed!",
            message: "Your order has been placed successfully and is now being processed.",
        };

    } catch (error) {
        console.error("Critical Error: Failed to create order in Firestore:", error);
        return {
            success: false,
            title: "Order Failed",
            message: "There was a problem saving your order. Please try again.",
        };
    }
}
