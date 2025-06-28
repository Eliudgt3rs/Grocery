
import * as admin from 'firebase-admin';

const ensureAdminIsInitialized = () => {
    if (admin.apps.length > 0) {
        return;
    }

    try {
        const serviceAccount = require('../../nairobi-grocer-e7a84-firebase-adminsdk-fbsvc-0dd8ec4cec.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK has been initialized.');
    } catch (e) {
        console.error('Firebase Admin SDK initialization failed:', e);
    }
};

export const getAdminDb = () => {
    ensureAdminIsInitialized();
    return admin.firestore();
};

export const getAdminMessaging = () => {
    ensureAdminIsInitialized();
    return admin.messaging();
};
