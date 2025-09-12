import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }
        const res = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  console.log(user)

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0F] text-gray-300">
        <p className="animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-gray-100">
      {/* Header Banner */}
      <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
          <div className="h-28 w-28 rounded-full border-4 border-white overflow-hidden shadow-xl">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-indigo-500 flex items-center justify-center text-3xl font-bold">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => (window.location.href = "/edit")}
          className="absolute top-4 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
        >
          ✏️ Edit Profile
        </button>
      </div>

      {/* Content */}
      <div className="px-8 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - User Info */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-400">@{user.username}</p>
            <p className="text-gray-300 mt-2">{user.email}</p>
          </div>
        </div>

        {/* Right - Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              icon="🔗"
              label="Total URLs"
              value={user.urlCount || 0}
            />
            <StatCard
              icon="🕒"
              label="Last Login"
              value={
                user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : "N/A"
              }
            />
            <StatCard
              icon="📅"
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable Stat Card */
function StatCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-lg rounded-xl p-5 shadow-lg border border-white/10 hover:scale-105 transition">
      <div className="p-3 rounded-lg bg-white/10 text-xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <h3 className="text-lg font-semibold">{value}</h3>
      </div>
    </div>
  );
}
