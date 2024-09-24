// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "moneytrack-4c04d.firebaseapp.com",
  projectId: "moneytrack-4c04d",
  storageBucket: "moneytrack-4c04d.appspot.com",
  messagingSenderId: "749760221507",
  appId: "1:749760221507:web:1647083a1392791d26dff6",
  measurementId: "G-TJVVE6SQ08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence and multi-tab support
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Initialize other Firebase services
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, auth, storage };
