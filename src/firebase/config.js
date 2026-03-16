import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYSNybX5uBLQNbsFNWNyJE0xBt3hIQBGQ",
  authDomain: "recipe-sharing-platform-29712.firebaseapp.com",
  projectId: "recipe-sharing-platform-29712",
  storageBucket: "recipe-sharing-platform-29712.firebasestorage.app",
  messagingSenderId: "294360763101",
  appId: "1:294360763101:web:5de807bac81ff2e4a6e934",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
