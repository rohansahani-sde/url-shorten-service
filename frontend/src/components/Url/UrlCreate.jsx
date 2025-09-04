import React, { useState } from "react";
import axios from "../../api/axios";

export default function UrlCreate() {
  const [form, setForm] = useState({
    originalUrl: "",
    customAlias: "",
    description: "",
    tags: "",
    expiresAt: "",
  });
  const [message, setMessage] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");

      // Convert tags into array (comma separated)
      const tagsArray = form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        originalUrl: form.originalUrl,
        customAlias: form.customAlias || undefined,
        description: form.description || undefined,
        tags: tagsArray,
        expiresAt: form.expiresAt || undefined,
      };

      const res = await axios.post("/urls", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShortUrl(res.data.url.shortUrl);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating short URL");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-6">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Shorten Your Links 🚀
        </h2>
        <p className="text-gray-300 text-center mt-1">Add optional details below</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="url"
            name="originalUrl"
            placeholder="Enter original URL... *"
            value={form.originalUrl}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            name="customAlias"
            placeholder="Custom alias (optional)"
            value={form.customAlias}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900 text-white"
          />

          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900 text-white"
          />

          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated, optional)"
            value={form.tags}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900 text-white"
          />

          <input
            type="date"
            name="expiresAt"
            value={form.expiresAt}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900 text-white"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Create Short Link
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-3 text-center text-sm text-gray-300">{message}</p>
        )}

        {/* Short URL Display */}
        {shortUrl && (
          <div className="mt-6 p-4 rounded-xl bg-gray-800 flex items-center justify-between">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline break-all"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="ml-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            >
              {copied ? "✅" : "🔗"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
