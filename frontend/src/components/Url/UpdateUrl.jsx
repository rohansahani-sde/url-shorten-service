import { useState, useEffect } from "react";
import axios from "axios";

const UpdateUrl = ({ url, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
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
      const token = localStorage.getItem("token");
      const payload = {
        description: formData.description,
        tags: tagsArray,
        isActive: formData.isActive,
      };

      const res = await axios.put(
        `http://localhost:5000/api/urls/${url._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("✅ URL updated successfully!");
      if (onSuccess) onSuccess(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update URL ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1E293B] rounded-3xl shadow-2xl w-full max-w-lg p-6 relative animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-white">Update URL</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white text-xl transition"
          >
            ✕
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg animate-pulse">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-500/20 text-green-400 rounded-lg animate-pulse">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Description */}
          <div className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl p-4 bg-[#2A3446] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition placeholder-transparent"
              placeholder="Description"
              rows={3}
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all pointer-events-none">
              Description
            </label>
          </div>

          {/* Tags with preview */}
          <div className="relative">
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full rounded-xl p-4 bg-[#2A3446] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition placeholder-transparent"
              placeholder="Tags"
            />
            <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all pointer-events-none">
              Tags (comma-separated)
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tagsArray.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full transition ${
                  formData.isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span
                className={`dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition ${
                  formData.isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </label>
            <span className="text-gray-300 font-medium">Active</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-xl font-medium text-white transition ${
                loading
                  ? "bg-[#3B82F6]/60 cursor-not-allowed"
                  : "bg-[#3B82F6] hover:bg-[#2563EB]"
              }`}
            >
              {loading ? "Updating..." : "Update URL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUrl;
