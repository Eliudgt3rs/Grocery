
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/index";

import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Image from 'next/image';

const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Pantry', 'Beverages', 'Snacks'];
const ITEMS_PER_PAGE = 20;

export default function Home() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (!product || !product.name) {
        return false;
      }
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, products]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page whenever filters change
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsQuery = query(productsCollection);
        const querySnapshot = await getDocs(productsQuery);
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(fetchedProducts);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };

  return (
    <div className="space-y-12 py-8">
      <section className="relative h-64 sm:h-80 rounded-lg overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&h=400&fit=crop"
          alt="Fresh groceries promotion"
          fill
          style={{ objectFit: "cover" }}
          className="z-0"
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <h1 className="text-4xl sm:text-5xl font-bold font-headline">Fresh Groceries Delivered Fast</h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg">Your favorite local Nairobi vendor, now online. Quality produce, unbeatable prices.</p>
          <Button size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90 text-base sm:text-lg py-3 px-6 sm:py-4 sm:px-8">
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

        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-8">Error: {error}</p>
        ) : paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
                <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No products found. Try a different search or category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
