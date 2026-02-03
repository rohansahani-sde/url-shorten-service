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
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[#1E293B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">

        {/* Header Section */}
        <div className="relative h-32 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex items-end">
          <div className="absolute top-6 left-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              Go Back
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white leading-none">Edit Profile</h2>
            <p className="text-indigo-100/60 text-xs font-bold mt-2 uppercase tracking-widest">Update your digital identity</p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Alerts */}
          {msg && (
            <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-4 duration-300 ${msg.includes("✅")
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
              {msg.includes("✅") ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
              )}
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Profile Header Edit */}
            <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-slate-700/50">
              <div className="relative group">
                <div className="h-32 w-32 rounded-[2rem] overflow-hidden border-4 border-slate-700 bg-slate-800/50 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105 duration-300">
                  {form.profilePic ? (
                    <img
                      src={form.profilePic}
                      alt="preview"
                      className="h-full w-full object-cover"
                      onError={(e) => (e.currentTarget.src = "")}
                    />
                  ) : (
                    <span className="text-4xl font-black text-indigo-400">
                      {form.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-[#1E293B]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                </div>
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Avatar URL</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  </span>
                  <input
                    type="url"
                    name="profilePic"
                    value={form.profilePic}
                    onChange={handleChange}
                    placeholder="https://images.com/avatar.jpg"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    minLength={3}
                    maxLength={30}
                    required
                  />
                </div>
              </div>

              {/* Title / Profession */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Title / Profession</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                  </span>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Software Designer"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    maxLength={100}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Location</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  </span>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. London, UK"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    maxLength={100}
                  />
                </div>
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Website / Portfolio</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </span>
                <input
                  type="url"
                  name="website"
                  placeholder="https://portfolio.me"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Professional Bio</label>
              <textarea
                name="bio"
                rows="4"
                placeholder="Briefly describe yourself..."
                value={form.bio}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-800/40 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium resize-none"
                maxLength={160}
              ></textarea>
              <div className="flex justify-end pr-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${form.bio.length >= 150 ? "text-amber-500" : "text-slate-500"}`}>
                  {form.bio.length} / 160 Characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-3"
              >
                Save Profile Changes
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
