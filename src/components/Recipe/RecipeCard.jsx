import { Heart, Clock, Users, Star } from "lucide-react";
import { toggleLike, toggleFavorite } from "../../firebase/firestore";
import toast from "react-hot-toast";
const DIFF_COLOR = { Easy: "#3ba55d", Medium: "#faa61a", Hard: "#ed4245" };
export default function RecipeCard({ recipe, user, userProfile, onOpen }) {
  const liked = recipe.likedBy?.includes(user.uid);
  const fav = userProfile?.favorites?.includes(recipe.id);
  const handleLike = async (e) => { e.stopPropagation(); try { await toggleLike(recipe.id, user.uid, liked); } catch { toast.error("Couldn't update like"); } };
  const handleFav = async (e) => { e.stopPropagation(); try { await toggleFavorite(user.uid, recipe.id, fav); toast.success(fav ? "Removed from favorites" : "Added to favorites! ⭐"); } catch { toast.error("Couldn't update favorites"); } };
  return (
    <div onClick={() => onOpen(recipe)} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform .2s, border-color .2s", display: "flex", flexDirection: "column" }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--accent)"; }} onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
      <div style={{ height: 180, overflow: "hidden", position: "relative", background: "#0a0c14" }}>
        {recipe.image ? <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🍽️</div>}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <button onClick={handleFav} style={{ background: "rgba(0,0,0,.6)", borderRadius: 8, padding: "5px 7px", color: fav ? "#faa61a" : "#fff", display: "flex", alignItems: "center" }}><Star size={14} fill={fav ? "#faa61a" : "none"} /></button>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 10 }}>
          <span style={{ background: DIFF_COLOR[recipe.difficulty] || "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>{recipe.difficulty || "Easy"}</span>
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, lineHeight: 1.3 }}>{recipe.title}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{recipe.description}</p>
        </div>
        {recipe.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {recipe.tags.slice(0, 3).map(t => <span key={t} style={{ background: "rgba(88,101,242,.15)", color: "var(--accent)", fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>#{t}</span>)}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: 12 }}><Clock size={13} />{recipe.cookTime || "—"} min</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: 12 }}><Users size={13} />{recipe.servings || "—"}</span>
          </div>
          <button onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", color: liked ? "var(--danger)" : "var(--text-muted)", fontSize: 13, fontWeight: 500, padding: "4px 8px", borderRadius: 8 }}>
            <Heart size={14} fill={liked ? "var(--danger)" : "none"} />{recipe.likes || 0}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
          <img src={recipe.authorAvatar || "/default.png"} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{recipe.authorName}</span>
        </div>
      </div>
    </div>
  );
}
