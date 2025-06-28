"use client";

import { useEffect, useState } from "react";
import { getSmartRecommendations, SmartRecommendationsOutput } from "@/ai/flows/smart-recommendations";
import { useCart } from "@/context/cart-provider";
import { useAuth } from "@/context/auth-provider";
import { getProducts, getOrders } from "@/lib/firestore";
import ProductCard from "./product-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import type { Product, Order } from "@/types";

export default function SmartRecommendations() {
  const { cartItems, addToCart } = useCart();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<SmartRecommendationsOutput>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products once on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
        try {
            const products = await getProducts();
            setAllProducts(products);
        } catch (err) {
            console.error("Failed to fetch products for recommendations:", err);
            // Non-critical error, don't show to user, just log it.
        }
    };
    fetchAllProducts();
  }, []);


  useEffect(() => {
    // Only fetch recommendations if we have cart items, a logged-in user, and the base product data.
    if (cartItems.length > 0 && user && allProducts.length > 0) {
      setLoading(true);
      setError(null);
      const fetchRecommendations = async () => {
        try {
          // Get user's real order history from Firestore
          const userOrders: Order[] = await getOrders(); 
          const formattedOrderHistory = userOrders.flatMap(order => 
            order.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              orderDate: order.date.toISOString().split('T')[0]
            }))
          );

          const cartData = cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
          }));
          
          const result = await getSmartRecommendations({ 
            cartItems: cartData, 
            orderHistory: formattedOrderHistory,
            numberOfRecommendations: 3
          });
          
          setRecommendations(result);
          
          // Find the full product details from the recommendations
          const products = result.map(rec => allProducts.find(p => p.id === rec.productId)).filter(Boolean) as Product[];
          setRecommendedProducts(products);

        } catch (err) {
          console.error("Failed to get smart recommendations:", err);
          setError("Could not load recommendations at this time.");
        } finally {
          setLoading(false);
        }
      };
      fetchRecommendations();
    } else if (cartItems.length === 0) {
        // Clear recommendations if the cart is emptied
        setRecommendations([]);
        setRecommendedProducts([]);
    }
  }, [cartItems, user, allProducts]);

  if (cartItems.length === 0) {
    return null;
  }

  if (loading) {
    return (
        <Card>
            <CardHeader><CardTitle>You might also like...</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Generating recommendations...</p>
            </CardContent>
        </Card>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <Card>
        <CardHeader><CardTitle>You might also like...</CardTitle></CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedProducts.map((product) => {
                    const recommendation = recommendations.find(r => r.productId === product.id);
                    return (
                        <div key={product.id} className="relative group">
                            <ProductCard product={product} />
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 text-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <div>
                                    <p className="text-sm font-semibold">{recommendation?.reason}</p>
                                    <Button size="sm" className="mt-4" onClick={() => addToCart(product)}>Add to Cart</Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </CardContent>
    </Card>
  );
}
