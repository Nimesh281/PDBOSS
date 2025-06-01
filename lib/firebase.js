// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyojw85RZ873WdgcBw6BA4K6iQr2V7NSA",
  authDomain: "aakash-project-88e5d.firebaseapp.com",
  projectId: "aakash-project-88e5d",
  storageBucket: "aakash-project-88e5d.firebasestorage.app",
  messagingSenderId: "1004513247959",
  appId: "1:1004513247959:web:b5789e5e8428df5b332692",
  measurementId: "G-3HTQSXBF37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);