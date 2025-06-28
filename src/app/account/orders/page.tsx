"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { getOrders } from "@/lib/firestore";
import type { Order } from '@/types';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const userOrders = await getOrders();
                setOrders(userOrders);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                    console.error("Error fetching user orders:", err);
                } else {
                    setError("An unknown error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 text-red-500">
                <p className="text-xl">Error loading orders: {error}</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">My Orders</h1>
            <div className="space-y-6">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{order.orderNumber}</CardTitle>
                                    <CardDescription>
                                        Ordered on: {new Date(order.date).toLocaleDateString() || "N/A"}
                                    </CardDescription>
                                </div>
                                <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                                    {order.status}
                                </Badge>
                            </CardHeader>

                            <CardContent>
                                <ul className="space-y-2">
                                    {order.items.map(({ product, quantity }, itemIndex) => {
                                        // Add checks for product and product.name
                                        if (!product || !product.name) {
                                            console.warn("Skipping order item due to missing product or product name:", { product, quantity });
                                            return null; // Skip rendering this item
                                        }

                                        return (
                                        <li key={product.id || itemIndex} className="flex justify-between items-center text-sm">
                                            <span>{product.name} x {quantity}</span>
                                            <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
                                        </li>
                                    );})}
                                </ul>
                            </CardContent>

                            <Separator />

                            <CardFooter className="flex justify-between items-center pt-4">
                                <div className="font-bold">Total: ${order.total.toFixed(2)}</div>
                                <Link href={`/orders/${order.id}`}>
                                    <Button variant="outline">Track Order</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-muted-foreground">You have not placed any orders yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
