"use client";

import Link from "next/link";
import { Bike, Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/cart-provider";
import CartSheet from "@/components/cart-sheet";
import { Input } from "./ui/input";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/account/orders", label: "My Orders" },
];

export default function Header() {
  const { cartCount } = useCart();
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    if (searchQuery) {
        router.push(`/?q=${searchQuery}`);
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

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
                <Input type="search" name="search" placeholder="Search products..." className="pr-10" />
                <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                    <Search className="h-4 w-4"/>
                </Button>
            </div>
          </form>

          <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                        {cartCount}
                    </span>
                    )}
                    <span className="sr-only">Open Cart</span>
                </Button>
            </SheetTrigger>
            <CartSheet />
          </Sheet>

          <Button variant="outline" size="icon" className="hidden md:inline-flex">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>

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
                <Button variant="outline" size="default" className="mt-4">
                    <User className="h-5 w-5 mr-2" />
                    Account
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
