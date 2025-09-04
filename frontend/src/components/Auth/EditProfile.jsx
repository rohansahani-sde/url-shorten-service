import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function EditProfile() {
  const [form, setForm] = useState({ name: "", username: "", profilePic: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

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
      // reflect any server-normalized values
      const u = res.data.user || {};
      setForm({
        name: u.name || "",
        username: u.username || "",
        profilePic: u.profilePic || "",
      });
    } catch (e) {
      setMsg(e.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#2C363F] text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C363F] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[#1E242B] border border-gray-700 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        {msg && (
          <div
            className={`mb-4 px-3 py-2 rounded ${
              /updated|✅/i.test(msg) ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile picture preview */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-[#29ABE2] bg-[#2C363F] grid place-items-center">
              {form.profilePic ? (
                <img
                  src={form.profilePic}
                  alt="preview"
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.src = "")}
                />
              ) : (
                <span className="text-xl text-[#29ABE2]">
                  {form.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-1">
                Profile Picture URL
              </label>
              <input
                type="url"
                name="profilePic"
                placeholder="https://..."
                value={form.profilePic}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-[#11161b] border border-gray-700 text-white outline-none focus:ring-2 focus:ring-[#29ABE2]"
              />
              <p className="text-xs text-gray-400 mt-1">
                Paste a direct image URL (PNG/JPG).
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-[#11161b] border border-gray-700 text-white outline-none focus:ring-2 focus:ring-[#29ABE2]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-[#11161b] border border-gray-700 text-white outline-none focus:ring-2 focus:ring-[#29ABE2]"
              minLength={3}
              maxLength={30}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              3–30 chars, unique across users.
            </p>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#29ABE2] text-black font-semibold py-2.5 rounded-lg hover:bg-[#1d91c0] transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
