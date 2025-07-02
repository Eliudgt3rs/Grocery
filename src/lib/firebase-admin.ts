import * as admin from 'firebase-admin';

// Check if the app is already initialized to avoid errors
if (!admin.apps.length) {
  try {
    // When deployed on App Hosting, the SDK is automatically initialized.
    // For local development, you would need to set up Application Default Credentials.
    // https://firebase.google.com/docs/app-hosting/dev-experience#local-backend-instance
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error);
    // We are throwing a more informative error to help with debugging.
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
