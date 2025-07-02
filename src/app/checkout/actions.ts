
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Define the shape of the data we expect from the client
export interface OrderPayload {
  cartItems: {
    product: {
      id: string;
      price: number;
    };
    quantity: number;
  }[];
  cartTotal: number;
  deliveryFee: number;
  shippingInfo: {
    name: string;
    phone: string;
    address: string;
    zone: string;
  };
  userId: string | null; // User ID is nullable for guest checkouts
}

/**
 * Securely places an order using a Firestore transaction.
 * This runs on the server and has admin privileges.
 */
export async function placeOrderAction(payload: OrderPayload): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const db = adminDb;

    const { cartItems, cartTotal, deliveryFee, shippingInfo, userId } = payload;

    const ordersCollection = db.collection('orders');
    const metadataRef = db.collection('metadata').doc('orders');

    const orderId = await db.runTransaction(async (transaction) => {
      const metadataDoc = await transaction.get(metadataRef);
      
      // Safely get and increment the order number
      const currentOrderNumber = metadataDoc.exists ? (metadataDoc.data()?.lastOrderNumber || 0) : 0;
      const newOrderNumber = currentOrderNumber + 1;

      const newOrderRef = ordersCollection.doc();
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: cartTotal + deliveryFee,
        deliveryFee: deliveryFee,
        deliveryAddress: `${shippingInfo.address}, ${shippingInfo.zone}`,
        status: 'Processing' as const,
        customerName: shippingInfo.name,
        customerPhone: shippingInfo.phone,
        date: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        orderNumber: newOrderNumber,
        ...(userId && { userId }), // Only add userId if it exists
      };

      // Perform the writes within the transaction
      transaction.set(newOrderRef, orderData);
      transaction.set(metadataRef, { lastOrderNumber: newOrderNumber }, { merge: true });

      return newOrderRef.id;
    });

    return { success: true, orderId };
  } catch (error: any) {
    console.error('Order placement transaction failed: ', error);
    return { success: false, error: 'There was a problem placing your order. Please try again.' };
  }
}
