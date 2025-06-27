"use client";

import { useCart } from "@/context/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const deliveryZones = [
  { name: "Westlands", fee: 5.00 },
  { name: "Kilimani", fee: 4.50 },
  { name: "CBD", fee: 3.00 },
  { name: "Lavington", fee: 5.50 },
];

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [deliveryFee, setDeliveryFee] = useState(0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
        toast({ title: "Your cart is empty", variant: "destructive"});
        return;
    }
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. We've received your order.",
    });
    const newOrderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
    clearCart();
    router.push(`/orders/${newOrderId}`);
  };
  
  const total = cartTotal + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Shipping Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" required /></div>
              <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" required /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="address">Address</Label><Input id="address" required /></div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="zone">Delivery Zone</Label>
                <Select required onValueChange={(value) => setDeliveryFee(deliveryZones.find(z => z.name === value)?.fee || 0)}>
                  <SelectTrigger id="zone"><SelectValue placeholder="Select your zone" /></SelectTrigger>
                  <SelectContent>
                    {deliveryZones.map(zone => <SelectItem key={zone.name} value={zone.name}>{zone.name} - ${zone.fee.toFixed(2)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup defaultValue="mpesa" className="space-y-4">
                <Label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted has-[input:checked]:bg-muted has-[input:checked]:border-primary">
                  <RadioGroupItem value="mpesa" id="mpesa" />
                  M-Pesa
                </Label>
                <Label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted has-[input:checked]:bg-muted has-[input:checked]:border-primary">
                  <RadioGroupItem value="stripe" id="stripe" />
                  Credit/Debit Card (Stripe)
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 text-sm">
                    <Image src={product.image} alt={product.name} width={48} height={48} className="rounded-md" data-ai-hint={product.aiHint}/>
                    <div className="flex-grow">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-muted-foreground">Qty: {quantity}</p>
                    </div>
                    <p>${(product.price * quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
                <Separator/>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <Button type="submit" disabled={cartItems.length === 0} className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
