
'use server';

import { getAdminDb, getAdminMessaging } from './firebase-admin';
import type { Order } from '@/types';


export async function sendOrderConfirmationNotification(userId: string, order: Order) {
  try {
    const adminDb = getAdminDb();
    const adminMessaging = getAdminMessaging();

    const tokenDocRef = adminDb.collection('fcmTokens').doc(userId);
    const tokenDoc = await tokenDocRef.get();

    if (!tokenDoc.exists) {
      console.log(`No FCM token found for user: ${userId}. Skipping push notification.`);
      return;
    }

    const { token } = tokenDoc.data()!;
    const orderLink = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/account/orders/${order.id}`;

    const message = {
      notification: {
        title: 'Order Confirmed!',
        body: `Your order #${order.orderNumber} is being processed. Total: $${order.total.toFixed(2)}`,
      },
      webpush: {
        notification: {
            icon: '/icon-192x192.png',
        },
        fcm_options: {
          link: orderLink,
        },
      },
      token: token,
    };

    const response = await adminMessaging.send(message);
    console.log('Successfully sent push notification:', response);

  } catch (error) {
    console.error('Error sending push notification:', error);
    // Don't re-throw, as failing to send a notification shouldn't fail the whole checkout process.
  }
}
