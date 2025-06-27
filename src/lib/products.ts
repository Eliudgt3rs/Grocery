import type { Product } from '@/types';

export const categories = ["All", "Fruits", "Vegetables", "Dairy", "Bakery", "Meat"];

export const products: Product[] = [
  { id: '1', name: 'Fresh Apples', description: 'Crisp and juicy red apples.', price: 2.50, image: 'https://placehold.co/300x300.png', category: 'Fruits', stock: 100, rating: 4.5, reviews: 120, aiHint: 'fresh apples' },
  { id: '2', name: 'Organic Bananas', description: 'A bunch of ripe organic bananas.', price: 1.80, image: 'https://placehold.co/300x300.png', category: 'Fruits', stock: 150, rating: 4.8, reviews: 250, aiHint: 'organic bananas' },
  { id: '3', name: 'Carrots', description: 'Fresh, crunchy carrots.', price: 1.20, image: 'https://placehold.co/300x300.png', category: 'Vegetables', stock: 200, rating: 4.6, reviews: 90, aiHint: 'fresh carrots' },
  { id: '4', name: 'Spinach', description: 'A bag of fresh spinach leaves.', price: 2.00, image: 'https://placehold.co/300x300.png', category: 'Vegetables', stock: 80, rating: 4.7, reviews: 75, aiHint: 'fresh spinach' },
  { id: '5', name: 'Fresh Milk', description: '1L of fresh pasteurized milk.', price: 1.50, image: 'https://placehold.co/300x300.png', category: 'Dairy', stock: 120, rating: 4.9, reviews: 300, aiHint: 'milk carton' },
  { id: '6', name: 'Cheddar Cheese', description: '250g block of mature cheddar cheese.', price: 4.50, image: 'https://placehold.co/300x300.png', category: 'Dairy', stock: 60, rating: 4.8, reviews: 150, aiHint: 'cheese block' },
  { id: '7', name: 'Whole Wheat Bread', description: 'A loaf of freshly baked whole wheat bread.', price: 3.00, image: 'https://placehold.co/300x300.png', category: 'Bakery', stock: 50, rating: 4.7, reviews: 180, aiHint: 'bread loaf' },
  { id: '8', name: 'Croissants', description: 'Pack of 4 buttery croissants.', price: 4.00, image: 'https://placehold.co/300x300.png', category: 'Bakery', stock: 40, rating: 4.9, reviews: 210, aiHint: 'buttery croissants' },
  { id: '9', name: 'Chicken Breast', description: '500g of skinless chicken breast fillets.', price: 7.50, image: 'https://placehold.co/300x300.png', category: 'Meat', stock: 30, rating: 4.8, reviews: 110, aiHint: 'raw chicken' },
  { id: '10', name: 'Ground Beef', description: '500g of lean ground beef.', price: 8.00, image: 'https://placehold.co/300x300.png', category: 'Meat', stock: 25, rating: 4.7, reviews: 95, aiHint: 'ground beef' },
  { id: '11', name: 'Avocado', description: 'Ripe and creamy Hass avocado.', price: 1.75, image: 'https://placehold.co/300x300.png', category: 'Fruits', stock: 90, rating: 4.9, reviews: 400, aiHint: 'ripe avocado' },
  { id: '12', name: 'Tomatoes', description: 'A pound of fresh, vine-ripened tomatoes.', price: 2.20, image: 'https://placehold.co/300x300.png', category: 'Vegetables', stock: 110, rating: 4.6, reviews: 130, aiHint: 'vine tomatoes' },
];
