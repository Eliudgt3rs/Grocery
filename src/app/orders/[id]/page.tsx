"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOrderById } from '@/lib/firestore'; // Import getOrderById
import { products } from '@/lib/products'; // Assuming your products are here
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Define a type that combines order item data with product details for display
interface DisplayOrderItem {
    quantity: number;
    price: number; // Price at time of order
    product: { // Product details for display
        id: string;
        name: string;
        image: string;
        // Include other product details you need
    };
}

export default function OrderDetailsPage() {
    const { id } = useParams(); // Get the order ID from the URL
    const [order, setOrder] = useState<any>(null); // State to store the fetched order
    const [displayItems, setDisplayItems] = useState<DisplayOrderItem[]>([]); // State to store items with product details

    useEffect(() => {
        async function fetchOrder() {
            if (id) {
                try {
                    const fetchedOrder = await getOrderById(id as string); // Fetch order from Firestore
                    setOrder(fetchedOrder);

                    if (fetchedOrder && fetchedOrder.items) {
                        // Fetch product details for each item and create display items
                        const itemsToDisplay: DisplayOrderItem[] = fetchedOrder.items.map((item: any) => { // Use 'any' temporarily if types are not fully aligned yet
                            const product = products.find(p => p.id === item.productId); // Find product by ID

                            if (product) {
                                return {
                                    quantity: item.quantity,
                                    price: item.price,
                                    product: {
                                        id: product.id,
                                        name: product.name,
                                        image: product.image,
                                        // Include other product details you need
                                    },
                                };
                            }
                            return null; // Handle cases where product is not found (optional)
                        }).filter((item: DisplayOrderItem | null) => item !== null); // Filter out nulls

                        setDisplayItems(itemsToDisplay);
                    }

                } catch (error) {
                    console.error("Error fetching order:", error);
                    // Handle error (e.g., display an error message)
                }
            }
        }
        fetchOrder();
    }, [id]); // Refetch when ID changes

    if (!order) {
        return <div>Loading order details...</div>; // Loading state
    }

    // Now you can use 'order' and 'displayItems' to render the order details

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 font-headline">Order Details - {order.id}</h1>
            {/* Display order information like date, status, total, etc. */}
            <Card>
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent>
                    <p>Status: {order.status}</p>
                    <p>Total: ${order.total.toFixed(2)}</p>
                    {/* Display other order details */}
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader><CardTitle>Items</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {displayItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <Image src={item.product.image} alt={item.product.name} width={64} height={64} className="rounded-md" />
                                <div className="flex-grow">
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                    <p className="text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
                                </div>
                                <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                    <CardHeader><CardTitle>Delivery Details</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <p className="font-medium">Delivery Address</p>
                        <p className="text-muted-foreground">{order.deliveryAddress}</p>
                        <p className="font-medium mt-4">Estimated Delivery</p>
                        <p className="text-muted-foreground">{new Date(new Date(order.date).getTime() + 2 * 24 * 60 * 60 * 1000).toDateString()}</p>
                    </CardContent>
                </Card>
        </div>
    );
}
