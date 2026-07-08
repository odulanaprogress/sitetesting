// Safe Firebase initialization status helper
// We don't use top-level await here — just re-export the already-initialized instances
import { db, auth } from './firebase';

export const isFirebaseReady = () => db !== null && auth !== null;
export const getFirebaseError = () => null; // errors are logged in firebase.ts
