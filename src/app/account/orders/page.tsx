import { orders } from "@/lib/orders";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function OrdersPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">My Orders</h1>
            <div className="space-y-6">
                {orders.map(order => (
                    <Card key={order.id}>
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{order.id}</CardTitle>
                                <CardDescription>Ordered on: {new Date(order.date).toLocaleDateString()}</CardDescription>
                            </div>
                            <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {order.items.map(({product, quantity}) => (
                                    <li key={product.id} className="flex justify-between items-center text-sm">
                                        <span>{product.name} x {quantity}</span>
                                        <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <Separator />
                        <CardFooter className="flex justify-between items-center pt-4">
                            <div className="font-bold">Total: ${order.total.toFixed(2)}</div>
                            <Link href={`/orders/${order.id}`} passHref>
                                <Button variant="outline">Track Order</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
