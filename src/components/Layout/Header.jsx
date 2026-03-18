import { Menu, Search } from "lucide-react";
const PAGE_TITLES = {
  discover:    { title: "Discover",      emoji: "🏠" },
  trending:    { title: "Trending",      emoji: "🔥" },
  favorites:   { title: "Favorites",     emoji: "⭐" },
  cooklater:   { title: "Cook Later",    emoji: "🔔" },
  myrecipes:   { title: "My Recipes",    emoji: "📖" },
  addrecipe:   { title: "Add Recipe",    emoji: "➕" },
  mealplanner: { title: "Meal Planner",  emoji: "🗓️" },
  profile:     { title: "Profile",       emoji: "👤" },
};
export default function Header({ page, search, setSearch, onMenuClick }) {
  const { title, emoji } = PAGE_TITLES[page] || {};
  return (
    <header style={{ height: 56, background: "var(--bg-main)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 20px", gap: 14, flexShrink: 0 }}>
      <button onClick={onMenuClick} className="hamburger" style={{ background: "none", color: "var(--text-muted)", display: "none", padding: 4 }}><Menu size={20} /></button>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <h2 style={{ fontWeight: 700, fontSize: 17 }}>{title}</h2>
        <span style={{ background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, letterSpacing: ".06em" }}>LIVE</span>
      </div>
      {["discover","trending","favorites","myrecipes"].includes(page) && (
        <div style={{ position: "relative", maxWidth: 280, width: "100%" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search recipes…" style={{ width: "100%", padding: "7px 12px 7px 32px", background: "var(--bg-card)", border: "1px solid var(--input-border)", borderRadius: 8, color: "var(--text-primary)", fontSize: 13 }} />
        </div>
      )}
    </header>
  );
}
