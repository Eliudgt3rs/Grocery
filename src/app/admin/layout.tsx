import { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
    { title: "Dashboard", href: "/admin/dashboard" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
             <h2 className="text-lg font-semibold mb-4 px-4">Admin Menu</h2>
            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
              {sidebarNavItems.map((item) => (
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
              ))}
            </nav>
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
