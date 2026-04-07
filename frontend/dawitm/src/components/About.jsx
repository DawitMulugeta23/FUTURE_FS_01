import { useSelector } from "react-redux";

const About = () => {
  const isDark = useSelector((state) => state.nav.darkMode);

  return (
    <section
      id="about"
      className={`py-24 px-6 transition-all duration-500 ${isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* የግራ ክፍለ አካል - የመጀመሪያው ስታይል በቁጥር */}
          <div className="relative">
            <div
              className={`absolute -inset-4 rounded-[3rem] blur-2xl opacity-20 bg-gradient-to-r from-blue-600 to-purple-600`}
            ></div>
            <div
              className={`relative p-8 rounded-[3rem] border-2 border-dashed ${isDark ? "border-slate-700 bg-slate-800/50" : "border-blue-100 bg-blue-50/30"}`}
            >
              <h3 className="text-8xl font-black opacity-10 absolute top-0 left-5 italic">
                ABOUT
              </h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <p className="font-bold">Currently exploring React.js</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <p className="font-bold">Building Web Applications</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <p className="font-bold">Future MERN Mastery</p>
                </div>
              </div>
            </div>
          </div>

          {/* የቀኝ ክፍለ አካል */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              My Journey & <span className="text-blue-600">Vision</span>
            </h2>
            <p
              className={`text-lg leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
             I am a Computer Science student at Debre Berhan University, currently specializing in React.js. With a solid foundation in Node.js, Express.js, and MongoDB, I am on a fast track to mastering the MERN stack to build robust, full-scale applications.
            </p>

            <div className="flex gap-4">
              {/* ወደ Skills የሚወስድ */}
              <a
                href="#skills"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                My Skills
              </a>
              {/* ወደ Contact የሚወስድ */}
              <a
                href="#contact"
                className={`px-8 py-3 rounded-xl font-bold border-2 transition-all ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-blue-100 hover:bg-blue-50"}`}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
