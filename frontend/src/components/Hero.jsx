import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { settingsAPI } from "../services/api";

const Hero = () => {
  const isDark = useSelector((state) => state.nav.darkMode);
  const [workStatus, setWorkStatus] = useState(true);
  const [cvUrl, setCvUrl] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, cvRes, profileRes] = await Promise.all([
          settingsAPI.getWorkStatus(),
          settingsAPI.getCV(),
          settingsAPI.getProfileImage(),
        ]);
        setWorkStatus(statusRes.data.workStatus);
        setCvUrl(cvRes.data.cvUrl);
        setProfileImage(profileRes.data.profileImage);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const socialLinks = [
    { name: "LinkedIn", icon: "in", url: "https://www.linkedin.com/in/dawit-mulugeta-219a89364", hover: "group-hover:text-[#0077b5]" },
    { name: "GitHub", icon: "git", url: "https://github.com/DawitMulugeta23", hover: "group-hover:text-black dark:group-hover:text-white" },
    { name: "Email", icon: "@", url: "mailto:dawitmulugetas23@gmail.com", hover: "group-hover:text-[#ea4335]" },
    { name: "Telegram", icon: "tg", url: "https://t.me/Ye_23_C", hover: "group-hover:text-[#229ED9]" },
  ];

  return (
    <section
      id="home"
      className={`min-h-[90vh] flex items-center justify-center transition-all duration-500 ${isDark ? "bg-slate-900" : "bg-[#f3f4ff]"}`}
    >
      <div
        className={`relative w-[92%] max-w-7xl min-h-[70vh] grid md:grid-cols-2 rounded-[40px] overflow-hidden shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}
      >
        <div className="p-8 md:p-12 flex flex-col justify-center space-y-4 relative z-10">
          <div className="space-y-1">
            <h3 className={`text-xl font-bold ${isDark ? "text-blue-400" : "text-gray-400"}`}>Hello, I am</h3>
            <h1 className={`text-5xl md:text-6xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>Dawit Mulugeta</h1>
          </div>
          <p className={`text-base leading-relaxed max-w-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            I am a CS student at Debre Berhan University. I focus on building clean, modern and functional web applications.
          </p>

          {!loading && (
            <div className="pt-1">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                workStatus ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${workStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                {workStatus ? '🟢 Open to Work' : '🔴 Currently Unavailable'}
              </span>
            </div>
          )}

          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noreferrer"
                className={`group w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 ${isDark ? "border-slate-700 bg-slate-800/40" : "border-blue-100 bg-blue-50/50"} hover:bg-white hover:scale-110 dark:hover:bg-slate-700`}>
                <span className={`text-blue-600 dark:text-blue-400 ${link.hover} transition-colors`}>{link.icon}</span>
              </a>
            ))}
          </div>

          <div className="pt-2">
            <a href={cvUrl} download="Dawit_M_CV.png" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all">
              Download CV
            </a>
          </div>
        </div>

        <div className="relative bg-blue-600 flex items-end justify-center overflow-hidden h-full">
          <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-24 h-48 rounded-r-full hidden md:block" style={{ backgroundColor: isDark ? "#1e293b" : "white" }}></div>
          <div className="relative w-full h-full flex items-end justify-center">
            <img src={profileImage} alt="Dawit Mulugeta" className="max-h-[85%] w-auto object-contain block align-bottom z-20" style={{ display: "block", marginBottom: "0" }} />
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 z-30 bg-white dark:bg-slate-800 px-5 py-2 rounded-full shadow-xl hidden md:flex items-center gap-2 border border-blue-50 dark:border-slate-700">
              <span className="text-blue-600 dark:text-blue-400 font-bold">{"</>"}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9061FF] via-[#3FB9AD] to-[#00D27A] font-black text-xs uppercase tracking-tighter">Web Developer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;