// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5bCCgUqqFvB0ban5duizExyX9z05FCBo",
  authDomain: "midia-kit-ionlab.firebaseapp.com",
  projectId: "midia-kit-ionlab",
  storageBucket: "midia-kit-ionlab.firebasestorage.app",
  messagingSenderId: "1072040381638",
  appId: "1:1072040381638:web:fd55eedd98f06f0b73dbc7",
  measurementId: "G-Z4EG4ZX8WT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export default app;
