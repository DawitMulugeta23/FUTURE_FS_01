import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { projectsAPI } from "../services/api";

const Projects = () => {
  const isDark = useSelector((state) => state.nav.darkMode);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll();
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="portfolio" className={`py-12 px-6 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8faff]'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="portfolio" 
      className={`py-12 px-6 transition-all duration-500 ${isDark ? 'bg-[#0f172a] text-white' : 'bg-[#f8faff] text-slate-900'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Projects</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No projects added yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div 
                key={project._id} 
                className={`group flex flex-col rounded-[2rem] overflow-hidden transition-all duration-300 border-2 ${
                  isDark 
                  ? 'bg-slate-800/40 border-slate-700 hover:border-blue-500' 
                  : 'bg-white border-white shadow-xl hover:shadow-2xl hover:border-blue-500'
                }`}
              >
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 dark:from-slate-700 dark:to-slate-800">
                  {project.image && project.image !== '#' ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/400x300/1e293b/ffffff?text=${encodeURIComponent(project.title)}`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">{project.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <a href={project.link} target="_blank" rel="noreferrer" className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm uppercase shadow-lg">
                       View Source
                     </a>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tech && project.tech.split(', ').map((t) => (
                      <span key={t} className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
                        isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-black tracking-tight mb-2">{project.title}</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {project.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;