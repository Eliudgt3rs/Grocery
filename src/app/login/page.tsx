"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, Auth, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Import the auth object
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful - redirect user
      toast({
        title: "Login Successful!",
        description: "You have been logged in.",
      });
      const redirectUrl = searchParams.get("redirect") || "/";
      router.push(redirectUrl); // Redirect to the previous page or home
    } catch (error: any) {
      setError(error.message); // Display error message
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User signed in with redirect
          console.log("Signed in with redirect:", result.user);
          const redirectUrl = searchParams.get("redirect") || "/";
          router.push(redirectUrl);
        }
      } catch (error: any) {
        setError(error.message);
        console.error("Redirect result error:", error);
      }
    };

    handleRedirectResult();
  }, [router, searchParams]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
      // No code needed here after signInWithRedirect, as it redirects the page
    } catch (error: any) {
      // Handle errors here
      setError(error.message); // Display error message
      console.error("Google Sign-in error:", error);
      toast({
        title: "Google Sign-in Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-12 min-h-[calc(100vh-64px-88px)]"> {/* Adjust height based on header/footer */}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <Button onClick={handleGoogleSignIn} className="w-full mt-4" variant="outline">
            <FcGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>


          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                OR
              </span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up here.
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
