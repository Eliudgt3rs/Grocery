import { db } from "@/lib/firebase";
import { collection, getDocs, getDoc, doc, Timestamp, addDoc, query, where, runTransaction } from "firebase/firestore";
import type { Order, Product } from '@/types';
import { auth } from "@/lib/firebase";

const productsCollection = collection(db, "products");
const ordersCollection = collection(db, "orders");
const metadataCollection = collection(db, "metadata");

// Function to fetch all products from Firestore
export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(productsCollection);
    const products: Product[] = querySnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() } as Product;
    });
    return products;
  } catch (error) {
    console.error("Error getting products: ", error);
    throw error;
  }
};


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
      const date = (data.date && typeof data.date.toDate === 'function') ? data.date.toDate() : new Date();
      return {
        id: doc.id,
        userId: data.userId || undefined,
        date: date,
        status: data.status || 'Processing',
        items: data.items || [],
        total: data.total || 0,
        deliveryFee: data.deliveryFee || 0,
        deliveryAddress: data.deliveryAddress || 'N/A',
        customerName: data.customerName || 'N/A',
        customerPhone: data.customerPhone || 'N/A',
        orderNumber: data.orderNumber || 0,
        createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : undefined,
        updatedAt: (data.updatedAt && typeof data.updatedAt.toDate === 'function') ? data.updatedAt.toDate() : undefined,
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
      const date = (data.date && typeof data.date.toDate === 'function') ? data.date.toDate() : new Date();
      return {
        id: orderDocSnap.id,
        userId: data.userId || undefined,
        date: date,
        status: data.status || 'Processing',
        items: data.items || [],
        total: data.total || 0,
        deliveryFee: data.deliveryFee || 0,
        deliveryAddress: data.deliveryAddress || 'N/A',
        customerName: data.customerName || 'N/A',
        customerPhone: data.customerPhone || 'N/A',
        orderNumber: data.orderNumber || 0,
        createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : undefined,
        updatedAt: (data.updatedAt && typeof data.updatedAt.toDate === 'function') ? data.updatedAt.toDate() : undefined,
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

// Function to fetch ALL orders for the admin dashboard
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const querySnapshot = await getDocs(ordersCollection);

    const orders: Order[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const date = (data.date && typeof data.date.toDate === 'function') ? data.date.toDate() : new Date();
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

    // Sort orders by date in descending order (newest first)
    orders.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return orders;
  } catch (error) {
    console.error("Error getting all orders: ", error);
    throw error;
  }
};
