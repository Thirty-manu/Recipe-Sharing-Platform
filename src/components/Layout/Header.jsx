import { Menu, Search, LogOut, Home, TrendingUp, Star, Bell, BookOpen, PlusCircle, CalendarDays, User, MessageCircle } from "lucide-react";

const PAGE_TITLES = {
  discover:    { title: "Discover",        icon: Home },
  trending:    { title: "Trending",         icon: TrendingUp },
  favorites:   { title: "Favorites",        icon: Star },
  cooklater:   { title: "Cook Later",       icon: Bell },
  myrecipes:   { title: "My Recipes",       icon: BookOpen },
  addrecipe:   { title: "Add Recipe",       icon: PlusCircle },
  mealplanner: { title: "Meal Planner",     icon: CalendarDays },
  chat:        { title: "Community Chat",   icon: MessageCircle },
  profile:     { title: "Profile",          icon: User },
};

export default function Header({ page, search, setSearch, onMenuClick, user, onLogout }) {
  const { title, icon: PageIcon } = PAGE_TITLES[page] || {};
  return (
    <header style={{
      height: 56, background: "var(--bg-main)", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 20px", gap: 14, flexShrink: 0
    }}>
      <button onClick={onMenuClick} className="hamburger"
        style={{ background: "none", color: "var(--text-muted)", display: "none", padding: 4 }}>
        <Menu size={20} />
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
        {PageIcon && <PageIcon size={18} color="var(--accent)" />}
        <h2 style={{ fontWeight: 700, fontSize: 17 }}>{title}</h2>
        <span style={{
          background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700,
          padding: "2px 7px", borderRadius: 4, letterSpacing: ".06em"
        }}>LIVE</span>
      </div>

      {["discover","trending","favorites","myrecipes"].includes(page) && (
        <div style={{ position: "relative", maxWidth: 280, width: "100%" }}>
          <Search size={14} style={{
            position: "absolute", left: 10, top: "50%",
            transform: "translateY(-50%)", color: "var(--text-muted)"
          }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search recipes…"
            style={{
              width: "100%", padding: "7px 12px 7px 32px",
              background: "var(--bg-card)", border: "1px solid var(--input-border)",
              borderRadius: 8, color: "var(--text-primary)", fontSize: 13
            }}
          />
        </div>
      )}

      <div className="mobile-user" style={{ display: "none", alignItems: "center", gap: 8 }}>
        <img src={user?.avatar} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
        <button onClick={onLogout} style={{
          background: "rgba(237,66,69,.12)", border: "1px solid rgba(237,66,69,.3)",
          color: "var(--danger)", borderRadius: 8, padding: "6px 10px",
          display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600
        }}>
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </header>
  );
}
