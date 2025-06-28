// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDDP7rvqEIN1cx833RNKBubYRdI7Gitd1k",
    authDomain: "nairobi-grocer-e7a84.firebaseapp.com",
    projectId: "nairobi-grocer-e7a84",
    storageBucket: "nairobi-grocer-e7a84.firebasestorage.app",
    messagingSenderId: "399228903882",
    appId: "1:399228903882:web:ba963e37a800cfb37e2f33",
    measurementId: "G-MYGKWBW889"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app)
