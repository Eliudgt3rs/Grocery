'use client';

import { useState } from 'react';
import { BellRing } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { requestNotificationPermission } from '@/lib/fcm';
import { useAuth } from '@/context/auth-provider';

export default function NotificationPermissionButton() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleRequestPermission = async () => {
        if (!user) return;
        setLoading(true);
        const result = await requestNotificationPermission();
        toast({
            title: result.success ? 'Success' : 'Error',
            description: result.message,
            variant: result.success ? 'default' : 'destructive',
        });
        setLoading(false);
    };

    if (!user) return null;

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleRequestPermission}
            disabled={loading}
            aria-label="Enable Notifications"
            title="Enable Notifications"
        >
            <BellRing className="h-5 w-5" />
        </Button>
    );
}
