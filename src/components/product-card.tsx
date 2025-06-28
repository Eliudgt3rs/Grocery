"use client";

import Image from 'next/image';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-provider';
import { ShoppingCart, Star } from 'lucide-react';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-48 object-cover"
        />
        <Badge variant="secondary" className="absolute top-2 right-2">{product.category}</Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg leading-tight mb-2">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-yellow-500">
                <Star className="w-4 h-4 fill-current"/>
                <span>{product.rating}</span>
                <span className="text-muted-foreground text-xs">({product.reviews})</span>
            </div>
            <p className="text-lg font-semibold text-primary">Ksh{product.price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => addToCart(product)}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
