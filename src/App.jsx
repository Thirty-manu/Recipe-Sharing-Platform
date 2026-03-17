import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./firebase/config";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Auth/Login";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import RecipeModal from "./components/Recipe/RecipeModal";
import Discover from "./pages/Discover";
import Trending from "./pages/Trending";
import Favorites from "./pages/Favorites";
import MyRecipes from "./pages/MyRecipes";
import AddRecipe from "./pages/AddRecipe";
import Profile from "./pages/Profile";
import MealPlanner from "./pages/MealPlanner";
import "./styles/globals.css";

export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [page, setPage] = useState("discover");
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalRecipe, setModalRecipe] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), snap => {
      if (snap.exists()) setUserProfile({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [user]);

  useEffect(() => { setSearch(""); }, [page]);

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-main)" }}>
      <div style={{ fontSize: 48 }}>🍳</div>
    </div>
  );

  if (!user) return <Login onLogin={login} />;

  const pageProps = { user, userProfile, search, onOpen: setModalRecipe };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .sidebar { position: fixed !important; left: 0; top: 0; transform: translateX(-100%); }
          .sidebar.sidebar-open { transform: translateX(0) !important; }
          .mobile-overlay { display: block !important; }
          .hamburger { display: flex !important; }
          .close-sidebar { display: flex !important; }
        }
      `}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar page={page} setPage={setPage} user={user} onLogout={logout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Header page={page} search={search} setSearch={setSearch} onMenuClick={() => setMobileOpen(true)} />
          <main style={{ flex: 1, overflow: "hidden" }}>
            {page === "discover"    && <Discover    {...pageProps} />}
            {page === "trending"    && <Trending    {...pageProps} />}
            {page === "favorites"   && <Favorites   {...pageProps} />}
            {page === "myrecipes"   && <MyRecipes   {...pageProps} />}
            {page === "addrecipe"   && <AddRecipe   user={user} onDone={() => setPage("myrecipes")} />}
            {page === "mealplanner" && <MealPlanner user={user} />}
            {page === "profile"     && <Profile     user={user} userProfile={userProfile} />}
          </main>
        </div>
      </div>
      {modalRecipe && <RecipeModal recipe={modalRecipe} user={user} userProfile={userProfile} onClose={() => setModalRecipe(null)} />}
      <Toaster position="bottom-right" toastOptions={{ style: { background: "#1a1d2e", color: "#e3e5e8", border: "1px solid #1e2130", fontFamily: "'Plus Jakarta Sans', sans-serif" } }} />
    </>
  );
}
