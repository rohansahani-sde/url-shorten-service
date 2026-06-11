import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    profilePic: "",
    bio: "",
    title: "",
    location: "",
    website: "",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data.user || {};
        setForm({
          name: u.name || "",
          username: u.username || "",
          profilePic: u.photoURL || "",
          bio: u.bio || "",
          title: u.title || "",
          location: u.location || "",
          website: u.website || "",
        });
      } catch (e) {
        setMsg(e.response?.data?.message || "Failed to load profile ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "/auth/profile",
        {
          name: form.name.trim(),
          username: form.username.trim(),
          photoURL: form.profilePic.trim(),
          bio: form.bio.trim(),
          title: form.title.trim(),
          location: form.location.trim(),
          website: form.website.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("✅ Profile updated successfully!");
      const u = res.data.user || {};
      setForm({
        name: u.name || "",
        username: u.username || "",
        profilePic: u.photoURL || "",
        bio: u.bio || "",
        title: u.title || "",
        location: u.location || "",
        website: u.website || "",
      });
      setTimeout(() => navigate("/me"), 1500);
    } catch (e) {
      setMsg(e.response?.data?.message || "Update failed ❌");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030508] text-slate-500 font-mono text-xs selection:bg-cyan-500/20">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
          <span className="tracking-widest uppercase animate-pulse text-cyan-400">Opening system configuration pipeline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030508] text-slate-300 font-sans selection:bg-cyan-500/20 selection:text-cyan-200 antialiased p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl border border-slate-800 bg-[#070b12] rounded-xl overflow-hidden backdrop-blur-md relative shadow-2xl shadow-black/60">
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

        {/* ── TOP TERMINAL BAR ── */}
        <div className="border-b border-slate-800/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/20">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              [esc] Return_to_Node
            </button>
            <h2 className="text-lg font-black text-white tracking-tight uppercase font-mono">
              Config_Override // <span className="text-slate-500">Edit_Mode</span>
            </h2>
          </div>
          <div className="font-mono text-[9px] font-bold text-slate-600 bg-slate-950 px-2.5 py-1 rounded border border-slate-900 self-start sm:self-auto">
            SECURE_TUNNEL // PORT_443
          </div>
        </div>

        {/* ── CORE WORKSPACE BODY ── */}
        <div className="p-6 sm:p-8 lg:p-10">
          
          {/* Status Telemetry Alerts */}
          {msg && (
            <div className={`mb-8 p-4 rounded-lg flex items-center gap-3 font-mono text-xs font-bold border ${
              msg.includes("✅")
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/5 border-rose-500/20 text-rose-400"
            }`}>
              <span className={msg.includes("✅") ? "text-emerald-400" : "text-rose-400"}>
                {msg.includes("✅") ? "INFO://" : "WARN://"}
              </span>
              <p className="tracking-wide">{msg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* AVATAR OVERRIDE STREAM GRID */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-slate-800/60">
              <div className="relative group shrink-0">
                <div className="h-24 w-24 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden p-1 transition-all duration-300 group-hover:border-cyan-500/40 shadow-inner">
                  {form.profilePic ? (
                    <img
                      src={form.profilePic}
                      alt="preview"
                      className="h-full w-full object-cover rounded-lg"
                      onError={(e) => (e.currentTarget.src = "")}
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center font-mono text-2xl font-bold text-slate-500">
                      {form.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-1.5 rounded border border-[#070b12] shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                </div>
              </div>
              
              <div className="flex-1 w-full space-y-1.5 font-mono">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">// PARM_IMG_SOURCE_URI</label>
                <div className="relative">
                  <input
                    type="url"
                    name="profilePic"
                    value={form.profilePic}
                    onChange={handleChange}
                    placeholder="https://domain.com/assets/images/node_avatar.jpg"
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-700 focus:placeholder-slate-600 px-4 py-3 rounded-lg font-mono text-xs focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* MAIN FORM GRID PLATFORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 font-mono">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">// REG_NAME_STRING</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="System Identity Label"
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-700 px-4 py-3 rounded-lg text-xs focus:outline-none focus:border-cyan-500/50 transition-colors"
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">// REG_HANDLE_INDEX</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="unique_handle"
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-700 px-4 py-3 rounded-lg text-xs focus:outline-none focus:border-cyan-500/50 transition-colors"
                  minLength={3}
                  maxLength={30}
                  required
                />
              </div>

              {/* Title / Profession */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">// VECTOR_TITLE_DEPT</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Infrastructure Designer"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-700 px-4 py-3 rounded-lg text-xs focus:outline-none focus:border-cyan-500/50 transition-colors"
                  maxLength={100}
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">// LOCAL_COORD_NET</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. London, Core_01"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-700 px-4 py-3 rounded-lg text-xs focus:outline-none focus:border-cyan-500/50 transition-colors"
                  maxLength={100}
                />
              </div>

            </div>

            {/* Website Portfolio External Ingress */}
            <div className="space-y-1.5 font-mono">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">// NETWORK_INGRESS_URI</label>
              <input
                type="url"
                name="website"
                placeholder="https://terminal-portfolio.io"
                value={form.website}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-700 px-4 py-3 rounded-lg text-xs focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            {/* Custom Description Manifest Bio */}
            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">// REGS_MANIFEST_DESC</label>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${form.bio.length >= 150 ? "text-amber-500" : "text-slate-600"}`}>
                  {form.bio.length} / 160_CHARS
                </span>
              </div>
              <textarea
                name="bio"
                rows="4"
                placeholder="Append descriptive text string into core registry system buffers..."
                value={form.bio}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-700 px-4 py-3 rounded-lg text-xs focus:outline-none focus:border-cyan-500/50 transition-colors resize-none leading-relaxed"
                maxLength={160}
              ></textarea>
            </div>

            {/* Form Pipeline Write Commit Execution */}
            <div className="pt-4 font-mono">
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-4 rounded-lg uppercase tracking-wider text-xs transition duration-150 flex items-center justify-center gap-2 select-none active:scale-[0.99] shadow-md shadow-cyan-500/10"
              >
                Commit_Configuration_Override
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}