// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBz_AKfpxsoDMh81TBmfhmhXxNBEY7h3o",
  authDomain: "urlshortner-b666e.firebaseapp.com",
  projectId: "urlshortner-b666e",
  storageBucket: "urlshortner-b666e.firebasestorage.app",
  messagingSenderId: "151047029113",
  appId: "1:151047029113:web:79e0ab1734cbd9f827afa8",
  measurementId: "G-X5J3F2LF30"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
