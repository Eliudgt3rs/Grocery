import { db } from "@/lib/firebase";
import { collection, getDocs, getDoc, doc, Timestamp, addDoc, query, where, runTransaction } from "firebase/firestore"; // Import runTransaction
import type { Order } from '@/types';
import { auth } from "@/lib/firebase"; // Import auth to get the current user

const ordersCollection = collection(db, "orders");

// Function to fetch orders for the current user from Firestore
export const getOrders = async (): Promise<Order[]> => {
  try {
    const user = auth.currentUser; // Get the current authenticated user

    if (!user) {
      // If no user is authenticated, return an empty array or throw an error
      console.log("No authenticated user to fetch orders for.");
      return [];
    }

    // Create a query to get orders where userId matches the current user's UID
    const userOrdersQuery = query(
      ordersCollection,
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(userOrdersQuery); // Use the filtered query

    const orders: Order[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        date: (data.date as Timestamp).toDate().toISOString().split('T')[0], // Convert Timestamp to string date
        status: data.status,
        items: data.items,
        total: data.total,
        deliveryAddress: data.deliveryAddress,
      } as Order;
    });
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
        date: (data.date as Timestamp).toDate().toISOString().split('T')[0], // Convert Timestamp to string date
        status: data.status,
        status: data.status,
        items: data.items,
        total: data.total,
        deliveryFee: data.deliveryFee,

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

const metadataCollection = collection(db, "metadata"); // Assuming you have a metadata collection

export async function createOrder(orderData: Omit<Order, 'id' | 'date' | 'createdAt' | 'updatedAt' | 'orderNumber'>) {
  try {
    const orderNumber = await runTransaction(db, async (transaction) => {
      const counterRef = doc(metadataCollection, "orderCounter"); // Reference to your counter document
      const counterDoc = await transaction.get(counterRef);

      let currentCount = 0;
      if (counterDoc.exists()) {
        currentCount = counterDoc.data().count || 0;
      }

      const newCount = currentCount + 1;
      transaction.update(counterRef, { count: newCount }); // Increment and update the counter

      // Create the new order document with the sequential order number
      const newOrderRef = doc(ordersCollection); // Use doc() without ID to let Firestore generate one
      transaction.set(newOrderRef, {
        ...orderData,
        date: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        orderNumber: newCount, // Add the sequential order number
      });

      return newCount; // Return the new sequential order number
    });

    console.log("Order created with sequential number: ", orderNumber);
    return orderNumber; // Return the sequential order number
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

