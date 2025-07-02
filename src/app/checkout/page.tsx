
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-provider";
import { useAuth } from "@/context/auth-provider";
import { placeOrderAction, type OrderPayload } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import MPesaPaymentModal from "@/components/mpesa-payment-modal";
import CardPaymentModal from "@/components/card-payment-modal";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const deliveryZones = [
  { name: "Westlands", fee: 5.0 },
  { name: "Kilimani", fee: 4.5 },
  { name: "CBD", fee: 3.0 },
  { name: "Lavington", fee: 5.5 },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    zone: "",
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isMPesaModalOpen, setIsMPesaModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const processOrderPlacement = async () => {
    setIsPlacingOrder(true);

    const payload: OrderPayload = {
      cartItems: cartItems.map(item => ({
        product: { id: item.product.id, price: item.product.price },
        quantity: item.quantity,
      })),
      cartTotal: cartTotal,
      deliveryFee: deliveryFee,
      shippingInfo: shippingInfo,
      userId: user ? user.uid : null,
    };
    
    const result = await placeOrderAction(payload);
    
    if (result.success) {
      toast({
        title: "Order Confirmed!",
        description: "Your order has been placed successfully.",
      });
      clearCart();
      router.push(user ? "/account/orders" : "/");
    } else {
      toast({
        title: "Order Failed",
        description: result.error || "There was a problem saving your order. Please try again.",
        variant: "destructive",
      });
    }

    setIsPlacingOrder(false);
    setIsMPesaModalOpen(false);
    setIsCardModalOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.zone) {
      toast({
        title: "Please fill in all shipping information",
        description: "Make sure to select a valid delivery zone.",
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
    
    // Guest checkout logic: Send order via WhatsApp
    if (!user) {
        setIsPlacingOrder(true);
        const message = `GUEST ORDER\n\nShipping Details:\nName: ${shippingInfo.name}\nPhone: ${shippingInfo.phone}\nAddress: ${shippingInfo.address}, ${shippingInfo.zone}\n\nOrder Items:\n${cartItems
          .map(
            ({ product, quantity }) =>
              `- ${quantity} x ${product.name} (${formatCurrency(product.price * quantity)})`
          )
          .join("\n")}\n\nTotal: ${formatCurrency(cartTotal + deliveryFee)}`;

        const whatsappNumber = "+254719790026"; // Replace with the actual WhatsApp number
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          message
        )}`;
        
        // Give a moment for the user to see the loading state
        setTimeout(() => {
            window.open(whatsappUrl, "_blank");

            toast({
              title: "Complete Your Order in WhatsApp!",
              description: "Your order details have been prepared. Please send the message in WhatsApp to confirm.",
            });

            clearCart();
            router.push("/");
            setIsPlacingOrder(false);
        }, 1000);

        return;
    }

    // Logged-in user checkout logic
    if (!selectedPaymentMethod) {
      toast({
        title: "Select a payment method",
        description: "Please choose how you’d like to pay before placing the order.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPaymentMethod === "mpesa") {
      setIsMPesaModalOpen(true);
    } else if (selectedPaymentMethod === "stripe") {
      setIsCardModalOpen(true);
    }
  };

  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Checkout</h1>
      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required value={shippingInfo.name} onChange={handleShippingInputChange} disabled={isPlacingOrder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" required value={shippingInfo.phone} onChange={handleShippingInputChange} disabled={isPlacingOrder} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" required value={shippingInfo.address} onChange={handleShippingInputChange} disabled={isPlacingOrder} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="zone">Delivery Zone</Label>
                <Select
                  value={shippingInfo.zone}
                  onValueChange={(value) => {
                    setShippingInfo((prev) => ({ ...prev, zone: value }));
                    const foundZone = deliveryZones.find((z) => z.name === value);
                    setDeliveryFee(foundZone ? foundZone.fee : 0);
                  }}
                  disabled={isPlacingOrder}
                >
                  <SelectTrigger id="zone">
                    <SelectValue placeholder="Select your zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryZones.map((zone) => (
                      <SelectItem key={zone.name} value={zone.name}>
                        {zone.name} - {formatCurrency(zone.fee)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {user && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                  className="space-y-4"
                  disabled={isPlacingOrder}
                >
                  <Label htmlFor="mpesa" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted has-[input:checked]:bg-muted has-[input:checked]:border-primary">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    M-Pesa
                  </Label>
                  <Label htmlFor="stripe" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted has-[input:checked]:bg-muted has-[input:checked]:border-primary">
                    <RadioGroupItem value="stripe" id="stripe" />
                    Credit/Debit Card (Stripe)
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {!user && (
             <Card>
              <CardHeader>
                  <CardTitle>How to Order</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-muted-foreground">
                      As a guest, you will be redirected to WhatsApp to place your order directly with the seller. No payment is required on this website.
                  </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 text-sm">
                    <Image src={item.product.image} alt={item.product.name} width={48} height={48} className="rounded-md" />
                    <div className="flex-grow">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p>{formatCurrency(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal + deliveryFee)}</span>
                </div>
              </div>
              <Button type="submit" disabled={cartItems.length === 0 || isPlacingOrder || (user && !selectedPaymentMethod)} className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isPlacingOrder ? "Processing..." : user ? "Place Order" : "Send Order via WhatsApp"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>

      <MPesaPaymentModal
        isOpen={isMPesaModalOpen}
        onClose={() => setIsMPesaModalOpen(false)}
        amount={cartTotal + deliveryFee}
        onPaymentInitiate={() => {
          console.log("Initiating M-Pesa payment simulation");
          processOrderPlacement();
        }}
      />

      <CardPaymentModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        amount={cartTotal + deliveryFee}
        onPaymentInitiate={() => {
          console.log("Initiating card payment simulation");
          processOrderPlacement();
        }}
      />
    </div>
  );
}
