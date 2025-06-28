'use server';

import * as admin from 'firebase-admin';
import type { Order } from '@/types';

// The service account key is read from the root of the project
try {
    const serviceAccount = require('../../nairobi-grocer-e7a84-firebase-adminsdk-fbsvc-0dd8ec4cec.json');
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
} catch (e) {
    console.error('Could not initialize Firebase Admin SDK. Make sure the service account file exists.', e);
}


const db = admin.firestore();

export async function sendOrderConfirmationNotification(userId: string, order: Order) {
  if (!admin.apps.length) {
    console.error('Firebase Admin SDK not initialized.');
    return;
  }
  
  try {
    const tokenDocRef = db.collection('fcmTokens').doc(userId);
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

    const response = await admin.messaging().send(message);
    console.log('Successfully sent push notification:', response);

  } catch (error) {
    console.error('Error sending push notification:', error);
    // Don't re-throw, as failing to send a notification shouldn't fail the whole checkout process.
  }
}
