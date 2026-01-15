import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "mock_key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mock_domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mock_project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mock_bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "mock_sender",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "mock_app_id"
};

let app;
let auth;
let db;

try {
  if (firebaseConfig.apiKey !== "mock_key") {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
  } else {
      console.warn("Firebase Config missing. Running in Simulation Mode.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, db, doc, onSnapshot, updateDoc, setDoc, getDoc };

// Helper to determine if we should use real DB
export const isRealDb = () => !!db;
