'use server';

import { createOrder, getOrderById } from '@/lib/firestore';
import { generateOrderConfirmation } from '@/ai/flows/order-confirmation-flow';
import { sendOrderConfirmationNotification } from '@/lib/fcm-admin';
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
        // 1. Create the order in Firestore
        const newOrderId = await createOrder(orderData);
        if (!newOrderId) {
            throw new Error('Failed to create order.');
        }

        // 2. Fetch the newly created order to get all details (like orderNumber)
        const newOrder = await getOrderById(newOrderId);
        if (!newOrder) {
            throw new Error('Failed to retrieve the new order.');
        }

        // 3. Send a push notification (this is fire-and-forget, won't block)
        await sendOrderConfirmationNotification(orderData.userId, newOrder);

        // 4. Generate the AI confirmation for the toast message
        const confirmation = await generateOrderConfirmation({ orderId: newOrderId });

        return {
            success: true,
            orderId: newOrderId,
            title: confirmation.title,
            message: confirmation.message,
        };

    } catch (error) {
        console.error("Error placing order:", error);
        return {
            success: false,
            title: "Order Failed",
            message: "There was a problem placing your order. Please try again.",
        };
    }
}
