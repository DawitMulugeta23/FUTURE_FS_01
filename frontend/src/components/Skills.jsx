import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { certificatesAPI, skillsAPI } from "../services/api";

const Skills = () => {
  const isDark = useSelector((state) => state.nav.darkMode);
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // All skills with progress percentages (Languages, Frameworks, Databases)
  const allSkills = [
    // Programming Languages
    {
      name: "JavaScript",
      category: "Language",
      level: "Advanced",
      percentage: 85,
      icon: "🟡",
    },
    {
      name: "Python",
      category: "Language",
      level: "Intermediate",
      percentage: 75,
      icon: "🐍",
    },
    {
      name: "PHP",
      category: "Language",
      level: "Intermediate",
      percentage: 70,
      icon: "🐘",
    },
    {
      name: "Java",
      category: "Language",
      level: "Intermediate",
      percentage: 65,
      icon: "☕",
    },
    {
      name: "HTML/CSS",
      category: "Language",
      level: "Advanced",
      percentage: 90,
      icon: "🎨",
    },

    // Frameworks & Libraries
    {
      name: "React.js",
      category: "Framework",
      level: "Advanced",
      percentage: 85,
      icon: "⚛️",
    },
    {
      name: "Node.js",
      category: "Framework",
      level: "Intermediate",
      percentage: 75,
      icon: "🟢",
    },
    {
      name: "Express.js",
      category: "Framework",
      level: "Intermediate",
      percentage: 70,
      icon: "🚂",
    },
    {
      name: "Tailwind CSS",
      category: "Framework",
      level: "Advanced",
      percentage: 85,
      icon: "🎨",
    },
    {
      name: "Bootstrap",
      category: "Framework",
      level: "Intermediate",
      percentage: 75,
      icon: "🅱️",
    },

    // Databases
    {
      name: "MongoDB",
      category: "Database",
      level: "Intermediate",
      percentage: 75,
      icon: "🍃",
    },
    {
      name: "MySQL",
      category: "Database",
      level: "Intermediate",
      percentage: 70,
      icon: "🐬",
    },
    {
      name: "PostgreSQL",
      category: "Database",
      level: "Beginner",
      percentage: 50,
      icon: "🐘",
    },
  ];

  // Group skills by category
  const groupedSkills = {
    "Programming Languages": allSkills.filter(
      (skill) => skill.category === "Language",
    ),
    "Frameworks & Libraries": allSkills.filter(
      (skill) => skill.category === "Framework",
    ),
    Databases: allSkills.filter((skill) => skill.category === "Database"),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, certsRes] = await Promise.all([
          skillsAPI.getAll(),
          certificatesAPI.getAll(),
        ]);
        setSkills(skillsRes.data);
        setCertificates(certsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Programming Languages":
        return "text-blue-600 border-blue-600";
      case "Frameworks & Libraries":
        return "text-purple-600 border-purple-600";
      case "Databases":
        return "text-green-600 border-green-600";
      default:
        return "text-blue-600 border-blue-600";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Programming Languages":
        return "💻";
      case "Frameworks & Libraries":
        return "🚀";
      case "Databases":
        return "🗄️";
      default:
        return "📚";
    }
  };

  if (loading) {
    return (
      <section
        id="skills"
        className={`pt-8 pb-12 px-6 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading skills...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className={`pt-8 pb-12 px-6 transition-all duration-500 ${isDark ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-900"}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-5xl font-black mb-10 uppercase italic tracking-tighter">
          Skills & Certificates
        </h2>

        {/* All Skills with Progress Bars */}
        <div className="mb-12">
          {Object.entries(groupedSkills).map(
            ([category, skillsList]) =>
              skillsList.length > 0 && (
                <div key={category} className="mb-10">
                  <h3
                    className={`text-2xl font-bold text-center mb-6 flex items-center justify-center gap-3 ${getCategoryColor(category)}`}
                  >
                    <span className="text-3xl">
                      {getCategoryIcon(category)}
                    </span>
                    {category}
                    <span className="text-3xl">
                      {getCategoryIcon(category)}
                    </span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                    {skillsList.map((skill, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                          isDark
                            ? "bg-slate-800/50 border border-slate-700 hover:border-blue-500"
                            : "bg-white shadow-lg border border-gray-100 hover:shadow-xl"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{skill.icon}</span>
                            <h4 className="text-base font-bold">
                              {skill.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                skill.level === "Advanced"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : skill.level === "Intermediate"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }`}
                            >
                              {skill.level}
                            </span>
                            <span className="text-base font-bold text-blue-600">
                              {skill.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="relative w-full h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(skill.percentage)}`}
                            style={{ width: `${skill.percentage}%` }}
                          >
                            <div className="absolute top-0 right-0 h-full w-2 bg-white/30 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>

        {/* Certificates Grid */}
        {certificates.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-center mb-6 text-orange-600 flex items-center justify-center gap-3">
              <span className="text-3xl">🏆</span>
              Certificates
              <span className="text-3xl">📜</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {certificates.map((cert) => (
                <div
                  key={cert._id}
                  className={`p-3 rounded-2xl text-center border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    isDark
                      ? "bg-slate-800 border-slate-700 hover:border-blue-500"
                      : "bg-white border-blue-50 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div>
                    <div className="w-full aspect-square mb-2 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                      {cert.img &&
                      cert.img !== "#" &&
                      !cert.img.includes("via.placeholder.com") ? (
                        <img
                          src={cert.img}
                          alt={cert.title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/200x200/1e293b/ffffff?text=${encodeURIComponent(cert.title.substring(0, 20))}`;
                          }}
                        />
                      ) : (
                        <div className="text-white text-center p-4">
                          <div className="text-3xl mb-1">📜</div>
                          <div className="text-xs font-bold">{cert.title}</div>
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-sm mb-1">{cert.title}</h4>
                    <p className="text-xs text-blue-600 font-bold mb-2">
                      {cert.provider}
                    </p>
                  </div>

                  {cert.link && cert.link !== "#" && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block mt-2 py-1.5 px-3 rounded-xl text-xs font-bold transition-all transform hover:scale-105 ${
                        isDark
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      View Certificate →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {certificates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No certificates added yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
