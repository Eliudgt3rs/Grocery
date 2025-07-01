"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-provider";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const sidebarNavItems = [
    { title: "My Orders", href: "/account/orders", show: true },
    { title: "Profile", href: "/account/profile", show: true },
    { title: "Settings", href: "/account/settings", show: true },
    { title: "Admin", href: "/admin/dashboard", show: !!user },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) =>
              item.show ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start"
                  )}
                >
                  {item.title}
                </Link>
              ) : null
            )}
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
