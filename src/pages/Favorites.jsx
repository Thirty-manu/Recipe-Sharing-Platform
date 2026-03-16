import RecipeCard from "../components/Recipe/RecipeCard";
import { useAllRecipes } from "../hooks/useRecipes";
export default function Favorites({ user, userProfile, search, onOpen }) {
  const { recipes } = useAllRecipes();
  const favIds = userProfile?.favorites || [];
  const favRecipes = recipes.filter(r => favIds.includes(r.id)).filter(r => { const q = search.toLowerCase(); return !q || r.title?.toLowerCase().includes(q); });
  return (
    <div style={{ padding: "24px 28px", height: "100%", overflowY: "auto" }}>
      {favRecipes.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 80, color: "var(--text-muted)" }}><div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div><p style={{ fontSize: 16, fontWeight: 600 }}>No favorites yet</p><p style={{ fontSize: 14, marginTop: 6 }}>Star recipes you love to save them here</p></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {favRecipes.map(r => <RecipeCard key={r.id} recipe={r} user={user} userProfile={userProfile} onOpen={onOpen} />)}
        </div>
      )}
    </div>
  );
}
