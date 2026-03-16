import { useState, useEffect } from "react";
import { X, Clock, Users, ChefHat, Heart, Star, Send } from "lucide-react";
import { toggleLike, toggleFavorite, addComment, subscribeComments } from "../../firebase/firestore";
import toast from "react-hot-toast";
export default function RecipeModal({ recipe, user, userProfile, onClose }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const liked = recipe.likedBy?.includes(user.uid);
  const fav = userProfile?.favorites?.includes(recipe.id);
  useEffect(() => { const unsub = subscribeComments(recipe.id, setComments); return unsub; }, [recipe.id]);
  const handleComment = async () => {
    if (!comment.trim()) return;
    try { await addComment(recipe.id, { text: comment.trim(), authorName: user.name, authorAvatar: user.avatar, authorId: user.uid }); setComment(""); }
    catch { toast.error("Couldn't post comment"); }
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg-main)", border: "1px solid var(--border)", borderRadius: 18, width: "100%", maxWidth: 680, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "relative", height: 220, background: "#0a0c14", flexShrink: 0 }}>
          {recipe.image ? <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>🍽️</div>}
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,.7)", color: "#fff", borderRadius: 10, padding: "6px 8px", display: "flex" }}><X size={18} /></button>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "20px 24px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, flex: 1, paddingRight: 16 }}>{recipe.title}</h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => toggleFavorite(user.uid, recipe.id, fav)} style={{ background: fav ? "rgba(250,166,26,.15)" : "var(--bg-card)", border: `1px solid ${fav ? "#faa61a" : "var(--border)"}`, color: fav ? "#faa61a" : "var(--text-muted)", borderRadius: 8, padding: "7px 10px", display: "flex" }}><Star size={16} fill={fav ? "#faa61a" : "none"} /></button>
              <button onClick={() => toggleLike(recipe.id, user.uid, liked)} style={{ background: liked ? "rgba(237,66,69,.15)" : "var(--bg-card)", border: `1px solid ${liked ? "var(--danger)" : "var(--border)"}`, color: liked ? "var(--danger)" : "var(--text-muted)", borderRadius: 8, padding: "7px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}><Heart size={16} fill={liked ? "var(--danger)" : "none"} />{recipe.likes || 0}</button>
            </div>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{recipe.description}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            {[{ icon: Clock, label: `${recipe.cookTime || "?"} min` }, { icon: Users, label: `${recipe.servings || "?"} servings` }, { icon: ChefHat, label: recipe.difficulty || "Easy" }].map(({ icon: Icon, label }) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-card)", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: 8, fontSize: 13, color: "var(--text-muted)" }}><Icon size={14} />{label}</span>
            ))}
          </div>
          {recipe.ingredients?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: 15 }}>Ingredients</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {recipe.ingredients.map((ing, i) => <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-muted)" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />{ing}</li>)}
              </ul>
            </div>
          )}
          {recipe.steps?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: 15 }}>Instructions</h4>
              <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {recipe.steps.map((step, i) => <li key={i} style={{ display: "flex", gap: 12, fontSize: 14 }}><span style={{ minWidth: 26, height: 26, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span><span style={{ color: "var(--text-muted)", lineHeight: 1.7, paddingTop: 3 }}>{step}</span></li>)}
              </ol>
            </div>
          )}
          {recipe.tags?.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>{recipe.tags.map(t => <span key={t} style={{ background: "rgba(88,101,242,.15)", color: "var(--accent)", fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>#{t}</span>)}</div>}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Comments ({comments.length})</h4>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <img src={user.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%" }} />
              <div style={{ flex: 1, display: "flex", gap: 8 }}>
                <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && handleComment()} placeholder="Add a comment…" style={{ flex: 1, padding: "8px 12px", background: "var(--bg-card)", border: "1px solid var(--input-border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 14 }} />
                <button onClick={handleComment} style={{ background: "var(--accent)", color: "#fff", padding: "8px 12px", borderRadius: 8 }}><Send size={15} /></button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {comments.map(c => <div key={c.id} style={{ display: "flex", gap: 10 }}><img src={c.authorAvatar} alt="" style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0 }} /><div><span style={{ fontWeight: 600, fontSize: 13 }}>{c.authorName} </span><span style={{ color: "var(--text-muted)", fontSize: 13 }}>{c.text}</span></div></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
