import { useState } from "react";
import RecipeCard from "../components/Recipe/RecipeCard";
import RecipeForm from "../components/Recipe/RecipeForm";
import { useMyRecipes } from "../hooks/useRecipes";
import { deleteRecipe, isAdmin } from "../firebase/firestore";
import { Pencil, Trash2, PlusCircle, Lock } from "lucide-react";
import toast from "react-hot-toast";
export default function MyRecipes({ user, userProfile, search, onOpen }) {
  const { recipes } = useMyRecipes(user.uid);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const admin = isAdmin(user);
  const filtered = recipes.filter(r => {
    const q = search.toLowerCase();
    return !q || r.title?.toLowerCase().includes(q);
  });
  const handleDelete = async (id) => {
    if (!confirm("Delete this recipe?")) return;
    try { await deleteRecipe(id); toast.success("Recipe deleted"); }
    catch { toast.error("Couldn't delete"); }
  };

  if (adding) return <div style={{ padding: "24px 28px", height: "100%", overflowY: "auto" }}><RecipeForm user={user} onDone={() => setAdding(false)} /></div>;
  if (editing) return <div style={{ padding: "24px 28px", height: "100%", overflowY: "auto" }}><RecipeForm user={user} recipe={editing} onDone={() => setEditing(null)} /></div>;

  return (
    <div style={{ padding: "24px 28px", height: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{filtered.length} recipe{filtered.length !== 1 ? "s" : ""}</p>
        {admin ? (
          <button onClick={() => setAdding(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "var(--accent)", color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
            <PlusCircle size={15} /> New Recipe
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", background: "rgba(255,255,255,.04)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <Lock size={13} color="var(--text-muted)" />
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Only admin can add recipes</span>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: 80, color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>No recipes yet</p>
          {!admin && <p style={{ fontSize: 14, marginTop: 6 }}>Recipes shared by the admin will appear here</p>}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {filtered.map(r => (
            <div key={r.id} style={{ position: "relative" }}>
              <RecipeCard recipe={r} user={user} userProfile={userProfile} onOpen={onOpen} />
              {admin && (
                <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
                  <button onClick={(e) => { e.stopPropagation(); setEditing(r); }} style={{ background: "rgba(0,0,0,.7)", color: "#fff", borderRadius: 8, padding: "5px 8px", display: "flex" }}><Pencil size={13} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} style={{ background: "rgba(237,66,69,.8)", color: "#fff", borderRadius: 8, padding: "5px 8px", display: "flex" }}><Trash2 size={13} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
