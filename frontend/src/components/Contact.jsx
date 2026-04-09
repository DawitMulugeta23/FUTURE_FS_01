import { useState } from "react";
import { useSelector } from "react-redux";
import githubIcon from "../assets/github.png";
import linkedinIcon from "../assets/linkedin.png";
import telegramIcon from "../assets/telegram.jpg";
import gmailIcon from "../assets/Untitled.jpg";
import { contactAPI } from "../services/api";

const Contact = () => {
  const isDark = useSelector((state) => state.nav.darkMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({
    type: "",
    message: "",
    loading: false,
  });

  const contacts = [
    {
      name: "LinkedIn",
      icon: linkedinIcon,
      url: "https://www.linkedin.com/in/dawit-mulugeta-219a89364",
      glow: "group-hover:shadow-[#0077b5]/50",
    },
    {
      name: "GitHub",
      icon: githubIcon,
      url: "https://github.com/DawitMulugeta23",
      glow: "group-hover:shadow-white/20",
    },
    {
      name: "Email",
      icon: gmailIcon,
      url: "mailto:dawitmulugetas23@gmail.com",
      glow: "group-hover:shadow-[#ea4335]/50",
    },
    {
      name: "Telegram",
      icon: telegramIcon,
      url: "https://t.me/Ye_23_C",
      glow: "group-hover:shadow-[#229ED9]/50",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "", loading: true });

    try {
      const response = await contactAPI.sendMessage(formData);
      console.log("Response:", response);

      setStatus({
        type: "success",
        message:
          response.data.message ||
          "Message sent successfully! I will get back to you soon.",
        loading: false,
      });
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setStatus({ type: "", message: "", loading: false });
      }, 5000);
    } catch (error) {
      console.error("Error sending message:", error);

      let errorMessage = "Failed to send message. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.error || errorMessage;
      } else if (error.request) {
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      }

      setStatus({
        type: "error",
        message: errorMessage,
        loading: false,
      });

      setTimeout(() => {
        setStatus({ type: "", message: "", loading: false });
      }, 5000);
    }
  };

  return (
    <section
      id="contact"
      className={`py-12 px-6 transition-all duration-500 ${isDark ? "bg-slate-900 text-white" : "bg-[#f8faff] text-slate-900"}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-5xl font-black uppercase tracking-tighter italic">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p
            className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Have a project in mind? Let's work together!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Contact Form */}
          <div
            className={`p-6 rounded-[2rem] transition-all duration-500 ${
              isDark
                ? "bg-slate-800/40 border border-slate-700"
                : "bg-white border border-gray-100 shadow-xl"
            }`}
          >
            <h3 className="text-2xl font-bold mb-5">Send me a message</h3>

            {status.message && (
              <div
                className={`mb-5 p-3 rounded-xl ${
                  status.type === "success"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full p-2.5 rounded-xl border transition-all ${
                    isDark
                      ? "bg-slate-800 border-slate-700 focus:border-blue-500"
                      : "bg-white border-gray-200 focus:border-blue-500"
                  } outline-none`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full p-2.5 rounded-xl border transition-all ${
                    isDark
                      ? "bg-slate-800 border-slate-700 focus:border-blue-500"
                      : "bg-white border-gray-200 focus:border-blue-500"
                  } outline-none`}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full p-2.5 rounded-xl border transition-all ${
                    isDark
                      ? "bg-slate-800 border-slate-700 focus:border-blue-500"
                      : "bg-white border-gray-200 focus:border-blue-500"
                  } outline-none`}
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className={`w-full p-2.5 rounded-xl border transition-all ${
                    isDark
                      ? "bg-slate-800 border-slate-700 focus:border-blue-500"
                      : "bg-white border-gray-200 focus:border-blue-500"
                  } outline-none resize-none`}
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status.loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div
              className={`p-6 rounded-[2rem] transition-all duration-500 ${
                isDark
                  ? "bg-slate-800/40 border border-slate-700"
                  : "bg-white border border-gray-100 shadow-xl"
              }`}
            >
              <h3 className="text-2xl font-bold mb-5">Connect with me</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg">
                    📧
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a
                      href="mailto:dawitmulugetas23@gmail.com"
                      className="font-medium hover:text-blue-600 transition"
                    >
                      dawitmulugetas23@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white text-lg">
                    📱
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">
                      +251 709700335 / +251 968871794
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg">
                    📍
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium">Debre Berhan, Ethiopia</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`p-6 rounded-[2rem] transition-all duration-500 ${
                isDark
                  ? "bg-slate-800/40 border border-slate-700"
                  : "bg-white border border-gray-100 shadow-xl"
              }`}
            >
              <h3 className="text-2xl font-bold mb-3">Response Time</h3>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                I typically respond within 24-48 hours. Feel free to reach out
                through any of these channels!
              </p>
            </div>
          </div>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {contacts.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className={`group flex flex-col items-center p-6 rounded-[3rem] transition-all duration-500 transform hover:-translate-y-2 ${
                isDark
                  ? "bg-slate-800/40 border border-slate-700 hover:bg-slate-800"
                  : "bg-white border border-gray-100 shadow-xl hover:shadow-2xl"
              }`}
            >
              <div
                className={`relative w-20 h-20 mb-4 rounded-full flex items-center justify-center p-1 transition-all duration-500 bg-transparent ${item.glow} group-hover:shadow-2xl`}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full shadow-md group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <span
                className={`text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isDark
                    ? "text-gray-400 group-hover:text-blue-400"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
              >
                {item.name}
              </span>
            </a>
          ))}
        </div>

        {/* Phone Numbers */}
        <div
          className={`mt-12 p-8 rounded-[4rem] text-center border-2 border-dashed transition-all duration-500 ${
            isDark
              ? "border-slate-700 bg-slate-800/20"
              : "border-blue-100 bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="group cursor-pointer">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                Safaricom
              </p>
              <p className="text-2xl font-black text-blue-600 group-hover:scale-110 transition-transform">
                0709700335
              </p>
            </div>
            <div className="group cursor-pointer">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                Ethio Telecom
              </p>
              <p className="text-2xl font-black text-blue-600 group-hover:scale-110 transition-transform">
                0968871794
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
