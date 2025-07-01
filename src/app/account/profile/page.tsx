"use client";

import { useAuth } from "@/context/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PageSpinner from "@/components/page-spinner";

export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <PageSpinner />;
    }

    if (!user) {
        return (
            <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">Please log in to view your profile.</p>
            </div>
        );
    }
    
    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[1][0]}`;
        }
        return name.substring(0, 2);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">Profile</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'}/>
                            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xl font-semibold">{user.displayName || "No name provided"}</p>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Account Details</h3>
                        <div className="text-sm space-y-1">
                            <p><span className="font-medium">User ID:</span> {user.uid}</p>
                            <p><span className="font-medium">Account Created:</span> {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                            <p><span className="font-medium">Last Sign In:</span> {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>

                     <Button variant="outline">Edit Profile</Button>
                </CardContent>
            </Card>
        </div>
    );
}
