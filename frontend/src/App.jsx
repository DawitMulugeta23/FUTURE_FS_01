import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Route,
  HashRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import About from "./components/About";
import AdminPanel from "./components/AdminPanel";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

const MainApp = () => {
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.nav.darkMode);
  useEffect(() => {
    const redirectPath = sessionStorage.getItem("redirectPath");
    if (redirectPath && redirectPath !== "/") {
      sessionStorage.removeItem("redirectPath");
      navigate(redirectPath);
    }
  }, [navigate]);
  return (
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
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
