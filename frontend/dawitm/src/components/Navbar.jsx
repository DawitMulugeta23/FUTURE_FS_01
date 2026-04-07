import { useDispatch, useSelector } from 'react-redux';
import { setActiveSection, toggleDarkMode } from '../features/navSlice';

const Navbar = () => {
  const { darkMode, activeSection } = useSelector((state) => state.nav);
  const dispatch = useDispatch();

  return (
    <nav className={`fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center transition-all ${darkMode ? 'bg-slate-900/90 text-white border-b border-slate-800' : 'bg-white/90 text-gray-800 shadow-sm'} backdrop-blur-md`}>
      <div className="text-2xl font-black text-blue-600">
        Portfolio<span className="text-gray-400">.</span>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex space-x-6 font-bold text-sm uppercase tracking-widest">
          {['home', 'about', 'skills', 'project', 'contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item}`} 
              onClick={() => dispatch(setActiveSection(item))}
              className={`${activeSection === item ? 'text-blue-600' : 'opacity-60'} hover:opacity-100 transition-opacity`}
            >
              {item}
            </a>
          ))}
        </div>
        
        {/* Dark Mode Switcher */}
        <button 
          onClick={() => dispatch(toggleDarkMode())}
          className={`p-2 rounded-full border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'} transition-all hover:scale-110`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;