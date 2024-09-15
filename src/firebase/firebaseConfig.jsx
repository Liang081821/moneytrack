// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export { app, db };
