import { useState, useEffect } from "react";
import axios from "../../api/axios";

const UpdateUrl = ({ url, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    isActive: true,
  });
  const [tagsArray, setTagsArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (url) {
      setFormData({
        title: url.title || "",
        description: url.description || "",
        tags: url.tags ? url.tags.join(", ") : "",
        isActive: url.isActive ?? true,
      });
      setTagsArray(url.tags || []);
    }
  }, [url]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "tags") {
      setFormData((prev) => ({ ...prev, tags: value }));
      setTagsArray(
        value
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url?._id) {
      setError("URL ID is missing ❌");
      return;
    }

    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        tags: tagsArray,
        isActive: formData.isActive,
      };

      const res = await axios.put(
        `/urls/${url._id}`,
        payload
      );

      setSuccessMsg("✅ Updated successfully!");
      if (onSuccess) {
        setTimeout(() => onSuccess(res.data.url), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update URL ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">

        {/* Decorative Header */}
        <div className="relative h-24 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 flex items-end">
          <div className="absolute top-4 right-4">
            <button
              onClick={onCancel}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white leading-none">Edit Link</h2>
            <p className="text-indigo-100/60 text-xs font-medium mt-2 uppercase tracking-widest">Update your preferences</p>
          </div>
        </div>

        <div className="p-8">
          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-3 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Link Title</label>
              <div className="relative group">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-xl px-4 py-3.5 bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                  placeholder="e.g. Portfolio Website"
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3.5 bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium resize-none"
                placeholder="Briefly describe this link..."
                rows={3}
              />
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tags (Comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-3.5 bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                placeholder="marketing, social, tech"
              />
              <div className="flex flex-wrap gap-2 mt-3 ml-1">
                {tagsArray.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg border border-indigo-500/20 text-xs font-bold uppercase"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row: Active Toggle & Buttons */}
            <div className="pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                </div>
                <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-widest">Active Status</span>
              </label>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 sm:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all border border-slate-700 hover:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-indigo-500/20 ${loading
                      ? "bg-indigo-600/50 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5"
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                      Updating...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUrl;
