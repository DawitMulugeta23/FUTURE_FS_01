import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import About from "./components/About";
import AdminPanel from "./components/AdminPanel";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { settingsAPI } from "./services/api";

// Component to handle dynamic admin route
const AppRoutes = () => {
  const isDark = useSelector((state) => state.nav.darkMode);
  const [adminPath, setAdminPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminPath = async () => {
      try {
        const response = await settingsAPI.getAdminPath();
        setAdminPath(response.data.adminPath);
      } catch (error) {
        console.error("Error fetching admin path:", error);
        setAdminPath("love"); // Fallback default
      } finally {
        setLoading(false);
      }
    };
    fetchAdminPath();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-gray-50"}`}
      >
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const MainApp = () => (
    <div
      className={`font-sans transition-all duration-500 ${isDark ? "bg-slate-900" : "bg-white"}`}
    >
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer
        className={`py-4 text-center text-sm border-t transition-all duration-500 ${
          isDark
            ? "bg-slate-900 text-gray-400 border-slate-800"
            : "bg-white text-gray-600 border-gray-200"
        }`}
      >
        © {new Date().getFullYear()} - Developed by Dawit Mulugeta | CS Student
        at DBU
      </footer>
    </div>
  );

  return (
    <Routes>
      {/* Dynamic admin route - path comes from database */}
      <Route path={`/${adminPath}`} element={<AdminPanel />} />
      {/* Main site */}
      <Route path="/*" element={<MainApp />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
