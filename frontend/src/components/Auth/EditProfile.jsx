import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [form, setForm] = useState({ name: "", username: "", profilePic: "" });
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
          profilePic: u.photoURL  || "",
        });
        // console.log(u)
      } catch (e) {
        setMsg(e.response?.data?.message || "Failed to load profile");
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
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message || "Profile updated ✅");
      const u = res.data.user || {};
      setForm({
        name: u.name || "",
        username: u.username || "",
        profilePic: u.photoURL || "",
      });
      setTimeout(() => navigate("/me"), 1200);
    } catch (e) {
      setMsg(e.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-900 to-black text-gray-300">
        <p className="animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-indigo-400">
          Edit Profile
        </h2>

        {msg && (
          <div
            className={`mb-5 px-4 py-3 rounded-lg text-center font-medium shadow-md ${
              /updated|✅/i.test(msg)
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile picture preview */}
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-indigo-500 bg-gray-800/50 grid place-items-center shadow-lg">
              {form.profilePic ? (
                <img
                  src={form.profilePic}
                  alt="preview"
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.src = "")}
                />
              ) : (
                <span className="text-2xl font-bold text-indigo-400">
                  {form.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">
                Profile Picture URL
              </label>
              <input
                type="url"
                name="profilePic"
                placeholder="https://..."
                value={form.profilePic}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste a direct image URL (PNG/JPG).
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              minLength={3}
              maxLength={30}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              3–30 characters, must be unique.
            </p>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
