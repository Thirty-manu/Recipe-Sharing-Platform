import { useMyRecipes, useAllRecipes } from "../hooks/useRecipes";
import { BookOpen, Heart, Star, LogOut, Mail, Shield } from "lucide-react";
import { isAdmin } from "../firebase/firestore";
import toast from "react-hot-toast";

export default function Profile({ user, userProfile, onLogout }) {
  const { recipes: myRecipes } = useMyRecipes(user.uid);
  const { recipes: allRecipes } = useAllRecipes();
  const totalLikes = myRecipes.reduce((sum, r) => sum + (r.likes || 0), 0);
  const favCount = userProfile?.favorites?.length || 0;
  const admin = isAdmin(user);

  const handleLogout = () => {
    toast.success("Signed out successfully!");
    setTimeout(() => onLogout(), 800);
  };

  const stats = [
    { icon: BookOpen, label: "Recipes Shared", value: myRecipes.length, color: "var(--accent)" },
    { icon: Heart,    label: "Total Likes",    value: totalLikes,        color: "var(--danger)" },
    { icon: Star,     label: "Favorites",      value: favCount,          color: "#faa61a" },
  ];

  return (
    <div className="page-scroll" style={{ padding: "24px 28px", height: "100%", overflowY: "auto" }}>

      {/* Hero card */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 16, padding: 28, marginBottom: 20
      }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <img src={user.avatar} alt="" style={{
              width: 80, height: 80, borderRadius: "50%",
              border: "3px solid var(--accent)", objectFit: "cover"
            }} />
            {admin && (
              <div style={{
                position: "absolute", bottom: 0, right: 0,
                width: 24, height: 24, borderRadius: "50%",
                background: "var(--accent)", border: "2px solid var(--bg-card)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Shield size={12} color="#fff" />
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</h2>
              {admin && (
                <span style={{
                  fontSize: 11, background: "rgba(88,101,242,.15)",
                  border: "1px solid rgba(88,101,242,.3)",
                  color: "var(--accent)", padding: "2px 8px",
                  borderRadius: 20, fontWeight: 700
                }}>Super Admin</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: 14 }}>
              <Mail size={13} />
              <span>{user.email}</span>
            </div>
            <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, marginTop: 6 }}>
              {admin ? "👨‍🍳 Head Chef & Admin" : "👨‍🍳 Home Chef"}
            </p>
          </div>
        </div>

        {/* Sign out button inside profile */}
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, padding: "11px 20px",
          background: "rgba(237,66,69,.08)", border: "1px solid rgba(237,66,69,.25)",
          borderRadius: 10, color: "var(--danger)", fontSize: 14, fontWeight: 600,
          transition: "all .2s", cursor: "pointer"
        }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(237,66,69,.18)"; e.currentTarget.style.borderColor = "rgba(237,66,69,.5)"; }}
          onMouseOut={e => { e.currentTarget.style.background = "rgba(237,66,69,.08)"; e.currentTarget.style.borderColor = "rgba(237,66,69,.25)"; }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 800 }}>{value}</p>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Community */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 14, padding: "20px 24px"
      }}>
        <h4 style={{ fontWeight: 700, marginBottom: 14 }}>Community</h4>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Total recipes in the community:{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{allRecipes.length}</span>
        </p>
      </div>
    </div>
  );
}
