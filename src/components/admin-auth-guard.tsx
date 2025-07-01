'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import PageSpinner from '@/components/page-spinner';
import { useToast } from '@/hooks/use-toast';

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID;

    useEffect(() => {
        if (loading) {
            return; // Wait until auth state is loaded
        }

        if (!adminUid) {
            console.error("CRITICAL: Admin UID is not configured in .env file. Access to admin section is disabled.");
            toast({
                title: "Configuration Error",
                description: "The admin dashboard is not configured. Please contact support.",
                variant: "destructive",
            });
            router.push('/');
            return;
        }
        
        if (adminUid === "REPLACE_WITH_YOUR_FIREBASE_UID") {
            console.warn("Admin UID has not been set. Please update the .env file.");
            toast({
                title: "Admin Setup Needed",
                description: "The admin user has not been configured yet.",
                variant: "destructive",
            });
            router.push('/');
            return;
        }

        if (!user) {
            // If not logged in, redirect to login page with a redirect back to admin
            router.push('/login?redirect=/admin/dashboard');
            return;
        }

        if (user.uid !== adminUid) {
            // If logged in but not the admin, redirect to home
            console.warn(`Unauthorized access attempt to admin page by user: ${user.uid}`);
            toast({
                title: "Access Denied",
                description: "You do not have permission to view this page.",
                variant: "destructive",
            });
            router.push('/');
        }

    }, [user, loading, router, adminUid, toast]);

    // Show a spinner while loading or if the user is not the admin yet (to prevent content flashing)
    if (loading || !user || user.uid !== adminUid) {
        return <PageSpinner />;
    }

    // If everything is correct, render the admin content
    return <>{children}</>;
}
