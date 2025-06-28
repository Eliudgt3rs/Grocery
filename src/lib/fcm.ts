'use client';

import { getToken, isSupported } from 'firebase/messaging';
import { messaging, db, auth } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// IMPORTANT: Replace with your VAPID key from Firebase Console > Project Settings > Cloud Messaging > Web configuration
const VAPID_KEY = 'YOUR_VAPID_KEY_HERE';

export const requestNotificationPermission = async () => {
    if (!auth.currentUser) {
        return { success: false, message: 'You must be logged in to enable notifications.' };
    }

    if (!await isSupported() || !messaging) {
        console.warn('Firebase Messaging is not supported in this browser.');
        return { success: false, message: 'Notifications are not supported on this device or browser.' };
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });

            if (fcmToken) {
                console.log('FCM token:', fcmToken);
                // Save the token to Firestore
                const tokenRef = doc(db, 'fcmTokens', auth.currentUser.uid);
                await setDoc(tokenRef, { token: fcmToken, createdAt: serverTimestamp() }, { merge: true });
                return { success: true, message: 'Notifications have been enabled!' };
            }
            
            return { success: false, message: 'Could not get notification token. Please try again.' };
        }

        return { success: false, message: 'Notification permission was not granted.' };
    } catch (error) {
        console.error('An error occurred while requesting permission or getting token:', error);
        if ((error as Error).message.includes('messaging/invalid-vapid-key')) {
            return { success: false, message: 'VAPID key is not configured. Please contact support.' };
        }
        return { success: false, message: 'An error occurred while enabling notifications.' };
    }
};
