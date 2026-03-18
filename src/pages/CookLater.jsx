import { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAllRecipes } from "../hooks/useRecipes";
import { Clock, Trash2, StickyNote, X, Check, Bell } from "lucide-react";
import toast from "react-hot-toast";

export default function CookLater({ user, onOpen }) {
  const { recipes } = useAllRecipes();
  const [cookLater, setCookLater] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setCookLater(snap.data().cookLater || []);
      setLoading(false);
    }, () => setLoading(false));
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => { unsub(); clearTimeout(timer); };
  }, [user]);

  const removeFromCookLater = async (recipeId) => {
    try {
      const existing = cookLater.find(i => i.id === recipeId);
      if (!existing) return;
      await updateDoc(doc(db, "users", user.uid), {
        cookLater: arrayRemove(existing)
      });
      toast.success("Removed from Cook Later");
    } catch { toast.error("Couldn't remove"); }
  };

  const saveNote = async (recipeId) => {
    try {
      const existing = cookLater.find(i => i.id === recipeId);
      if (!existing) return;
      const updated = cookLater.map(i =>
        i.id === recipeId ? { ...i, note: noteText.trim() } : i
      );
      await updateDoc(doc(db, "users", user.uid), { cookLater: updated });
      setCookLater(updated);
      setEditingNote(null);
      setNoteText("");
      toast.success("Note saved! 📝");
    } catch { toast.error("Couldn't save note"); }
  };

  const markCooked = async (recipeId) => {
    try {
      const existing = cookLater.find(i => i.id === recipeId);
      if (!existing) return;
      await updateDoc(doc(db, "users", user.uid), {
        cookLater: arrayRemove(existing)
      });
      toast.success("Nice! Marked as cooked! 👨‍🍳✅");
    } catch { toast.error("Couldn't update"); }
  };

  const cookedCount = cookLater.filter(i => i.cooked).length;

  const SkeletonCard = () => (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite" }}>
      <div style={{ height: 140, background: "var(--input-border)" }} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ height: 16, background: "var(--input-border)", borderRadius: 4, width: "70%" }} />
        <div style={{ height: 12, background: "var(--input-border)", borderRadius: 4, width: "50%" }} />
        <div style={{ height: 36, background: "var(--input-border)", borderRadius: 8 }} />
      </div>
    </div>
  );

  const enriched = cookLater.map(item => ({
    ...item,
    recipe: recipes.find(r => r.id === item.id)
  })).filter(i => i.recipe);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "24px 28px" }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Cook Later</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {loading ? "Loading..." : `${enriched.length} saved · ${cookedCount} cooked`}
          </p>
        </div>
        {enriched.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(88,101,242,.1)", border: "1px solid rgba(88,101,242,.25)", borderRadius: 10, padding: "8px 14px" }}>
            <Bell size={14} color="var(--accent)" />
            <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{enriched.length} recipe{enriched.length !== 1 ? "s" : ""} waiting</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {enriched.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Cooking progress</span>
            <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>{cookedCount}/{enriched.length} cooked</span>
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, height: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "var(--success)", borderRadius: 8, width: `${enriched.length ? (cookedCount / enriched.length) * 100 : 0}%`, transition: "width .4s ease" }} />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && enriched.length === 0 && (
        <div style={{ textAlign: "center", paddingTop: 80, color: "var(--text-muted)" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🔔</div>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No recipes saved yet</p>
          <p style={{ fontSize: 14 }}>Click the 🔔 on any recipe card to save it here with a note</p>
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Cards */}
      {!loading && enriched.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {enriched.map(({ id, note, recipe }) => (
            <div key={id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column", transition: "border-color .2s" }}
              onMouseOver={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              {/* Image */}
              <div onClick={() => onOpen(recipe)} style={{ height: 140, overflow: "hidden", background: "#0a0c14", cursor: "pointer", position: "relative" }}>
                {recipe.image
                  ? <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🍽️</div>
                }
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.5), transparent)" }} />
              </div>

              {/* Body */}
              <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                <div onClick={() => onOpen(recipe)} style={{ cursor: "pointer" }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{recipe.title}</h3>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} />{recipe.cookTime || "?"}m
                    </span>
                    <span style={{ fontSize: 12, background: "rgba(88,101,242,.15)", color: "var(--accent)", padding: "1px 8px", borderRadius: 10 }}>
                      {recipe.difficulty || "Easy"}
                    </span>
                  </div>
                </div>

                {/* Note */}
                {editingNote === id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                      placeholder="Add a personal note… (e.g. try with less salt)"
                      autoFocus
                      style={{ width: "100%", padding: "8px 10px", background: "var(--bg-main)", border: "1px solid var(--accent)", borderRadius: 8, color: "var(--text-primary)", fontSize: 13, resize: "none", minHeight: 72, fontFamily: "var(--font)" }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => saveNote(id)} style={{ flex: 1, padding: "7px", background: "var(--accent)", color: "#fff", borderRadius: 7, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                        <Check size={13} /> Save
                      </button>
                      <button onClick={() => { setEditingNote(null); setNoteText(""); }} style={{ padding: "7px 10px", background: "none", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text-muted)" }}>
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setEditingNote(id); setNoteText(note || ""); }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px 10px", background: note ? "rgba(88,101,242,.08)" : "var(--bg-main)", border: `1px solid ${note ? "rgba(88,101,242,.25)" : "var(--input-border)"}`, borderRadius: 8, cursor: "pointer", textAlign: "left", width: "100%" }}
                  >
                    <StickyNote size={14} color={note ? "var(--accent)" : "var(--text-muted)"} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 13, color: note ? "var(--text-primary)" : "var(--text-muted)", lineHeight: 1.5 }}>
                      {note || "Add a personal note…"}
                    </span>
                  </button>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  <button onClick={() => markCooked(id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", background: "rgba(59,165,93,.12)", border: "1px solid rgba(59,165,93,.3)", borderRadius: 8, color: "var(--success)", fontSize: 13, fontWeight: 600, transition: "all .15s" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(59,165,93,.22)"}
                    onMouseOut={e => e.currentTarget.style.background = "rgba(59,165,93,.12)"}
                  >
                    <Check size={14} /> Cooked it!
                  </button>
                  <button onClick={() => removeFromCookLater(id)} style={{ padding: "8px 10px", background: "rgba(237,66,69,.1)", border: "1px solid rgba(237,66,69,.25)", borderRadius: 8, color: "var(--danger)", display: "flex", alignItems: "center", transition: "all .15s" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(237,66,69,.2)"}
                    onMouseOut={e => e.currentTarget.style.background = "rgba(237,66,69,.1)"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
