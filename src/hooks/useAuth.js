import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase/config";
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, { uid: firebaseUser.uid, name: firebaseUser.displayName, email: firebaseUser.email, avatar: firebaseUser.photoURL, favorites: [], createdAt: serverTimestamp() });
        }
        setUser({ uid: firebaseUser.uid, name: firebaseUser.displayName, email: firebaseUser.email, avatar: firebaseUser.photoURL });
      } else { setUser(null); }
      setLoading(false);
    });
    return unsub;
  }, []);
  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);
  return { user, loading, login, logout };
};
