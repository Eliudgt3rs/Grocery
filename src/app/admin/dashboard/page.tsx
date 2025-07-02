import AdminDashboard from "@/components/admin-dashboard";

export default function AdminDashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">Admin Dashboard</h1>
            {/* The Suspense wrapper is no longer needed as the dashboard handles its own loading state */}
            <AdminDashboard />
        </div>
    );
}
