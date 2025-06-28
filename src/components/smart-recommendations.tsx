"use client";

import { useEffect, useState } from "react";
import { getSmartRecommendations, SmartRecommendationsOutput } from "@/ai/flows/smart-recommendations";
import { useCart } from "@/context/cart-provider";
import { products as allProducts } from "@/lib/products";
import { orders as orderHistoryData } from "@/lib/orders";
import ProductCard from "./product-card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import type { Product } from "@/types";

const mockOrderHistory = orderHistoryData.flatMap(order => 
  order.items.map(item => ({
    productId: item.product.id,
    quantity: item.quantity,
    orderDate: order.date.toISOString().split('T')[0]
  }))
);

export default function SmartRecommendations() {
  const { cartItems, addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<SmartRecommendationsOutput>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      setLoading(true);
      setError(null);
      const fetchRecommendations = async () => {
        try {
          const cartData = cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
          }));
          
          const result = await getSmartRecommendations({ 
            cartItems: cartData, 
            orderHistory: mockOrderHistory,
            numberOfRecommendations: 3
          });
          
          setRecommendations(result);
          
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
    } else {
        setRecommendations([]);
        setRecommendedProducts([]);
    }
  }, [cartItems]);

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
