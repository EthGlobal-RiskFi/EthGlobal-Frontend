import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "",
  authDomain: "ethglobal-908eb.firebaseapp.com",
  projectId: "ethglobal-908eb",
  storageBucket: "ethglobal-908eb.firebasestorage.app",
  messagingSenderId: "238809031519",
  appId: "1:238809031519:web:d7c4108e2e37c036cb8cea",
  measurementId: "G-LQXL9GYDXY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
