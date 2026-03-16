import { Home, TrendingUp, Star, BookOpen, PlusCircle, User, LogOut, X } from "lucide-react";
const NAV = [
  { id: "discover", label: "Discover", icon: Home },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "favorites", label: "Favorites", icon: Star },
  { id: "myrecipes", label: "My Recipes", icon: BookOpen },
  { id: "addrecipe", label: "Add Recipe", icon: PlusCircle },
  { id: "profile", label: "Profile", icon: User },
];
export default function Sidebar({ page, setPage, user, onLogout, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 40, display: "none" }} className="mobile-overlay" />}
      <aside style={{ width: 240, background: "var(--bg-sidebar)", height: "100vh", display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)", flexShrink: 0, position: "relative", zIndex: 50, transition: "transform .25s ease" }} className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🍳</span>
            <span style={{ fontWeight: 800, fontSize: 18 }}>Recipe<span style={{ color: "var(--accent)" }}>Hub</span></span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="close-sidebar" style={{ background: "none", color: "var(--text-muted)", display: "none" }}><X size={18} /></button>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: ".08em", padding: "6px 8px 8px", textTransform: "uppercase" }}>Navigation</p>
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = page === id;
            return (
              <button key={id} onClick={() => { setPage(id); setMobileOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, marginBottom: 2, background: active ? "rgba(88,101,242,.18)" : "none", color: active ? "var(--accent)" : "var(--text-muted)", fontWeight: active ? 600 : 400, fontSize: 14, transition: "all .15s" }} onMouseOver={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.color = "var(--text-primary)"; }}} onMouseOut={e => { if (!active) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-muted)"; }}}>
                <Icon size={17} />{label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8 }}>
            <img src={user.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Chef</p>
            </div>
            <button onClick={onLogout} title="Sign out" style={{ background: "none", color: "var(--text-muted)", padding: 4, borderRadius: 6 }} onMouseOver={e => e.currentTarget.style.color = "var(--danger)"} onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}><LogOut size={16} /></button>
          </div>
        </div>
      </aside>
    </>
  );
}
