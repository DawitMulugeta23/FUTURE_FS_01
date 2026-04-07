import { useSelector } from "react-redux";
import dawitCv from "../assets/Dawitm.png"; // የCV ፋይልህ እዚህ import ይሆናል
import profileImg from "../assets/profile.png";

const Hero = () => {
  const isDark = useSelector((state) => state.nav.darkMode);

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: "in",
      url: "https://www.linkedin.com/in/dawit-mulugeta-219a89364",
      hover: "group-hover:text-[#0077b5]",
    },
    {
      name: "GitHub",
      icon: "git",
      url: "https://github.com/DawitMulugeta23",
      hover: "group-hover:text-black",
    },
    {
      name: "Email",
      icon: "@",
      url: "mailto:dawitmulugetas23@gmail.com",
      hover: "group-hover:text-[#ea4335]",
    },
    {
      name: "Telegram",
      icon: "tg",
      url: "https://t.me/Ye_23_C",
      hover: "group-hover:text-[#229ED9]",
    },
  ];

  return (
    <section
      id="home"
      className={`min-h-screen flex items-center justify-center pt-20 transition-all duration-500 ${isDark ? "bg-slate-900" : "bg-[#f3f4ff]"}`}
    >
      <div
        className={`relative w-[92%] max-w-7xl min-h-[75vh] grid md:grid-cols-2 rounded-[40px] overflow-hidden shadow-2xl ${isDark ? "bg-slate-800" : "bg-white"}`}
      >
        <div className="p-10 md:p-16 flex flex-col justify-center space-y-6 relative z-10">
          <div className="space-y-1">
            <h3
              className={`text-xl font-bold ${isDark ? "text-blue-400" : "text-gray-400"}`}
            >
              Hello, I am
            </h3>
            <h1
              className={`text-5xl md:text-6xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Dawit Mulugeta
            </h1>
          </div>
          <p
            className={`text-base leading-relaxed max-w-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            I am a CS student at Debre Berhan University. I focus on
            building clean, modern and functional web applications.
          </p>

          {/* Home Social Icons */}
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`group w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 ${isDark ? "border-slate-700 bg-slate-800/40" : "border-blue-100 bg-blue-50/50"} hover:bg-white hover:scale-110`}
              >
                <span
                  className={`text-blue-600 ${link.hover} transition-colors`}
                >
                  {link.icon}
                </span>
              </a>
            ))}
          </div>

          <div className="pt-2">
            <a
              href={dawitCv}
              download="Dawit_M_CV.pnj" // በሚወርድበት ጊዜ የሚኖረው ስም
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all"
            >
              Download CV
            </a>
          </div>
        </div>

        <div className="relative bg-blue-600 flex items-end justify-center overflow-hidden">
          <div
            className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-24 h-48 bg-inherit md:bg-white rounded-r-full hidden md:block"
            style={{ backgroundColor: isDark ? "#1e293b" : "white" }}
          ></div>
          <div className="relative w-full h-full flex items-end justify-center">
            <img
              src={profileImg}
              alt="Dawit Mulugeta"
              className="h-[85%] w-auto object-contain z-20"
            />
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 z-30 bg-white px-5 py-2 rounded-full shadow-xl hidden md:flex items-center gap-2 border border-blue-50">
              <span className="text-blue-600 font-bold">{"</>"}</span>
              <span className="text-blue-900 font-black text-xs uppercase tracking-tighter">
                Web Developer
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
