import RecipeCard from "../components/Recipe/RecipeCard";
import { useAllRecipes } from "../hooks/useRecipes";
import { Loader2, TrendingUp } from "lucide-react";
export default function Trending({ user, userProfile, search, onOpen }) {
  const { recipes, loading } = useAllRecipes();
  const sorted = [...recipes].filter(r => { const q = search.toLowerCase(); return !q || r.title?.toLowerCase().includes(q) || r.tags?.some(t => t.includes(q)); }).sort((a, b) => (b.likes || 0) - (a.likes || 0));
  return (
    <div style={{ padding: "24px 28px", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}><TrendingUp size={18} color="var(--accent)" /><p style={{ color: "var(--text-muted)", fontSize: 14 }}>Sorted by most liked</p></div>
      {loading ? <div style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}><Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "var(--accent)" }} /></div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {sorted.map((r, i) => (
            <div key={r.id} style={{ position: "relative" }}>
              {i < 3 && <div style={{ position: "absolute", top: -8, left: -8, zIndex: 2, background: ["#ffd700","#c0c0c0","#cd7f32"][i], color: "#000", fontWeight: 800, fontSize: 12, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>#{i + 1}</div>}
              <RecipeCard recipe={r} user={user} userProfile={userProfile} onOpen={onOpen} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
