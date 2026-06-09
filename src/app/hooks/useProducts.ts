import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { products as initialProducts, Product } from '../data/mockData';

function safeLS(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear any stale localStorage cache so deleted products never flash back
    try { localStorage.removeItem('admin_products'); } catch { /* ignore */ }

    if (!db) {
      setLoading(false);
      return;
    }

    // Real-time Firestore listener
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      snapshot => {
        const firestoreProducts = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
        } as Product));
        setProducts(firestoreProducts);
        setLoading(false);
      },
      err => {
        console.warn('Firestore products listener error:', err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { products, loading };
}
