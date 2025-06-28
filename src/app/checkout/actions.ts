'use server';

import { createOrder, getOrderById } from '@/lib/firestore';
import { generateOrderConfirmation, OrderConfirmationOutput } from '@/ai/flows/order-confirmation-flow';
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
    let newOrderId: string;
    try {
        // 1. Critical Step: Create the order in Firestore
        newOrderId = await createOrder(orderData);
        if (!newOrderId) {
            throw new Error('Failed to create order in database.');
        }
    } catch (error) {
        console.error("Critical Error: Failed to create order in Firestore:", error);
        return {
            success: false,
            title: "Order Failed",
            message: "There was a problem saving your order. Please try again.",
        };
    }

    // --- Post-Order, Non-Critical Steps ---
    // If these fail, the order is still considered successful.

    let confirmation: OrderConfirmationOutput = { // Default success message
        title: "Order Confirmed!",
        message: `Your order has been placed successfully and is now being processed. We'll notify you when it's on its way.`,
    };

    try {
        // 2. Fetch the newly created order for notifications
        const newOrder = await getOrderById(newOrderId);
        if (!newOrder) {
            // If fetching fails, we can't send notifications, but we log it and move on.
            console.warn(`Could not retrieve order ${newOrderId} for notifications.`);
        } else {
            // 3. Attempt to send a push notification (fire-and-forget)
            // This function should handle its own errors internally.
            sendOrderConfirmationNotification(orderData.userId, newOrder);

            // 4. Attempt to generate the AI confirmation for the toast message
            const aiConfirmation = await generateOrderConfirmation({ orderId: newOrderId });
            // If the AI call is successful, use its message
            confirmation = aiConfirmation;
        }
    } catch (error) {
        // Log the non-critical error, but don't fail the entire process
        // The user will see the default success message
        console.error("Non-critical error during post-order processing (AI generation or push notification):", error);
    }
    
    return {
        success: true,
        orderId: newOrderId,
        title: confirmation.title,
        message: confirmation.message,
    };
}
