import About from "./components/About"; // About ገጽ እዚህ import ተደርጓል
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

function App() {
  return (
    <div className="font-sans text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <About /> {/* About ገጽ እዚህ ይታያል */}
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="py-8 bg-black text-white text-center text-sm border-t border-gray-800">
        © {new Date().getFullYear()} - Developed by CS Student @ DBU
      </footer>
    </div>
  );
}

export default App;
