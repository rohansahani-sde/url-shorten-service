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
        console.log(res.data.user.photoURL)
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);


  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      {/* Profile Card */}
      <div className="bg-[#1E242B] rounded-xl p-6 shadow-lg flex flex-col items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-[#29ABE2] overflow-hidden bg-[#2C363F] flex items-center justify-center">
            {user.photoURL ? (
              <img
                src={user?.photoURL}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-[#29ABE2]">
                {user.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-semibold mt-4">{user.name}</h2>
        <p className="text-gray-400">@{user.username}</p>
        <p className="text-gray-300">{user.email}</p>
        <a
          href="/edit"
          className="mt-4 bg-[#29ABE2] text-black px-4 py-2 rounded-lg shadow hover:bg-[#1d91c0]"
        >
          Edit Profile
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="bg-[#1E242B] rounded-lg p-6 text-center shadow-lg">
          <p className="text-sm text-gray-400">Total URLs</p>
          <h3 className="text-2xl font-bold text-[#29ABE2]">
            {user.urlCount || 0}
          </h3>
        </div>
        <div className="bg-[#1E242B] rounded-lg p-6 text-center shadow-lg">
          <p className="text-sm text-gray-400">Last Login</p>
          <h3 className="text-lg font-semibold">
            {user.lastLogin
              ? new Date(user.lastLogin).toLocaleDateString()
              : "N/A"}
          </h3>
        </div>
        <div className="bg-[#1E242B] rounded-lg p-6 text-center shadow-lg">
          <p className="text-sm text-gray-400">Joined</p>
          <h3 className="text-lg font-semibold">
            {new Date(user.createdAt).toLocaleDateString()}
          </h3>
        </div>
      </div>
    </div>
  );
}
