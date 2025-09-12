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
          profilePic: u.profilePic || "",
        });
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
          profilePic: form.profilePic.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message || "Profile updated ✅");

      const u = res.data.user || {};
      setForm({
        name: u.name || "",
        username: u.username || "",
        profilePic: u.profilePic || "",
      });

      setTimeout(() => navigate("/me"), 1200);
    } catch (e) {
      setMsg(e.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
        <p className="animate-pulse text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-3xl shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-400">Edit Profile</h2>

        {msg && (
          <div
            className={`text-center px-4 py-2 rounded-lg font-medium ${
              /updated|✅/i.test(msg)
                ? "bg-green-600/80 text-green-50"
                : "bg-red-600/80 text-red-50"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Pic */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 shadow-lg bg-gray-800 grid place-items-center">
              {form.profilePic ? (
                <img
                  src={form.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "")}
                />
              ) : (
                <span className="text-3xl font-bold text-indigo-400">
                  {form.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <input
              type="url"
              name="profilePic"
              value={form.profilePic}
              onChange={handleChange}
              placeholder="Profile Picture URL"
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {/* Name */}
          <div className="flex flex-col">
            <label className="text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <label className="text-gray-400 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="johndoe"
              className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-400 transition"
              minLength={3}
              maxLength={30}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              3–30 characters, must be unique.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-500 text-black font-semibold text-lg hover:bg-indigo-600 transition shadow-md"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
