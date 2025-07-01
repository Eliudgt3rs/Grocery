
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Bike, Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/cart-provider";
import { useAuth } from "@/context/auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import CartSheet from "@/components/cart-sheet";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/account/orders", label: "My Orders" },
];

export default function Header() {
  const { cartCount } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      setIsMobileMenuOpen(false);
      router.push("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 pr-6">
          <Link href="/" className="flex items-center gap-2">
            <Bike className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Nairobi Grocer</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            {user && <Link href="/account/orders" className="transition-colors hover:text-primary">My Orders</Link>}
            {user && <Link href="/admin/dashboard" className="transition-colors hover:text-primary">Admin</Link>}
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
          <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">{cartCount}</span>
                    )}<span className="sr-only">Open Cart</span>
                </Button>
            </SheetTrigger>
            <CartSheet onClose={() => setIsCartSheetOpen(false)} />
          </Sheet>

          {!loading && (
            user ? (
              <>
                <Link href="/account/orders" passHref>
                  <Button variant="outline" size="icon" className="hidden md:inline-flex">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </Link>
                <Button variant="outline" size="default" onClick={handleLogout}>
                    Logout
                </Button>
              </>
            ) : (
              <Link href="/login" passHref>
                <Button variant="outline" size="default">
                  Login
                </Button>
              </Link>
            )
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                    <Bike className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">Nairobi Grocer</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 p-6 flex-grow">
                <nav className="flex flex-col gap-4 text-lg font-medium">
                  <Link href="/" className="transition-colors hover:text-primary" onClick={closeMobileMenu}>Home</Link>
                  {user && <Link href="/account/orders" className="transition-colors hover:text-primary" onClick={closeMobileMenu}>My Orders</Link>}
                  {user && <Link href="/admin/dashboard" className="transition-colors hover:text-primary" onClick={closeMobileMenu}>Admin</Link>}
                </nav>
              </div>
              <div className="p-6 pt-0 mt-auto">
                {!loading && (
                  <div className="flex flex-col gap-2">
                  {user ? (
                    <>
                       <Link href="/account/orders" passHref>
                         <Button variant="outline" size="default" className="w-full" onClick={closeMobileMenu}>
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
                       <Button variant="outline" size="default" className="w-full" onClick={closeMobileMenu}>
                           Login
                       </Button>
                    </Link>
                  )}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
