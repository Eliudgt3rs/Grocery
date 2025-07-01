import AdminDashboard from "@/components/admin-dashboard";
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">Admin Dashboard</h1>
             <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                <AdminDashboard />
            </Suspense>
        </div>
    );
}
