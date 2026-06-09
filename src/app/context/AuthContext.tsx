import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export interface ZeetechUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: ZeetechUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAllUsers: () => Promise<ZeetechUser[]>;
}

const ADMIN_EMAIL = 'zeetechdistributionadminsupport01@mail.com';
const ADMIN_PASSWORD = 'Zeetech12@';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ZeetechUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<ZeetechUser | null> => {
    if (!db) return null;
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) return userDoc.data() as ZeetechUser;
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          let userData = await fetchUserData(firebaseUser);
          // If no Firestore doc but this is the admin email, recover gracefully
          if (!userData && firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            userData = {
              id: firebaseUser.uid,
              name: 'Zeetech Admin',
              email: firebaseUser.email,
              role: 'admin',
              createdAt: new Date().toISOString(),
            };
            if (db) setDoc(doc(db, 'users', firebaseUser.uid), userData).catch(() => {});
          }
          setUser(userData);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Firebase auth initialization error:', error);
      setIsLoading(false);
    }

    const timeout = setTimeout(() => setIsLoading(false), 5000);

    return () => {
      clearTimeout(timeout);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) return { success: false, error: 'Authentication service unavailable.' };
    const normalizedEmail = email.trim().toLowerCase();

    const isAdminCredentials =
      normalizedEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;

    try {
      if (isAdminCredentials) {
        let firebaseUid: string;
        try {
          const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
          firebaseUid = userCredential.user.uid;
        } catch (firebaseError: any) {
          // Account doesn't exist yet — create it
          if (
            firebaseError.code === 'auth/user-not-found' ||
            firebaseError.code === 'auth/invalid-credential'
          ) {
            const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
            firebaseUid = userCredential.user.uid;
          } else {
            throw firebaseError;
          }
        }

        // Ensure Firestore doc exists for admin
        let adminData = db ? (await getDoc(doc(db, 'users', firebaseUid))).data() as ZeetechUser | undefined : undefined;
        if (!adminData) {
          adminData = {
            id: firebaseUid,
            name: 'Zeetech Admin',
            email: normalizedEmail,
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          if (db) await setDoc(doc(db, 'users', firebaseUid), adminData);
        }
        setUser(adminData);
        return { success: true, isAdmin: true };
      }

      // Regular user login
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const userData = await fetchUserData(userCredential.user);
      if (userData) {
        setUser(userData);
        return { success: true, isAdmin: userData.role === 'admin' };
      }
      return { success: false, error: 'User data not found. Please contact support.' };
    } catch (error: any) {
      const code = error?.code ?? '';
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        return { success: false, error: 'Incorrect email or password. Please try again.' };
      }
      if (code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many failed attempts. Please try again later.' };
      }
      if (code === 'auth/invalid-email') {
        return { success: false, error: 'Invalid email address.' };
      }
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    if (!auth) return { success: false, error: 'Authentication service unavailable.' };
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: 'This email address cannot be used for registration.' };
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const newUser: ZeetechUser = {
        id: userCredential.user.uid,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim(),
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      if (db) await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setUser(newUser);
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'An account with this email already exists. Please log in.' };
      } else if (error.code === 'auth/weak-password') {
        return { success: false, error: 'Password is too weak. Please use at least 6 characters.' };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'Invalid email address.' };
      }
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      if (auth) await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getAllUsers = async (): Promise<ZeetechUser[]> => {
    if (!db) return [];
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      return usersSnapshot.docs.map(d => d.data() as ZeetechUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, signup, logout, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
