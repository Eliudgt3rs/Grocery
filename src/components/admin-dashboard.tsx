"use client";

import { useEffect, useState, useMemo } from 'react';
import { getAllOrders, getProducts } from '@/lib/firestore';
import type { Order, Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [fetchedOrders, fetchedProducts] = await Promise.all([
                    getAllOrders(),
                    getProducts()
                ]);
                setOrders(fetchedOrders);
                setProducts(fetchedProducts);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const productMap = useMemo(() => {
        return products.reduce((map, product) => {
            map[product.id] = product.name;
            return map;
        }, {} as Record<string, string>);
    }, [products]);

    const { totalRevenue, totalOrders, averageOrderValue, salesByDay } = useMemo(() => {
        if (!orders.length) {
            return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, salesByDay: [] };
        }

        const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalRevenue / totalOrders;

        const salesData = orders.reduce((acc, order) => {
            const day = format(order.date, 'yyyy-MM-dd');
            if (!acc[day]) {
                acc[day] = { date: format(order.date, 'MMM d'), total: 0 };
            }
            acc[day].total += order.total;
            return acc;
        }, {} as Record<string, { date: string; total: number }>);
        
        const salesByDay = Object.values(salesData).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return { totalRevenue, totalOrders, averageOrderValue, salesByDay };
    }, [orders]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return <div className="text-center py-16 text-red-500"><p className="text-xl">{error}</p></div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sales Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesByDay}>
                            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatCurrency(value as number)}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                            <Legend />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Sales" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.slice(0, 10).map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>
                                        <ul className="list-disc list-inside text-xs space-y-1">
                                            {order.items.map(item => (
                                                <li key={item.productId}>
                                                    {item.quantity} x {productMap[item.productId] || 'Unknown Product'}
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell>{format(order.date, 'PP')}</TableCell>
                                    <TableCell><Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge></TableCell>
                                    <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
