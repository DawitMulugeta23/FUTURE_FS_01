import { useSelector } from 'react-redux';
import githubIcon from '../assets/github.png';
import gmailIcon from '../assets/Untitled.jpg';
import linkedinIcon from '../assets/linkedin.png';
import telegramIcon from '../assets/telegram.jpg';

const Contact = () => {
  const isDark = useSelector((state) => state.nav.darkMode);

  const contacts = [
    {
      name: 'LinkedIn',
      icon: linkedinIcon,
      url: 'https://www.linkedin.com/in/dawit-mulugeta-219a89364',
      glow: 'group-hover:shadow-[#0077b5]/50',
    },
    {
      name: 'GitHub',
      icon: githubIcon,
      url: 'https://github.com/DawitMulugeta23',
      glow: 'group-hover:shadow-white/20',
    },
    {
      name: 'Email',
      icon: gmailIcon,
      url: 'mailto:dawitmulugetas23@gmail.com',
      glow: 'group-hover:shadow-[#ea4335]/50',
    },
    {
      name: 'Telegram',
      icon: telegramIcon,
      url: 'https://t.me/Ye_23_C',
      glow: 'group-hover:shadow-[#229ED9]/50',
    }
  ];

  return (
    <section 
      id="contact" 
      className={`py-24 px-6 transition-all duration-500 ${isDark ? 'bg-slate-900 text-white' : 'bg-[#f8faff] text-slate-900'}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl font-black uppercase tracking-tighter italic">Get In Touch</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {contacts.map((item) => (
            <a 
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className={`group flex flex-col items-center p-8 rounded-[3rem] transition-all duration-500 transform hover:-translate-y-4 ${
                isDark 
                ? 'bg-slate-800/40 border border-slate-700 hover:bg-slate-800' 
                : 'bg-white border border-gray-100 shadow-xl hover:shadow-2xl'
              }`}
            >
              {/* ክብ አይኮን (Rounded Icon Container) */}
              <div className={`relative w-24 h-24 mb-6 rounded-full flex items-center justify-center p-1 transition-all duration-500 bg-transparent ${item.glow} group-hover:shadow-2xl`}>
                <img 
                  src={item.icon} 
                  alt={item.name} 
                  className="w-full h-full object-cover rounded-full shadow-md group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <span className={`text-sm font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                isDark ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-600'
              }`}>
                {item.name}
              </span>
            </a>
          ))}
        </div>

        {/* የጥሪ ሳጥን (Phone Numbers) */}
        <div className={`mt-20 p-12 rounded-[4rem] text-center border-2 border-dashed transition-all duration-500 ${
          isDark ? 'border-slate-700 bg-slate-800/20' : 'border-blue-100 bg-white'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-24">
            <div className="group cursor-pointer">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Safaricom</p>
              <p className="text-3xl font-black text-blue-600 group-hover:scale-110 transition-transform">0709700335</p>
            </div>
            <div className="group cursor-pointer">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Ethio Telecom</p>
              <p className="text-3xl font-black text-blue-600 group-hover:scale-110 transition-transform">0968871794</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;