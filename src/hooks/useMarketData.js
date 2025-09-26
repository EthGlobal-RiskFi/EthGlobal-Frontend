// src/hooks/useMarketData.js
"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase"; // Make sure this path is correct for your project structure

export default function useMarketData({
  collectionName = "crypto_data",
  orderByField = "timestamp",
  limitCount = 50,
} = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Create a query against the collection
    const colRef = collection(db, collectionName);
    const q = query(colRef, orderBy(orderByField, "desc"), limit(limitCount));

    // Set up the real-time listener
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const arr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(arr);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        const msg =
          err?.code === "permission-denied"
            ? "Firestore rules are blocking reads on this collection. Please check your Firestore Security Rules."
            : String(err?.message ?? err);
        setError(`${err?.code || "error"}: ${msg}`);
        setLoading(false);
      }
    );

    // Clean up the listener when the component unmounts or dependencies change
    return () => unsub();
  }, [collectionName, orderByField, limitCount]);

  return { data, loading, error };
}
