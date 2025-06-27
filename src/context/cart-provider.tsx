"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { CartItem, Product } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
            toast({
              title: "Stock Limit Reached",
              description: `You cannot add more of ${product.name}.`,
              variant: "destructive",
            });
            return prevItems;
        }
        return prevItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  }, [toast]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  }, [toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prevItems => {
        const itemToUpdate = prevItems.find(item => item.product.id === productId);
        if(itemToUpdate && quantity > itemToUpdate.product.stock) {
            toast({
                title: "Stock Limit Reached",
                description: `Only ${itemToUpdate.product.stock} of ${itemToUpdate.product.name} available.`,
                variant: "destructive",
            });
            return prevItems;
        }

        if (quantity <= 0) {
            return prevItems.filter(item => item.product.id !== productId);
        }
        
        return prevItems.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        );
    });
  }, [toast]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
