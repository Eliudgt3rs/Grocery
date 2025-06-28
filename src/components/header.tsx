"use client";

import { useState } from "react";
import Link from "next/link";
import { Bike, Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/cart-provider";
import { useAuth } from "@/context/auth-provider"; // Import useAuth
import { signOut } from "firebase/auth"; // Import signOut
import { auth } from "@/lib/firebase"; // Import auth
import CartSheet from "@/components/cart-sheet";
import { Input } from "./ui/input";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/account/orders", label: "My Orders" },
];

export default function Header() {
  const { cartCount } = useCart();
  const { user, loading } = useAuth(); // Get user and loading from auth context
  const router = useRouter();
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false); // State for cart sheet visibility
  const { toast } = useToast();


  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    if (searchQuery) {
        router.push(`/?q=${searchQuery}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      router.push("/"); // Redirect to home after logout
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Nairobi Grocer</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
                <Input type="search" name="search" placeholder="Search products..." className="pr-10" />
                <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                    <Search className="h-4 w-4"/>
                </Button>
            </div>
          </form>

          <Link href="/cart" passHref>
            <Button variant="default" className="hidden sm:inline-flex">View Cart</Button>
          </Link>
          <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}> {/* Control sheet state */}
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">{cartCount}</span>
                    )}<span className="sr-only">Open Cart</span>
                </Button>
            </SheetTrigger>
            <CartSheet onClose={() => setIsCartSheetOpen(false)} /> {/* Pass close function */}
          </Sheet>

          {/* Authentication dependent rendering */}
          {!loading && ( // Show nothing while loading auth state
            user ? (
              // User is logged in
              <>
                <Link href="/account/orders" passHref> {/* Link to account orders page */}
                  <Button variant="outline" size="icon" className="hidden md:inline-flex">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </Link>
                <Button variant="outline" size="default" onClick={handleLogout}> {/* Logout Button */}
                    Logout
                </Button>
              </>
            ) : (
              // User is not logged in
              <Link href="/login" passHref> {/* Link to login page */}
                <Button variant="outline" size="default">
                  Login
                </Button>
              </Link>
            )
          )}


          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 pt-10">
                <Link href="/" className="flex items-center gap-2 mb-4">
                    <Bike className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">Nairobi Grocer</span>
                </Link>
                <nav className="flex flex-col gap-4 text-lg font-medium">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="transition-colors hover:text-primary"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
                 {/* Authentication dependent rendering in mobile menu */}
                {!loading && (
                  user ? (
                    <>
                       <Link href="/account/orders" passHref>
                         <Button variant="outline" size="default" className="w-full">
                             <User className="h-5 w-5 mr-2" />
                             Account
                         </Button>
                       </Link>
                       <Button variant="outline" size="default" onClick={handleLogout} className="w-full">
                           Logout
                       </Button>
                    </>
                  ) : (
                    <Link href="/login" passHref>
                       <Button variant="outline" size="default" className="w-full">
                           Login
                       </Button>
                    </Link>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
