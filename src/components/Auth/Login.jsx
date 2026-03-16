import { Chrome } from "lucide-react";
import toast from "react-hot-toast";
export default function Login({ onLogin }) {
  const handle = async () => { try { await onLogin(); } catch { toast.error("Sign-in failed. Try again."); } };
  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-main)", flexDirection: "column", gap: 32 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🍳</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Recipe<span style={{ color: "var(--accent)" }}>Hub</span></h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>Discover, share & cook amazing recipes</p>
      </div>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "40px 48px", textAlign: "center", display: "flex", flexDirection: "column", gap: 20, minWidth: 320 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Welcome back</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Sign in to access your recipes</p>
        </div>
        <button onClick={handle} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "var(--accent)", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 15, fontWeight: 600, transition: "background .2s" }} onMouseOver={e => e.currentTarget.style.background = "var(--accent-hover)"} onMouseOut={e => e.currentTarget.style.background = "var(--accent)"}>
          <Chrome size={18} /> Continue with Google
        </button>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Project 3 of 20 · by Emmanuel Kipkemboi</p>
    </div>
  );
}
