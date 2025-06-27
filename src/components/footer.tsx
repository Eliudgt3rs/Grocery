import Link from 'next/link';
import { Bike, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from './ui/button';

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Bike className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground">Nairobi Grocer</span>
            </Link>
            <p className="text-sm">Your local source for fresh, quality groceries delivered to your doorstep.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/account/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Delivery Zones</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Nairobi Grocer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
