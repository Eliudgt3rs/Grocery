"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { getOrders } from "@/lib/firestore";
import type { Order, Product } from '@/types';
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userOrders = await getOrders();
                
                const productsCollection = collection(db, "products");
                const productsQuery = query(productsCollection);
                const querySnapshot = await getDocs(productsQuery);
                const fetchedProducts: Product[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
                });
                
                setOrders(userOrders);
                setProducts(fetchedProducts);
                console.log("Fetched orders:", userOrders);
            } catch (err: any) {
                setError(err.message);
                console.error("Error fetching user orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getProductById = (productId: string) => {
        return products.find(p => p.id === productId);
    };

    if (loading) {
        return <div className="text-center py-16"><p className="text-xl text-muted-foreground">Loading orders...</p></div>;
    }

    if (error) {
        return <div className="text-center py-16 text-red-500"><p className="text-xl">Error loading orders: {error}</p></div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">My Orders</h1>
            <div className="space-y-6">
                {orders.length > 0 ? (
                    orders.map(order => (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                            <div>
                                <CardTitle className="text-xl">Order #{order.orderNumber}</CardTitle>
                                <CardDescription>Ordered on: {order.date.toLocaleDateString()}</CardDescription>
                            </div>
                            <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {order.items.map((item) => {
                                    const product = getProductById(item.productId);
                                    return (
                                        <li key={item.productId} className="flex justify-between items-center text-sm">
                                            <span>{product ? product.name : 'Unknown Product'} x {item.quantity}</span>
                                            <span className="font-medium">KSH{(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                        <Separator />
                        <CardFooter className="flex justify-between items-center pt-4">
                            <div className="font-bold">Total: ${order.total.toFixed(2)}</div>
                            <Link href={`/orders/${order.id}`} passHref>
                                <Button variant="outline">View Details</Button>
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
