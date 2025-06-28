"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import SmartRecommendations from "@/components/smart-recommendations";

export default function CartPage() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const total = cartTotal;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {cartItems.length > 0 ? (
                <div className="divide-y">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex flex-col sm:flex-row gap-4 p-4">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 self-center sm:self-start">
                        <Image src={product.image} alt={product.name} layout="fill" className="rounded-lg object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col gap-2 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-base sm:text-lg">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="text-muted-foreground sm:hidden -mt-2 -mr-2" onClick={() => removeFromCart(product.id)}>
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity - 1)} disabled={quantity <= 1}><Minus className="h-4 w-4"/></Button>
                            <Input type="number" value={quantity} readOnly className="h-8 w-12 text-center" />
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity + 1)}><Plus className="h-4 w-4"/></Button>
                          </div>
                          <p className="font-semibold text-base sm:text-lg">${(product.price * quantity).toFixed(2)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hidden sm:flex" onClick={() => removeFromCart(product.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-12">
                  <p className="text-lg text-muted-foreground">Your cart is empty.</p>

                  <Link href="/" passHref><Button className="mt-4">Continue Shopping</Button></Link>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8">
            <SmartRecommendations />
          </div>

        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout" passHref>
                <Button disabled={cartItems.length === 0} className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                  Proceed to Checkout
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
