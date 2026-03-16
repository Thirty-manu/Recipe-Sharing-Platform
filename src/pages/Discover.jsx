import { useState } from "react";
import RecipeCard from "../components/Recipe/RecipeCard";
import { useAllRecipes } from "../hooks/useRecipes";
import { Loader2 } from "lucide-react";
const CATEGORIES = ["All","Breakfast","Lunch","Dinner","Snack","Dessert","Drink","Vegan","Vegetarian","Keto","Quick"];
export default function Discover({ user, userProfile, search, onOpen }) {
  const { recipes, loading } = useAllRecipes();
  const [cat, setCat] = useState("All");
  const filtered = recipes.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.title?.toLowerCase().includes(q) || r.tags?.some(t => t.includes(q)) || r.ingredients?.some(i => i.toLowerCase().includes(q));
    const matchCat = cat === "All" || r.category === cat;
    return matchSearch && matchCat;
  });
  return (
    <div style={{ padding: "24px 28px", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {CATEGORIES.map(c => <button key={c} onClick={() => setCat(c)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, background: cat === c ? "var(--accent)" : "var(--bg-card)", border: `1px solid ${cat === c ? "var(--accent)" : "var(--border)"}`, color: cat === c ? "#fff" : "var(--text-muted)", cursor: "pointer", transition: "all .15s" }}>{c}</button>)}
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}><Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "var(--accent)" }} /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 60, color: "var(--text-muted)" }}><div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div><p style={{ fontSize: 16, fontWeight: 600 }}>No recipes found</p><p style={{ fontSize: 14, marginTop: 6 }}>Be the first to share one!</p></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {filtered.map(r => <RecipeCard key={r.id} recipe={r} user={user} userProfile={userProfile} onOpen={onOpen} />)}
        </div>
      )}
    </div>
  );
}
