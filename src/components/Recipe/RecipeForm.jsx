import { useState } from "react";
import { Plus, X, Save } from "lucide-react";
import { addRecipe, updateRecipe } from "../../firebase/firestore";
import toast from "react-hot-toast";
const CATEGORIES = ["Breakfast","Lunch","Dinner","Snack","Dessert","Drink","Vegan","Vegetarian","Keto","Quick"];
const DIFFICULTIES = ["Easy","Medium","Hard"];
const inputStyle = { width: "100%", padding: "10px 14px", background: "var(--bg-card)", border: "1px solid var(--input-border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 14 };
const labelStyle = { fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6, display: "block" };
export default function RecipeForm({ user, recipe, onDone }) {
  const editing = !!recipe;
  const [form, setForm] = useState({ title: recipe?.title || "", description: recipe?.description || "", image: recipe?.image || "", cookTime: recipe?.cookTime || "", servings: recipe?.servings || "", difficulty: recipe?.difficulty || "Easy", category: recipe?.category || "Dinner", ingredients: recipe?.ingredients || [""], steps: recipe?.steps || [""], tags: recipe?.tags?.join(", ") || "" });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setArr = (k, i, v) => setForm(f => { const a = [...f[k]]; a[i] = v; return { ...f, [k]: a }; });
  const addArr = (k) => setForm(f => ({ ...f, [k]: [...f[k], ""] }));
  const removeArr = (k, i) => setForm(f => { const a = f[k].filter((_, idx) => idx !== i); return { ...f, [k]: a.length ? a : [""] }; });
  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    try {
      const data = { ...form, tags: form.tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean), cookTime: Number(form.cookTime) || 0, servings: Number(form.servings) || 0, ingredients: form.ingredients.filter(Boolean), steps: form.steps.filter(Boolean), authorId: user.uid, authorName: user.name, authorAvatar: user.avatar };
      if (editing) { await updateRecipe(recipe.id, data); toast.success("Recipe updated! ✅"); }
      else { await addRecipe(data); toast.success("Recipe shared! 🍳"); }
      onDone?.();
    } catch { toast.error("Failed to save recipe"); }
    finally { setSaving(false); }
  };
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      <h3 style={{ fontWeight: 800, fontSize: 20 }}>{editing ? "Edit Recipe" : "Share a New Recipe"}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Title *</label><input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Creamy Pasta Carbonara" /></div>
        <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Short description…" /></div>
        <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Image URL</label><input style={inputStyle} value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://…" /></div>
        <div><label style={labelStyle}>Cook Time (mins)</label><input type="number" style={inputStyle} value={form.cookTime} onChange={e => set("cookTime", e.target.value)} /></div>
        <div><label style={labelStyle}>Servings</label><input type="number" style={inputStyle} value={form.servings} onChange={e => set("servings", e.target.value)} /></div>
        <div><label style={labelStyle}>Difficulty</label><select style={inputStyle} value={form.difficulty} onChange={e => set("difficulty", e.target.value)}>{DIFFICULTIES.map(d => <option key={d}>{d}</option>)}</select></div>
        <div><label style={labelStyle}>Category</label><select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
      </div>
      <div>
        <label style={labelStyle}>Ingredients</label>
        {form.ingredients.map((ing, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}><input style={inputStyle} value={ing} onChange={e => setArr("ingredients", i, e.target.value)} placeholder={`Ingredient ${i + 1}`} /><button onClick={() => removeArr("ingredients", i)} style={{ background: "none", color: "var(--text-muted)", padding: "0 6px" }}><X size={16} /></button></div>)}
        <button onClick={() => addArr("ingredients")} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent)", background: "none", fontSize: 13, fontWeight: 600 }}><Plus size={15} /> Add ingredient</button>
      </div>
      <div>
        <label style={labelStyle}>Instructions</label>
        {form.steps.map((step, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}><span style={{ minWidth: 24, height: 24, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, marginTop: 10, flexShrink: 0 }}>{i + 1}</span><textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60, flex: 1 }} value={step} onChange={e => setArr("steps", i, e.target.value)} placeholder={`Step ${i + 1}…`} /><button onClick={() => removeArr("steps", i)} style={{ background: "none", color: "var(--text-muted)", padding: "10px 4px" }}><X size={16} /></button></div>)}
        <button onClick={() => addArr("steps")} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent)", background: "none", fontSize: 13, fontWeight: 600 }}><Plus size={15} /> Add step</button>
      </div>
      <div><label style={labelStyle}>Tags (comma-separated)</label><input style={inputStyle} value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="e.g. italian, pasta, creamy" /></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        {onDone && <button onClick={onDone} style={{ padding: "10px 20px", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600 }}>Cancel</button>}
        <button onClick={handleSubmit} disabled={saving} style={{ padding: "10px 24px", borderRadius: 8, background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, opacity: saving ? .6 : 1 }}><Save size={15} />{saving ? "Saving…" : editing ? "Update Recipe" : "Share Recipe"}</button>
      </div>
    </div>
  );
}
