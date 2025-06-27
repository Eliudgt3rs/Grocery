"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, categories } from '@/lib/products';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-12 py-8">
      <section className="relative h-80 rounded-lg overflow-hidden">
        <Image src="https://placehold.co/1200x400.png" alt="Fresh groceries promotion" layout="fill" objectFit="cover" className="z-0" data-ai-hint="grocery store" />
        <div className="absolute inset-0 bg-black/40 z-10"/>
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Fresh Groceries Delivered Fast</h1>
          <p className="mt-4 max-w-2xl text-lg">Your favorite local Nairobi vendor, now online. Quality produce, unbeatable prices.</p>
          <Button size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 px-8">
            Shop All Products
          </Button>
        </div>
      </section>

      <section>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <h2 className="text-3xl font-bold font-headline">Our Products</h2>
            <div className="relative w-full md:w-1/3">
                <Input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">No products found. Try a different search or category.</p>
            </div>
        )}
      </section>
    </div>
  );
}
