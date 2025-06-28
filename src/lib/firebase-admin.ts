import * as admin from 'firebase-admin';
import type { Order } from '@/types';

// This is a subset of the Order type, representing the data coming from the client action.
type CreateOrderInput = Omit<Order, 'id' | 'date' | 'createdAt' | 'updatedAt' | 'orderNumber'>;

const ensureAdminIsInitialized = () => {
    if (admin.apps.length > 0) {
        return;
    }

    try {
        const serviceAccount = require('../../nairobi-grocer-e7a84-firebase-adminsdk-fbsvc-0dd8ec4cec.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK has been initialized.');
    } catch (e) {
        console.error('Firebase Admin SDK initialization failed:', e);
    }
};

export const getAdminDb = () => {
    ensureAdminIsInitialized();
    return admin.firestore();
};

export async function createOrderWithAdmin(orderData: CreateOrderInput): Promise<string> {
  const db = getAdminDb();
  const ordersCollection = db.collection('orders');
  const metadataCollection = db.collection('metadata');
  
  const newOrderRef = ordersCollection.doc();

  try {
    await db.runTransaction(async (transaction) => {
      const counterRef = metadataCollection.doc("orderCounter");
      const counterDoc = await transaction.get(counterRef);

      let currentCount = 0;
      if (counterDoc.exists) {
        const data = counterDoc.data();
        if (data && typeof data.count === 'number') {
            currentCount = data.count;
        }
      }

      const newCount = currentCount + 1;
      transaction.set(counterRef, { count: newCount }, { merge: true });

      const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();

      transaction.set(newOrderRef, {
        ...orderData,
        date: serverTimestamp,
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
        orderNumber: newCount,
      });
    });

    console.log("Order created with ID: ", newOrderRef.id);
    return newOrderRef.id;
  } catch (e) {
    console.error("Error creating order with admin SDK: ", e);
    // Throw a more specific error to be handled by the action
    throw new Error("Failed to save order to the database.");
  }
}
