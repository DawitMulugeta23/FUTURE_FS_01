import { useSelector } from "react-redux";
import aicetify from "../assets/aicetify.png";
import funprog from "../assets/funprog.png";

const Skills = () => {
  const isDark = useSelector((state) => state.nav.darkMode);

  const certificates = [
    { title: "Fundamental Programming", provider: "Academic", img: funprog },
    { title: "AI Certificate", provider: "Udacity", img: aicetify },
    {
      title: "Full Stack Mastery",
      provider: "Coming Soon",
      img: "https://via.placeholder.com/150?text=Wait",
    },
    {
      title: "Advanced React",
      provider: "Coming Soon",
      img: "https://via.placeholder.com/150?text=Wait",
    },
  ];

  return (
    <section
      id="skills"
      className={`py-24 px-6 ${isDark ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-900"}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-black mb-16 uppercase italic">
          Skills & Certificates
        </h2>

        {/* Certificates Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {certificates.map((cert, i) => (
            <div
              key={i}
              className={`p-4 rounded-3xl text-center border-2 transition-all ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-blue-50 shadow-lg"}`}
            >
              <div className="w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={cert.img}
                  alt={cert.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="font-bold text-sm">{cert.title}</h4>
              <p className="text-xs text-blue-600 font-bold mt-1">
                {cert.provider}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-gray-500 font-medium italic">
          More professional certificates will be uploaded as I complete my MERN
          stack journey.
        </p>
      </div>
    </section>
  );
};

export default Skills;
