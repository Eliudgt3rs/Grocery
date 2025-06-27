import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cart-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: 'Nairobi Grocer',
  description: 'Fresh groceries delivered to your door in Nairobi.',
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#F4FDF6" />
      </head>
      <body className="font-body antialiased">
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
