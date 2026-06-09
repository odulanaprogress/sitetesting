// Safe Firebase initialization with fallback
let firebaseInitialized = false;
let initError: Error | null = null;

try {
  // Attempt to import and initialize Firebase
  await import('./firebase');
  firebaseInitialized = true;
} catch (error) {
  console.error('Firebase initialization failed:', error);
  initError = error as Error;
  firebaseInitialized = false;
}

export const isFirebaseReady = () => firebaseInitialized;
export const getFirebaseError = () => initError;
