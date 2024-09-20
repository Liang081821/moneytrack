// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "moneytrack2-1778a.firebaseapp.com",
  projectId: "moneytrack2-1778a",
  storageBucket: "moneytrack2-1778a.appspot.com",
  messagingSenderId: "500588622625",
  appId: "1:500588622625:web:b58580e5d545f034d74460",
  measurementId: "G-0E9Z00BDF4",
};
// Initialize Firebase Authentication and get a reference to the service

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { app, db, auth, storage };
