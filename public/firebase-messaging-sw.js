// NOTE: Using compat version for simplicity in service worker without a build step
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// This is the config from src/lib/firebase.ts
const firebaseConfig = {
    apiKey: "AIzaSyDDP7rvqEIN1cx833RNKBubYRdI7Gitd1k",
    authDomain: "nairobi-grocer-e7a84.firebaseapp.com",
    projectId: "nairobi-grocer-e7a84",
    storageBucket: "nairobi-grocer-e7a84.firebasestorage.app",
    messagingSenderId: "399228903882",
    appId: "1:399228903882:web:ba963e37a800cfb37e2f33",
    measurementId: "G-MYGKWBW889"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: '/icon.png' // You can add an icon here
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
