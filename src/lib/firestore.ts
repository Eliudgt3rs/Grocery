import { db } from "@/lib/firebase";
import { collection, getDocs, getDoc, doc, Timestamp, addDoc, query, where, runTransaction } from "firebase/firestore";
import type { Order } from '@/types';
import { auth } from "@/lib/firebase";

const ordersCollection = collection(db, "orders");

// Function to fetch orders for the current user from Firestore
export const getOrders = async (): Promise<Order[]> => {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.log("No authenticated user to fetch orders for.");
      return [];
    }

    const userOrdersQuery = query(
      ordersCollection,
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(userOrdersQuery);

    const orders: Order[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        date: (data.date as Timestamp).toDate(),
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

    // Sort orders by date in descending order (newest first) on the client-side
    orders.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return orders;
  } catch (error) {
    console.error("Error getting orders: ", error);
    throw error;
  }
};

// Function to fetch a single order by its Firestore document ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderDocRef = doc(db, "orders", orderId);
    const orderDocSnap = await getDoc(orderDocRef);

    if (orderDocSnap.exists()) {
      const data = orderDocSnap.data();
      return {
        id: orderDocSnap.id,
        userId: data.userId,
        date: (data.date as Timestamp).toDate(),
        status: data.status,
        items: data.items,
        total: data.total,
        deliveryFee: data.deliveryFee,
        deliveryAddress: data.deliveryAddress,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        orderNumber: data.orderNumber,
      } as Order;
    } else {
      console.log("No such order!");
      return null;
    }
  } catch (error) {
    console.error(`Error getting order with ID ${orderId}: `, error);
    throw error;
  }
};

const metadataCollection = collection(db, "metadata");

export async function createOrder(orderData: Omit<Order, 'id' | 'date' | 'createdAt' | 'updatedAt' | 'orderNumber'>) {
  const newOrderRef = doc(ordersCollection); // Create ref outside to have access to the ID.
  try {
    await runTransaction(db, async (transaction) => {
      const counterRef = doc(metadataCollection, "orderCounter");
      const counterDoc = await transaction.get(counterRef);

      let currentCount = 0;
      if (counterDoc.exists()) {
        currentCount = counterDoc.data().count || 0;
      }

      const newCount = currentCount + 1;
      transaction.set(counterRef, { count: newCount }, { merge: true });

      // Use the ref created outside the transaction
      transaction.set(newOrderRef, {
        ...orderData,
        date: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        orderNumber: newCount,
      });
    });

    console.log("Order created with ID: ", newOrderRef.id);
    return newOrderRef.id; // Return the document ID
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}
