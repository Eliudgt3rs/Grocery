"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-provider";
import { useAuth } from "@/context/auth-provider";
import { createOrder } from "@/lib/firestore";
import { generateOrderConfirmation } from "@/ai/flows/order-confirmation-flow";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const deliveryZones = [
  { name: "Westlands", fee: 5.0 },
  { name: "Kilimani", fee: 4.5 },
  { name: "CBD", fee: 3.0 },
  { name: "Lavington", fee: 5.5 },
];

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    zone: "",
  });

  useEffect(() => {
    if (!loading && !currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed to checkout.",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [currentUser, loading, router, toast]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.zone) {
      toast({
        title: "Please fill in all shipping information",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    const { id: toastId, update } = toast({
      title: "Placing your order...",
      description: "Please hold on while we confirm everything.",
    });

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: cartTotal + deliveryFee,
      deliveryFee: deliveryFee,
      deliveryAddress: `${shippingInfo.address}, ${shippingInfo.zone}`,
      status: "Processing" as const,
      customerName: shippingInfo.name,
      customerPhone: shippingInfo.phone,
      userId: currentUser.uid,
    };

    try {
      const newOrderId = await createOrder(orderData);
      
      const confirmation = await generateOrderConfirmation({ orderId: newOrderId });

      update({
        id: toastId,
        title: confirmation.title,
        description: confirmation.message,
      });
      
      clearCart();
      router.push('/account/orders');
    } catch (error) {
      console.error("Error placing order:", error);
      update({
        id: toastId,
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShippingInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [id]: value }));
  };

  if (loading || (!currentUser && !loading)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Checkout</h1>
      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={shippingInfo.name}
                  onChange={handleShippingInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={shippingInfo.phone}
                  onChange={handleShippingInputChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  required
                  value={shippingInfo.address}
                  onChange={handleShippingInputChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="zone">Delivery Zone</Label>
                <Select
                  required
                  value={shippingInfo.zone}
                  onValueChange={(value) => {
                    setShippingInfo((prev) => ({ ...prev, zone: value }));
                    const foundZone = deliveryZones.find((z) => z.name === value);
                    setDeliveryFee(foundZone ? foundZone.fee : 0);
                  }}
                >
                  <SelectTrigger id="zone">
                    <SelectValue placeholder="Select your zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryZones.map((zone) => (
                      <SelectItem key={zone.name} value={zone.name}>
                        {zone.name} - ${zone.fee.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="mpesa" className="space-y-4">
                <Label
                  htmlFor="mpesa"
                  className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted has-[input:checked]:bg-muted has-[input:checked]:border-primary"
                >
                  <RadioGroupItem value="mpesa" id="mpesa" />
                  M-Pesa
                </Label>
                <Label
                  htmlFor="stripe"
                  className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted has-[input:checked]:bg-muted has-[input:checked]:border-primary"
                >
                  <RadioGroupItem value="stripe" id="stripe" />
                  Credit/Debit Card (Stripe)
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="rounded-md"
                    />
                    <div className="flex-grow">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(cartTotal + deliveryFee).toFixed(2)}</span>
                </div>
              </div>
              <Button
                type="submit"
                disabled={cartItems.length === 0}
                className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
