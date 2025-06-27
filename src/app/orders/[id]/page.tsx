import { orders } from "@/lib/orders";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Bike, CheckCircle2, Package, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const statusSteps = [
    { name: "Placed", icon: ShoppingCart },
    { name: "Processing", icon: Package },
    { name: "Out for Delivery", icon: Bike },
    { name: "Delivered", icon: CheckCircle2 },
];

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
    const order = orders.find(o => o.id === params.id);
    
    if (!order) {
        if (!params.id.startsWith("ORD-")) notFound();
    }
    
    const displayOrder = order || {
        id: params.id,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        items: [],
        total: 0,
        deliveryFee: 0,
        deliveryAddress: "Your specified address"
    };

    const currentStatusIndex = statusSteps.findIndex(s => s.name === displayOrder.status);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 font-headline">Order Status</h1>
            <p className="text-muted-foreground mb-6">Order ID: {displayOrder.id}</p>

            <Card className="mb-8">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                        {statusSteps.map((step, index) => (
                            <div key={step.name} className="flex flex-col items-center flex-1">
                                <div className={cn("flex items-center justify-center w-12 h-12 rounded-full border-2",
                                    index <= currentStatusIndex ? "bg-primary border-primary text-primary-foreground" : "bg-muted"
                                )}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <p className={cn("mt-2 text-sm font-medium", index <= currentStatusIndex ? "text-primary" : "text-muted-foreground")}>{step.name}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                    <CardContent>
                        {displayOrder.items.length > 0 ? (
                            <ul className="space-y-4">
                                {displayOrder.items.map(({product, quantity}) => (
                                    <li key={product.id} className="flex items-center gap-4">
                                        <Image src={product.image} alt={product.name} width={64} height={64} className="rounded-md" data-ai-hint={product.aiHint}/>
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                                        </div>
                                        <p className="ml-auto font-medium">${(product.price * quantity).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">Details for this new order will appear shortly.</p>
                        )}
                        <Separator className="my-4"/>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${(displayOrder.total - displayOrder.deliveryFee).toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>${displayOrder.deliveryFee.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-base"><span>Total</span><span>${displayOrder.total.toFixed(2)}</span></div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Delivery Details</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <p className="font-medium">Delivery Address</p>
                        <p className="text-muted-foreground">{displayOrder.deliveryAddress}</p>
                        <p className="font-medium mt-4">Estimated Delivery</p>
                        <p className="text-muted-foreground">{new Date(new Date(displayOrder.date).getTime() + 2 * 24 * 60 * 60 * 1000).toDateString()}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
