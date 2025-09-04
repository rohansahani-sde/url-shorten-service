import { useState, useEffect } from "react";
import axios from "axios";

const UpdateUrl = ({ url, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    description: "",
    tags: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Pre-fill when url changes
  useEffect(() => {
    if (url) {
      setFormData({
        description: url.description || "",
        tags: url.tags ? url.tags.join(", ") : "",
        isActive: url.isActive ?? true,
      });
    }
  }, [url]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url?._id && !url?.id) {
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
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        isActive: formData.isActive,
      };

      const res = await axios.put(
        `http://localhost:5000/api/urls/${url._id}`, // ✅ use url._id
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("✅ URL updated successfully!");
      console.log(res)
      if (onSuccess) onSuccess(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update URL ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-[#2C363F] shadow-lg rounded-2xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Update URL</h2>

      {error && (
        <p className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4">
          {error}
        </p>
      )}
      {successMsg && (
        <p className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg mb-4">
          {successMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-300 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-600 rounded-lg p-3 bg-[#1E242B] text-white"
            placeholder="Enter description"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border border-gray-600 rounded-lg p-3 bg-[#1E242B] text-white"
            placeholder="e.g. tech, project, link"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-5 w-5 text-[#29ABE2] border-gray-600 rounded"
          />
          <label className="text-gray-300">Active</label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 rounded-lg text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#29ABE2] text-white rounded-lg"
          >
            {loading ? "Updating..." : "Update URL"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUrl;
