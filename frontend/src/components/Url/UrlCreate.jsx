import React, { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function UrlCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    originalUrl: "",
    title: "",
    customAlias: "",
    description: "",
    tags: "",
    expiresAt: "",
  });
  const [message, setMessage] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const tagsArray = form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        originalUrl: form.originalUrl.trim(),
        title: form.title?.trim() || undefined,
        customAlias: form.customAlias?.trim() || undefined,
        description: form.description?.trim() || undefined,
        tags: tagsArray,
        expiresAt: form.expiresAt || undefined,
      };

      const res = await axios.post("/urls", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShortUrl(res.data.url.shortUrl);
      setMessage("✨ Link created successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Oops! Failed to create link ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-gray-100 p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-3xl relative z-10">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition group"
          >
            <div className="p-2 bg-white/5 rounded-lg border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="font-medium">Go Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Create Link</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#12121A]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
          {/* Inner Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

          <div className="p-8 sm:p-12 relative z-10">
            <div className="mb-10 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Memorable</span> Links
              </h1>
              <p className="text-gray-400 leading-relaxed max-w-lg">
                Paste your long destination URL below and customize it to match your brand or campaign.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Destination URL */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 ml-1">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  Destination URL
                </label>
                <input
                  type="url"
                  name="originalUrl"
                  placeholder="https://example.com/long-original-url"
                  value={form.originalUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all font-medium text-lg"
                />
              </div>

              {/* Title Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 ml-1">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Internal Title (Optional)
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Give your link a name"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all"
                />
              </div>

              {/* Grid: Alias & Expiration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 ml-1">
                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    Custom Alias
                  </label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none">snaplink.cc/</span>
                    <input
                      type="text"
                      name="customAlias"
                      placeholder="alias"
                      value={form.customAlias}
                      onChange={handleChange}
                      className="w-full pl-32 pr-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 ml-1">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Expires At
                  </label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={form.expiresAt}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 ml-1">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  placeholder="marketing, social, promo"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 ml-1">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Add a few details about this link..."
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-none"
                />
              </div>

              {/* Feedback Message */}
              {message && !shortUrl && (
                <div className={`p-4 rounded-2xl text-center font-medium animate-fade-in ${message.includes("Oops") ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Short Link
                    <svg className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Success / Result Panel */}
        {shortUrl && (
          <div className="mt-8 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] p-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Your link is ready!</h3>
                  <p className="text-emerald-400/80 font-medium">{shortUrl}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${copied ? "bg-emerald-500 text-white shadow-lg" : "bg-white/10 text-white hover:bg-white/20"}`}
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      Copy Link
                    </>
                  )}
                </button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-white/10 text-white hover:bg-white/20 rounded-xl transition"
                  title="Open Link"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
