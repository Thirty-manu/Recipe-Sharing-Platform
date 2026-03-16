import { useState, useEffect } from "react";
import { subscribeRecipes, subscribeUserRecipes } from "../firebase/firestore";
export const useAllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const unsub = subscribeRecipes((data) => { setRecipes(data); setLoading(false); }); return unsub; }, []);
  return { recipes, loading };
};
export const useMyRecipes = (uid) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeUserRecipes(uid, (data) => { setRecipes(data); setLoading(false); });
    return unsub;
  }, [uid]);
  return { recipes, loading };
};
