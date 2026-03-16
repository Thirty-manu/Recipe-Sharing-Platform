import { Shield } from "lucide-react";
import RecipeForm from "../components/Recipe/RecipeForm";
import { isAdmin } from "../firebase/firestore";

export default function AddRecipe({ user, onDone }) {
  if (!isAdmin(user)) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: "var(--text-muted)" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(237,66,69,.1)", border: "1px solid rgba(237,66,69,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield size={30} color="#ed4245" />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Admin Access Only</p>
          <p style={{ fontSize: 14 }}>Only the super admin can share recipes on this platform.</p>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: "24px 28px", height: "100%", overflowY: "auto" }}>
      <RecipeForm user={user} onDone={onDone} />
    </div>
  );
}
