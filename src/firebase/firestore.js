import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, arrayUnion, arrayRemove,
  increment
} from "firebase/firestore";
import { db } from "./config";

// ── Recipes ──────────────────────────────────────────────
export const addRecipe = (data) =>
  addDoc(collection(db, "recipes"), { ...data, createdAt: serverTimestamp(), likes: 0, likedBy: [] });

export const updateRecipe = (id, data) =>
  updateDoc(doc(db, "recipes", id), data);

export const deleteRecipe = (id) =>
  deleteDoc(doc(db, "recipes", id));

export const getRecipe = (id) =>
  getDoc(doc(db, "recipes", id));

export const subscribeRecipes = (callback) => {
  const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

export const subscribeUserRecipes = (uid, callback) => {
  const q = query(
    collection(db, "recipes"),
    where("authorId", "==", uid),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
};

// ── Likes ─────────────────────────────────────────────────
export const toggleLike = async (recipeId, userId, liked) => {
  const ref = doc(db, "recipes", recipeId);
  await updateDoc(ref, {
    likes: increment(liked ? -1 : 1),
    likedBy: liked ? arrayRemove(userId) : arrayUnion(userId),
  });
};

// ── Favorites ─────────────────────────────────────────────
export const toggleFavorite = async (userId, recipeId, isFav) => {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, {
    favorites: isFav ? arrayRemove(recipeId) : arrayUnion(recipeId),
  });
};

// ── Comments ──────────────────────────────────────────────
export const addComment = (recipeId, data) =>
  addDoc(collection(db, "recipes", recipeId, "comments"), {
    ...data,
    createdAt: serverTimestamp(),
  });

export const subscribeComments = (recipeId, callback) =>
  onSnapshot(
    query(collection(db, "recipes", recipeId, "comments"), orderBy("createdAt", "asc")),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );

// ── User Profile ──────────────────────────────────────────
export const upsertUser = (uid, data) =>
  updateDoc(doc(db, "users", uid), data).catch(() =>
    addDoc(collection(db, "users"), { uid, ...data, favorites: [], createdAt: serverTimestamp() })
  );

export const getUser = (uid) =>
  getDoc(doc(db, "users", uid));

export const subscribeUser = (uid, callback) =>
  onSnapshot(doc(db, "users", uid), (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });