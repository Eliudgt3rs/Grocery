"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-provider";
import { useAuth } from "@/context/auth-provider";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
import PageSpinner from "@/components/page-spinner";
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
  const { currentUser, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // Not defaulting
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    zone: "",
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isMPesaModalOpen, setIsMPesaModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

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

  const placeOrder = async () => {
    if (!currentUser) return;

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
      date: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order placed with ID: ", docRef.id);

      toast({
        title: "Order Confirmed!",
        description: "Your order has been placed successfully.",
      });

      clearCart();
      router.push("/account/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Failed",
        description: "There was a problem saving your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.zone || deliveryFee === 0) {
      toast({
        title: "Please fill in all shipping information",
        description: "Make sure to select a valid delivery zone.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Select a payment method",
        description: "Please choose how you’d like to pay before placing the order.",
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

    setIsPlacingOrder(true);

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

  if (loading || (!currentUser && !loading)) {
    return <PageSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info */}
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

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={(value) => {
                  setSelectedPaymentMethod(value);
                  if (value === "mpesa") {
                    setIsMPesaModalOpen(true);
                    setIsCardModalOpen(false);
                  } else if (value === "stripe") {
                    setIsCardModalOpen(true);
                    setIsMPesaModalOpen(false);
                  }
                }}
                className="space-y-4"
              >
                <Label htmlFor="mpesa" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted has-[input:checked]:bg-muted has-[input:checked]:border-primary">
                  <RadioGroupItem value="mpesa" id="mpesa" disabled={isPlacingOrder} />
                  M-Pesa
                </Label>
                <Label htmlFor="stripe" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted has-[input:checked]:bg-muted has-[input:checked]:border-primary">
                  <RadioGroupItem value="stripe" id="stripe" disabled={isPlacingOrder} />
                  Credit/Debit Card (Stripe)
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
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
              <Button type="submit" disabled={cartItems.length === 0 || isPlacingOrder} className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* MPesa Modal */}
      <MPesaPaymentModal
        isOpen={isMPesaModalOpen}
        onClose={() => setIsMPesaModalOpen(false)}
        amount={cartTotal + deliveryFee}
        onPaymentInitiate={(phoneNumber, amount) => {
          console.log("Initiating M-Pesa payment for", amount, "to", phoneNumber);
          placeOrder(); // call order logic after M-Pesa simulated
        }}
      />

      {/* Card Payment Modal */}
      <CardPaymentModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        amount={cartTotal + deliveryFee}
        onPaymentInitiate={(cardDetails) => {
          console.log("Initiating card payment with details:", cardDetails);
          // TODO: Implement actual Stripe payment initiation logic via backend API
        }}
      />
    </div>
  );
}
