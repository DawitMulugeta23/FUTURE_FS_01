import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveSection, toggleDarkMode } from "../features/navSlice";

const Navbar = () => {
  const { darkMode, activeSection } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const navItems = ["home", "about", "skills", "projects", "contact"];

  const handleNavClick = (item) => {
    dispatch(setActiveSection(item));
    setIsOpen(false);
    // Scroll to section
    const element = document.getElementById(item);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item));
      const scrollPosition = window.scrollY + 100; // Offset for navbar

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            if (activeSection !== navItems[i]) {
              dispatch(setActiveSection(navItems[i]));
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, activeSection, navItems]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center transition-all ${
        darkMode
          ? "bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800"
          : "bg-white/95 backdrop-blur-md text-gray-800 shadow-md"
      }`}
    >
      {/* Logo */}
      <div className="text-2xl font-black text-blue-600 relative z-[60]">
        Dawit<span className="text-gray-400">.</span>
      </div>

      <div className="flex items-center space-x-6 relative z-[60]">
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 font-bold text-sm uppercase tracking-widest">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => handleNavClick(item)}
              className={`cursor-pointer ${
                activeSection === item
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                  : "opacity-60 hover:opacity-100"
              } transition-all duration-300`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Dark Mode Switcher */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className={`p-2 rounded-full border ${
            darkMode
              ? "border-slate-700 bg-slate-800"
              : "border-gray-200 bg-gray-50"
          } transition-all hover:scale-110`}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Hamburger Button */}
        <button
          className="md:hidden flex flex-col space-y-1.5 p-2 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`h-0.5 w-6 bg-current transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`h-0.5 w-6 bg-current transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`h-0.5 w-6 bg-current transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 right-0 w-3/4 h-[70vh] transition-all duration-500 ease-in-out transform 
        ${isOpen ? "translate-x-0" : "translate-x-full"} 
        md:hidden z-[55] rounded-bl-[80px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border-l border-b
        ${
          darkMode
            ? "bg-[#0f172a] border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col items-center justify-start pt-32 space-y-10 w-full h-full">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => handleNavClick(item)}
              className={`cursor-pointer text-2xl font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                activeSection === item
                  ? "text-blue-600 scale-125"
                  : darkMode
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {item}
            </a>
          ))}

          {/* Decorative bar */}
          <div className="w-16 h-2 bg-blue-600 rounded-full mt-4 shadow-lg shadow-blue-500/50"></div>
        </div>
      </div>

      {/* Dark background layer when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-[50]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
