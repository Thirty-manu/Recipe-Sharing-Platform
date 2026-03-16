import { useMyRecipes, useAllRecipes } from "../hooks/useRecipes";
import { BookOpen, Heart, Star } from "lucide-react";
export default function Profile({ user, userProfile }) {
  const { recipes: myRecipes } = useMyRecipes(user.uid);
  const { recipes: allRecipes } = useAllRecipes();
  const totalLikes = myRecipes.reduce((sum, r) => sum + (r.likes || 0), 0);
  const favCount = userProfile?.favorites?.length || 0;
  const stats = [{ icon: BookOpen, label: "Recipes Shared", value: myRecipes.length, color: "var(--accent)" }, { icon: Heart, label: "Total Likes", value: totalLikes, color: "var(--danger)" }, { icon: Star, label: "Favorites", value: favCount, color: "#faa61a" }];
  return (
    <div style={{ padding: "24px 28px", height: "100%", overflowY: "auto" }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 32, display: "flex", gap: 24, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
        <img src={user.avatar} alt="" style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid var(--accent)" }} />
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>{user.name}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{user.email}</p>
          <p style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, marginTop: 6 }}>👨‍🍳 Home Chef</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={20} color={color} /></div>
            <div><p style={{ fontSize: 24, fontWeight: 800 }}>{value}</p><p style={{ color: "var(--text-muted)", fontSize: 13 }}>{label}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px" }}>
        <h4 style={{ fontWeight: 700, marginBottom: 14 }}>Community</h4>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Total recipes in the community: <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{allRecipes.length}</span></p>
      </div>
    </div>
  );
}
