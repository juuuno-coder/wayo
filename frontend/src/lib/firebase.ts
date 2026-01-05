
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvIDP-C5qCg0TBswAN6tNIuHsUs-wnJDo",
  authDomain: "gabojago-5c7e9.firebaseapp.com",
  projectId: "gabojago-5c7e9",
  storageBucket: "gabojago-5c7e9.firebasestorage.app",
  messagingSenderId: "407862258230",
  appId: "1:407862258230:web:5842d1a6e656e020ad0697",
  measurementId: "G-0Z15S80HVN"
};

// Initialize Firebase
// Check if current app is already initialized to avoid "Firebase App named '[DEFAULT]' already exists" error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics is only supported in browser environments
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };
