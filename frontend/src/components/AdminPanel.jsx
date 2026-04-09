import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  certificatesAPI,
  projectsAPI,
  settingsAPI,
  skillsAPI,
  uploadAPI,
} from "../services/api";

const AdminPanel = () => {
  const [adminPath, setAdminPath] = useState('');
  const [updatingPath, setUpdatingPath]= useState(false);
  const isDark = useSelector((state) => state.nav.darkMode);
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [workStatus, setWorkStatus] = useState(true);
  const [profileImage, setProfileImage] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);
 useEffect(()=>{
  fetchAdminPath();
 },[]);
  const fetchAdminPath = async () => {
    try {
      const response = await settingsAPI.getAdminPath();
      setAdminPath(response.data.adminPath);
    } catch (error) {
      console.error('Error fetching admin path:', error);
    }
  };
  
  // Add this function with other functions
  const updateAdminPath = async () => {
    const pathRegex = /^[a-zA-Z0-9-]+$/;

    if (!adminPath || !pathRegex.test(adminPath)) {
      alert('Admin path can only contain letters, numbers, and hyphens');
      return;
    }
    
    setUpdatingPath(true);
    try {
      
      await settingsAPI.updateAdminPath(adminPath);
      alert(`Admin path updated to: ${adminPath}\nNew admin URL will be active after page refresh.`);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error updating admin path:', error);
      alert('Error updating admin path: ' + (error.response?.data?.error || error.message));
    } finally {
      setUpdatingPath(false);
    }
  };
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [projectsRes, skillsRes, certsRes, statusRes, profileRes] =
        await Promise.all([
          projectsAPI.getAll(),
          skillsAPI.getAll(),
          certificatesAPI.getAll(),
          settingsAPI.getWorkStatus(),
          settingsAPI.getProfileImage(),
        ]);
      setProjects(projectsRes.data);
      setSkills(skillsRes.data);
      setCertificates(certsRes.data);
      setWorkStatus(statusRes.data.workStatus);
      setProfileImage(profileRes.data.profileImage);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file, type) => {
    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      const imageUrl = response.data.imageUrl;

      if (type === "cv") {
        await settingsAPI.updateCV(imageUrl);
        alert("CV updated successfully!");
      } else if (type === "profile") {
        await settingsAPI.updateProfileImage(imageUrl);
        setProfileImage(imageUrl);
        alert("Profile image updated successfully!");
      } else if (type === "project") {
        setFormData({ ...formData, image: imageUrl });
        alert("Image uploaded! Click Save to update project.");
      } else if (type === "certificate") {
        setFormData({ ...formData, img: imageUrl });
        alert("Image uploaded! Click Save to update certificate.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(
        "Error uploading image: " +
          (error.response?.data?.error || error.message),
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "projects") {
        if (editingItem) {
          await projectsAPI.update(editingItem._id, formData);
        } else {
          await projectsAPI.create(formData);
        }
      } else if (activeTab === "skills") {
        if (editingItem) {
          await skillsAPI.update(editingItem._id, formData);
        } else {
          await skillsAPI.create(formData);
        }
      } else if (activeTab === "certificates") {
        if (editingItem) {
          await certificatesAPI.update(editingItem._id, formData);
        } else {
          await certificatesAPI.create(formData);
        }
      }
      await fetchAllData();
      setEditingItem(null);
      setFormData({});
      alert("Saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert(
        "Error saving item: " + (error.response?.data?.error || error.message),
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        if (activeTab === "projects") await projectsAPI.delete(id);
        else if (activeTab === "skills") await skillsAPI.delete(id);
        else if (activeTab === "certificates") await certificatesAPI.delete(id);
        await fetchAllData();
        alert("Deleted successfully!");
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Error deleting item");
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
  };

  const toggleWorkStatus = async () => {
    try {
      const newStatus = !workStatus;
      await settingsAPI.updateWorkStatus(newStatus);
      setWorkStatus(newStatus);
      alert("Work status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const renderForm = () => {
    if (activeTab === "projects") {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
            required
          />
          <input
            type="text"
            placeholder="Tech (comma separated)"
            value={formData.tech || ""}
            onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
            required
          />
          <input
            type="url"
            placeholder="GitHub Link"
            value={formData.link || ""}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], "project")}
              className="w-full p-2 border rounded-xl"
              disabled={uploading}
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}
            {uploading && (
              <p className="text-blue-500 text-sm mt-1">Uploading...</p>
            )}
          </div>

          <textarea
            placeholder="Description"
            value={formData.desc || ""}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
            rows="3"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            {editingItem ? "Update" : "Add"} Project
          </button>
        </form>
      );
    }

    if (activeTab === "skills") {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Skill Name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
            required
          />
          <select
            value={formData.level || "Intermediate"}
            onChange={(e) =>
              setFormData({ ...formData, level: e.target.value })
            }
            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
          <select
            value={formData.category || "Frontend"}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
          >
            <option>Frontend</option>
            <option>Backend</option>
            <option>Database</option>
            <option>DevOps</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            {editingItem ? "Update" : "Add"} Skill
          </button>
        </form>
      );
    }

    if (activeTab === "certificates") {
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Certificate Title"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
            required
          />
          <input
            type="text"
            placeholder="Provider"
            value={formData.provider || ""}
            onChange={(e) =>
              setFormData({ ...formData, provider: e.target.value })
            }
            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Certificate Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(e.target.files[0], "certificate")
              }
              className="w-full p-2 border rounded-xl"
              disabled={uploading}
            />
            {formData.img && (
              <div className="mt-2">
                <img
                  src={formData.img}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}
            {uploading && (
              <p className="text-blue-500 text-sm mt-1">Uploading...</p>
            )}
          </div>

          <input
            type="url"
            placeholder="Certificate Link"
            value={formData.link || "#"}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            {editingItem ? "Update" : "Add"} Certificate
          </button>
        </form>
      );
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-900" : "bg-gray-50"}`}
      >
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-20 pb-12 px-6 ${isDark ? "bg-slate-900 text-white" : "bg-gray-50"}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span>Open to Work:</span>
              <button
                onClick={toggleWorkStatus}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${workStatus ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white`}
              >
                {workStatus ? "Yes" : "No"}
              </button>
            </div>
            <a
              href="#/"
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all"
            >
              Back to Site
            </a>
          </div>
        </div>

        {/* CV and Profile Image Management */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div
            className={`p-6 rounded-2xl ${isDark ? "bg-slate-800" : "bg-white shadow-lg"}`}
          >
            <h2 className="text-xl font-bold mb-4">Manage CV</h2>
            <p className="text-sm text-gray-500 mb-3">
              Upload new CV (PDF or Image)
            </p>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => handleImageUpload(e.target.files[0], "cv")}
              className="w-full p-2 border rounded-xl"
              disabled={uploading}
            />
            {uploading && (
              <p className="text-blue-500 text-sm mt-1">Uploading...</p>
            )}
          </div>

          <div
            className={`p-6 rounded-2xl ${isDark ? "bg-slate-800" : "bg-white shadow-lg"}`}
          >
            <h2 className="text-xl font-bold mb-4">Manage Profile Image</h2>
            {profileImage && (
              <img
                src={profileImage}
                alt="Current Profile"
                className="h-24 w-24 object-cover rounded-full mb-3"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], "profile")}
              className="w-full p-2 border rounded-xl"
              disabled={uploading}
            />
            {uploading && (
              <p className="text-blue-500 text-sm mt-1">Uploading...</p>
            )}
          </div>
          <div className={`p-6 rounded-2x1 ${isDark? 'bg-slate-800' : 'bg-white shadow-lg'}`}>
            <h2 className="text-xl font-bold mb-4">Admin Security Settings</h2>
            <p className="text-sm text-gray-500 mb-3">Change your adimn panel URL path</p>
            <div className="flex gap-3">
              <input type="text" value={adminPath} onChange={(e) => setAdminPath(e.target.value)}
              placeholder="admin secret" className="flex-1 p-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600"/>
              <button onClick={updateAdminPath} disabled={updatingPath} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-50 transition-all disabled:opacity-50">{updatingPath ? 'updating...' : 'Update path'}</button>
            </div>
            <p className="text-xs text-grey-500 mt-2">
              Current admin Url: <strong className="text-blue-600">/#/{adminPath || 'love'}</strong>
            </p>
            <p className="text-xs text-yellow-50 mt-2">⚠️ After changing, you'll need to use the new URL to access admin panel</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8 border-b dark:border-slate-700">
          {["projects", "skills", "certificates"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setEditingItem(null);
                setFormData({});
              }}
              className={`px-6 py-3 capitalize font-medium transition-all ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "opacity-60 hover:opacity-100"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div
            className={`p-6 rounded-2xl ${isDark ? "bg-slate-800" : "bg-white shadow-lg"}`}
          >
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? "Edit" : "Add New"} {activeTab.slice(0, -1)}
            </h2>
            {renderForm()}
            {editingItem && (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormData({});
                }}
                className="mt-3 text-sm text-gray-500 hover:text-blue-600 transition-all"
              >
                Cancel Editing
              </button>
            )}
          </div>

          <div
            className={`p-6 rounded-2xl ${isDark ? "bg-slate-800" : "bg-white shadow-lg"}`}>
            <h2 className="text-xl font-bold mb-4">Manage {activeTab}</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {(activeTab === "projects"
                ? projects
                : activeTab === "skills"
                  ? skills
                  : certificates
              ).length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No items found. Add your first {activeTab.slice(0, -1)}!
                </p>
              ) : (
                (activeTab === "projects"
                  ? projects
                  : activeTab === "skills"
                    ? skills
                    : certificates
                ).map((item) => (
                  <div
                    key={item._id}
                    className={`p-4 rounded-xl border flex justify-between items-center ${isDark ? "border-slate-700" : "border-gray-200"}`}
                  >
                    <div>
                      <h3 className="font-bold">{item.title || item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.tech ||
                          item.provider ||
                          `${item.level} - ${item.category}`}
                      </p>
                      {(item.image || item.img) && (
                        <img
                          src={item.image || item.img}
                          alt=""
                          className="h-10 w-10 object-cover rounded mt-1"
                        />
                      )}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
