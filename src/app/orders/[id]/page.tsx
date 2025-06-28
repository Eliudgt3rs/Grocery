"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOrderById, getProducts } from '@/lib/firestore';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order, Product } from '@/types';

// Define a type that combines order item data with product details for display
interface DisplayOrderItem {
    quantity: number;
    price: number; // Price at time of order
    product: { // Product details for display
        id: string;
        name: string;
        image: string;
        aiHint?: string;
    };
}

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [displayItems, setDisplayItems] = useState<DisplayOrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrderData() {
            if (!id) return;
            setLoading(true);
            setError(null);

            try {
                // Fetch order and all products in parallel for efficiency
                const [fetchedOrder, allProducts] = await Promise.all([
                    getOrderById(id as string),
                    getProducts()
                ]);
                
                setOrder(fetchedOrder);

                if (fetchedOrder?.items) {
                    const itemsToDisplay = fetchedOrder.items.map((item) => {
                        const product = allProducts.find(p => p.id === item.productId);
                        if (product) {
                            return {
                                quantity: item.quantity,
                                price: item.price,
                                product: {
                                    id: product.id,
                                    name: product.name,
                                    image: product.image,
                                    aiHint: product.aiHint,
                                },
                            };
                        }
                        return null; // Handle cases where a product might not exist anymore
                    }).filter((item): item is DisplayOrderItem => item !== null); // Filter out any nulls

                    setDisplayItems(itemsToDisplay);
                } else if (fetchedOrder === null) {
                    setError("Order not found.");
                }

            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("Failed to load order details.");
            } finally {
                setLoading(false);
            }
        }
        fetchOrderData();
    }, [id]);

    if (loading) {
        return <div className="text-center py-16"><p className="text-xl text-muted-foreground">Loading order details...</p></div>;
    }

    if (error || !order) {
        return <div className="text-center py-16 text-red-500"><p className="text-xl">{error || 'Order could not be found.'}</p></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold mb-2 font-headline">Order Details</h1>
            <p className="text-sm text-muted-foreground">Order #{order.orderNumber} &bull; Placed on {order.date.toLocaleDateString()}</p>
            
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                     <Card>
                        <CardHeader><CardTitle>Items Ordered</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {displayItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <Image src={item.product.image} alt={item.product.name} width={64} height={64} className="rounded-md object-cover" />
                                        <div className="flex-grow">
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-muted-foreground">Qty: {item.quantity} &times; ${item.price.toFixed(2)}</p>
                                        </div>
                                        <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                           <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${(order.total - order.deliveryFee).toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery Fee</span>
                                <span>${order.deliveryFee.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Delivery Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="font-medium">Delivery Address</p>
                            <p className="text-muted-foreground">{order.deliveryAddress}</p>
                            <p className="font-medium mt-4">Current Status</p>
                            <p className="text-muted-foreground font-semibold">{order.status}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
