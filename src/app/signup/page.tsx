'use client';

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Assuming you have firebase initialized here
import { FcGoogle } from 'react-icons/fc';

import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleRedirectResult = async () => { 
      console.log("Attempting to get redirect result..."); // Added log
      try {
        const result = await getRedirectResult(auth);
        if (result) {
        // User signed up/in with Google
          console.log("Signed up/in with Google:", result.user);
          // You might want to perform additional actions here after successful signup,
          // like saving user data to Firestore if needed.
          router.push('/'); // Redirect to home after successful signup/sign-in
        } else {
          console.log("No redirect result found."); // Added log
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Redirect result error:", err);
        // You might want to display a user-friendly error message here
      }
    };
    handleRedirectResult();
  }, [router]); // Added 'router' as a dependency

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to a protected page or homepage after successful signup
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleGoogleSignup = async () => {
    setError(null);
    try {
      await signInWithRedirect(auth, new GoogleAuthProvider());
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleSignup}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FcGoogle className="mr-2 text-xl" /> Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}