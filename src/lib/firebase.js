
// src/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// If you want Analytics later, we guard it properly:
const firebaseConfig = {
  apiKey: "AIzaSyBZhxbcy5SqkEvt2rA7Cxy28iN0hcv1hdQ",
  authDomain: "riskfi-ethglobal-2167f.firebaseapp.com",
  projectId: "riskfi-ethglobal-2167f",
  storageBucket: "riskfi-ethglobal-2167f.firebasestorage.app",
  messagingSenderId: "186382349637",
  appId: "1:186382349637:web:67022405746110a5493a2c",
  measurementId: "G-B6N00MSGR0"
};

// Initialize exactly once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };

