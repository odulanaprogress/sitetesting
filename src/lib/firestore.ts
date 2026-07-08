import {
  collection,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../app/data/products';

// Products Collection — guarded so they're never called with a null db at module load time
export const productsCollection = db ? collection(db, 'products') : null;
export const ordersCollection = db ? collection(db, 'orders') : null;
export const categoriesCollection = db ? collection(db, 'categories') : null;

// Product Operations
export async function getAllProducts(): Promise<Product[]> {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string | null> {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
    } else {
      // Document doesn't exist yet — create it with setDoc
      await setDoc(docRef, { ...updates, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }, { merge: true });
    }
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, 'products'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Search products
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  try {
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or ElasticSearch
    // This is a simple workaround - fetches all and filters client-side
    const allProducts = await getAllProducts();
    const lowerSearch = searchTerm.toLowerCase();

    return allProducts.filter(product =>
      product.name.toLowerCase().includes(lowerSearch) ||
      product.description?.toLowerCase().includes(lowerSearch) ||
      product.category.toLowerCase().includes(lowerSearch)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

// Order Operations
export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentReference?: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
  updatedAt: any;
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<string | null> {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

export async function getAllOrders(): Promise<Order[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['orderStatus']
): Promise<boolean> {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      orderStatus: status,
      updatedAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

// Initialize default products (run once)
export async function initializeProducts(products: Omit<Product, 'id'>[]): Promise<void> {
  if (!db) { console.error('Firestore not available'); return; }
  try {
    const batch = writeBatch(db);
    products.forEach(product => {
      const docRef = doc(collection(db!, 'products'));
      batch.set(docRef, {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    });
    await batch.commit();
    console.log('Products initialized successfully');
  } catch (error) {
    console.error('Error initializing products:', error);
  }
}
