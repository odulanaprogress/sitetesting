import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyB4FK-b3tfYjau90IsqYJllw1o-8eK7T0E",
  authDomain: "zeetech-distribution.firebaseapp.com",
  projectId: "zeetech-distribution",
  storageBucket: "zeetech-distribution.firebasestorage.app",
  messagingSenderId: "1025019841564",
  appId: "1:1025019841564:web:d96776956880b24d1363d9"
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

try {
  _app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  _auth = getAuth(_app);
  _db = getFirestore(_app);
} catch (err) {
  console.error('Firebase initialization failed:', err);
}

export const auth = _auth;
export const db = _db;
export default _app;
