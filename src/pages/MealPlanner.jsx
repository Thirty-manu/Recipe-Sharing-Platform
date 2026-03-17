import { useState, useEffect } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAllRecipes } from "../hooks/useRecipes";
import { X, ShoppingCart, ChefHat, Plus, Check, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MEALS = ["Breakfast","Lunch","Dinner"];
const MEAL_ICONS = { Breakfast: "🌅", Lunch: "☀️", Dinner: "🌙" };

// Skeleton cell
const SkeletonCell = () => (
  <div style={{ minHeight: 80, borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
);

export default function MealPlanner({ user }) {
  const { recipes } = useAllRecipes();
  const [plan, setPlan] = useState({});
  const [showPicker, setShowPicker] = useState(null);
  const [showShopping, setShowShopping] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "mealPlans", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setPlan(snap.data().plan || {});
      setLoading(false);
    }, () => {
      // On error still stop loading
      setLoading(false);
    });
    // Stop skeleton after 1.5s max regardless
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => { unsub(); clearTimeout(timer); };
  }, [user]);

  const savePlan = async (newPlan) => {
    try { await setDoc(doc(db, "mealPlans", user.uid), { plan: newPlan, updatedAt: new Date() }); }
    catch { toast.error("Couldn't save plan"); }
  };

  const addMeal = async (recipe) => {
    const { day, meal } = showPicker;
    const key = `${day}_${meal}`;
    const newPlan = { ...plan, [key]: { id: recipe.id, title: recipe.title, image: recipe.image, cookTime: recipe.cookTime, ingredients: recipe.ingredients || [] } };
    setPlan(newPlan);
    await savePlan(newPlan);
    setShowPicker(null);
    setSearch("");
    toast.success(`Added to ${meal} on ${day}! 🍽️`);
  };

  const removeMeal = async (day, meal) => {
    const key = `${day}_${meal}`;
    const newPlan = { ...plan };
    delete newPlan[key];
    setPlan(newPlan);
    await savePlan(newPlan);
    toast.success("Removed from plan");
  };

  const clearPlan = async () => {
    if (!confirm("Clear the entire meal plan?")) return;
    setPlan({});
    await savePlan({});
    toast.success("Meal plan cleared");
  };

  const generateShoppingList = () => {
    const allIngredients = {};
    Object.values(plan).forEach(meal => {
      meal.ingredients?.forEach(ing => {
        const key = ing.toLowerCase().trim();
        allIngredients[key] = (allIngredients[key] || 0) + 1;
      });
    });
    return Object.keys(allIngredients);
  };

  const shoppingList = generateShoppingList();
  const plannedCount = Object.keys(plan).length;
  const filteredRecipes = recipes.filter(r => r.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "24px 28px" }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Weekly Meal Planner</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {loading ? "Loading your plan..." : `${plannedCount} of ${DAYS.length * MEALS.length} slots filled`}
          </p>
        </div>
        {!loading && plannedCount > 0 && (
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowShopping(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", background: "var(--accent)", color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
              <ShoppingCart size={15} /> Shopping List ({shoppingList.length})
            </button>
            <button onClick={clearPlan} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)", borderRadius: 8, fontSize: 14 }}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, height: 8, marginBottom: 28, overflow: "hidden" }}>
        <div style={{ height: "100%", background: loading ? "var(--input-border)" : "var(--accent)", borderRadius: 8, width: loading ? "30%" : `${(plannedCount / (DAYS.length * MEALS.length)) * 100}%`, transition: "width .4s ease", animation: loading ? "pulse 1.5s ease-in-out infinite" : "none" }} />
      </div>

      {/* Grid */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 700 }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "100px repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
            <div />
            {DAYS.map(day => (
              <div key={day} style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", padding: "6px 0" }}>
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Meal rows */}
          {MEALS.map(meal => (
            <div key={meal} style={{ display: "grid", gridTemplateColumns: "100px repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 4px" }}>
                <span style={{ fontSize: 16 }}>{MEAL_ICONS[meal]}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{meal}</span>
              </div>
              {DAYS.map(day => {
                const key = `${day}_${meal}`;
                const entry = plan[key];

                // Show skeleton while loading
                if (loading) return <SkeletonCell key={day} />;

                return (
                  <div key={day}>
                    {entry ? (
                      <div style={{ background: "var(--bg-card)", border: "1px solid var(--accent)", borderRadius: 10, padding: "8px", position: "relative", minHeight: 80, display: "flex", flexDirection: "column", gap: 4 }}>
                        <button onClick={() => removeMeal(day, meal)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(237,66,69,.8)", color: "#fff", borderRadius: 4, padding: "2px 4px", display: "flex", zIndex: 1 }}>
                          <X size={10} />
                        </button>
                        {entry.image && <img src={entry.image} alt="" style={{ width: "100%", height: 45, objectFit: "cover", borderRadius: 6 }} />}
                        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{entry.title}</p>
                        {entry.cookTime > 0 && <p style={{ fontSize: 10, color: "var(--text-muted)" }}>⏱ {entry.cookTime}m</p>}
                      </div>
                    ) : (
                      <button onClick={() => setShowPicker({ day, meal })}
                        style={{ width: "100%", minHeight: 80, background: "var(--bg-card)", border: "1px dashed var(--input-border)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", transition: "all .15s", cursor: "pointer" }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = "var(--input-border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                      >
                        <Plus size={18} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Picker Modal */}
      {showPicker && (
        <div onClick={() => { setShowPicker(null); setSearch(""); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg-main)", border: "1px solid var(--border)", borderRadius: 18, width: "100%", maxWidth: 520, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 16 }}>Pick a Recipe</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>{MEAL_ICONS[showPicker.meal]} {showPicker.meal} · {showPicker.day}</p>
                </div>
                <button onClick={() => { setShowPicker(null); setSearch(""); }} style={{ background: "none", color: "var(--text-muted)" }}><X size={18} /></button>
              </div>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search recipes…" autoFocus
                style={{ width: "100%", padding: "9px 14px", background: "var(--bg-card)", border: "1px solid var(--input-border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 14 }} />
            </div>
            <div style={{ overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredRecipes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                  <ChefHat size={32} style={{ marginBottom: 10, opacity: .4 }} />
                  <p>No recipes found</p>
                </div>
              ) : filteredRecipes.map(r => (
                <button key={r.id} onClick={() => addMeal(r)}
                  style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 12px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "border-color .15s" }}
                  onMouseOver={e => e.currentTarget.style.borderColor = "var(--accent)"}
                  onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  {r.image
                    ? <img src={r.image} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    : <div style={{ width: 52, height: 52, borderRadius: 8, background: "#0a0c14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🍽️</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", marginBottom: 3 }}>{r.title}</p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>⏱ {r.cookTime || "?"}m</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>👥 {r.servings || "?"}</span>
                      <span style={{ fontSize: 12, background: "rgba(88,101,242,.15)", color: "var(--accent)", padding: "1px 7px", borderRadius: 10 }}>{r.difficulty || "Easy"}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShopping && (
        <div onClick={() => setShowShopping(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg-main)", border: "1px solid var(--border)", borderRadius: 18, width: "100%", maxWidth: 460, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}><ShoppingCart size={18} color="var(--accent)" /> Shopping List</h4>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 3 }}>{shoppingList.length} ingredients from {plannedCount} meals</p>
              </div>
              <button onClick={() => setShowShopping(false)} style={{ background: "none", color: "var(--text-muted)" }}><X size={18} /></button>
            </div>
            <div style={{ overflowY: "auto", padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>This Week's Meals</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {Object.entries(plan).map(([key, meal]) => {
                    const [day, mealType] = key.split("_");
                    return (
                      <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "var(--text-muted)" }}>{MEAL_ICONS[mealType]} {day.slice(0,3)} {mealType}</span>
                        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{meal.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Ingredients to Buy</p>
              {shoppingList.map((item, i) => {
                const checked = checkedItems[item];
                return (
                  <button key={i} onClick={() => setCheckedItems(p => ({ ...p, [item]: !p[item] }))}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: checked ? "rgba(59,165,93,.08)" : "var(--bg-card)", border: `1px solid ${checked ? "rgba(59,165,93,.3)" : "var(--border)"}`, borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "all .15s" }}
                  >
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checked ? "var(--success)" : "var(--input-border)"}`, background: checked ? "var(--success)" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                      {checked && <Check size={13} color="#fff" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: 14, color: checked ? "var(--text-muted)" : "var(--text-primary)", textDecoration: checked ? "line-through" : "none", flex: 1, textTransform: "capitalize" }}>{item}</span>
                  </button>
                );
              })}
              {Object.values(checkedItems).filter(Boolean).length > 0 && (
                <button onClick={() => setCheckedItems({})} style={{ marginTop: 8, padding: "9px", background: "none", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13 }}>
                  Clear all checks
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
