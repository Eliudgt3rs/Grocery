"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-provider";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "./ui/input";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

export default function CartSheet({ onClose }: { onClose: () => void }) {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();

  return (
    <SheetContent className="flex flex-col">
      <SheetHeader>
        <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
      </SheetHeader>
      {cartItems.length > 0 ? (
        <>
          <ScrollArea className="flex-grow pr-4">
            <div className="flex flex-col gap-4 py-4">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-start gap-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {quantity} &times; ${product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(product.id, quantity - 1)} disabled={quantity <= 1}><Minus className="h-3 w-3"/></Button>
                        <Input
                            type="number"
                            value={quantity}
                            readOnly
                            onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 0)}
                            className="h-6 w-12 text-center px-1"
                        />
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(product.id, quantity + 1)}><Plus className="h-3 w-3"/></Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(product.price * quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8 mt-1" onClick={() => removeFromCart(product.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <SheetFooter className="mt-auto">
            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Shipping and taxes calculated at checkout.
              </p>
              <Link href="/cart" passHref>
                <Button
                  className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={onClose} // Call the onClose function to close the sheet
                >
                  View Cart & Checkout
                </Button>
              </Link>
            </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-20 w-20 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some groceries to get started.</p>
            <Link href="/" passHref>
                <Button className="mt-6" onClick={onClose}>Start Shopping</Button>
            </Link>
        </div>
      )}
    </SheetContent>
  );
}
