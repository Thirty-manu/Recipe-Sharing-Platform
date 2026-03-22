import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./firebase/config";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Auth/Login";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import RecipeModal from "./components/Recipe/RecipeModal";
import ScrollToTop from "./components/UI/ScrollToTop";
import Discover from "./pages/Discover";
import Trending from "./pages/Trending";
import Favorites from "./pages/Favorites";
import MyRecipes from "./pages/MyRecipes";
import AddRecipe from "./pages/AddRecipe";
import Profile from "./pages/Profile";
import MealPlanner from "./pages/MealPlanner";
import CookLater from "./pages/CookLater";
import Chat from "./pages/Chat";
import "./styles/globals.css";

export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [page, setPage] = useState("discover");
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalRecipe, setModalRecipe] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // ── Handle browser back button ──────────────────────────
  useEffect(() => {
    // Push initial state
    window.history.pushState({ page: "discover" }, "", "");

    const handlePopState = (e) => {
      if (e.state?.page) {
        setPage(e.state.page);
      } else {
        // Instead of leaving the app, go to discover
        setPage("discover");
        window.history.pushState({ page: "discover" }, "", "");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Push state when page changes
  const navigateTo = (newPage) => {
    window.history.pushState({ page: newPage }, "", "");
    setPage(newPage);
    setSearch("");
  };

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), snap => {
      if (snap.exists()) setUserProfile({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [user]);

  if (loading) return (
    <div style={{
      height: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg-main)"
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: "rgba(88,101,242,.15)", border: "1px solid rgba(88,101,242,.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "pulse 1.5s ease-in-out infinite"
      }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent)" }} />
      </div>
    </div>
  );

  if (!user) return <Login onLogin={login} />;

  const pageProps = { user, userProfile, search, onOpen: setModalRecipe };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar
          page={page} setPage={navigateTo} user={user} onLogout={logout}
          mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Header
            page={page}
            search={search}
            setSearch={setSearch}
            onMenuClick={() => setMobileOpen(true)}
            user={user}
            onLogout={logout}
          />
          <main data-scrollable style={{ flex: 1, overflow: "hidden" }}>
            {page === "discover"    && <Discover    {...pageProps} />}
            {page === "trending"    && <Trending    {...pageProps} />}
            {page === "favorites"   && <Favorites   {...pageProps} />}
            {page === "cooklater"   && <CookLater   user={user} onOpen={setModalRecipe} />}
            {page === "myrecipes"   && <MyRecipes   {...pageProps} />}
            {page === "addrecipe"   && <AddRecipe   user={user} onDone={() => navigateTo("myrecipes")} />}
            {page === "mealplanner" && <MealPlanner user={user} />}
            {page === "chat"        && <Chat        user={user} />}
            {page === "profile"     && <Profile     user={user} userProfile={userProfile} />}
          </main>
        </div>
      </div>

      {modalRecipe && (
        <RecipeModal
          recipe={modalRecipe} user={user}
          userProfile={userProfile} onClose={() => setModalRecipe(null)}
        />
      )}

      <ScrollToTop />

      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: "#1a1d2e", color: "#e3e5e8",
          border: "1px solid #1e2130",
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }
      }} />
    </>
  );
}
