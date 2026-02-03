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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020205] text-gray-300">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse text-indigo-400 font-medium tracking-wide">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* Header Banner */}
      <div className="h-60 relative group overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 animate-gradient-xy"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020205] to-transparent"></div>

        {/* Floating Shapes for 'Premium' feel */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

        <button
          onClick={() => (window.location.href = "/edit")}
          className="absolute top-6 right-6 flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white px-5 py-2.5 rounded-full hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 shadow-xl group/edit z-10"
        >
          <span className="text-sm font-medium tracking-wide">Edit Profile</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 group-hover/edit:rotate-12 transition-transform"
          >
            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
          </svg>
        </button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-12 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <div className="bg-[#13131F]/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/5 relative overflow-hidden group">
              {/* Glow effect upon hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition duration-500 rounded-3xl blur pointer-events-none"></div>

              <div className="relative flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4 group-hover:scale-105 transition-transform duration-500">
                  <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-[6px] border-[#13131F] shadow-2xl overflow-hidden bg-gray-800 relative z-10">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-5xl font-bold text-white">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-2 h-6 w-6 bg-emerald-500 border-4 border-[#13131F] rounded-full z-20" title="Online"></div>
                </div>

                {/* Name & Title */}
                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                  {user.name}
                </h1>
                <p className="text-indigo-400 font-medium text-sm mb-4">
                  @{user.username}
                </p>

                {/* Badges/Tags (Mock for "based on user" feel) */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-medium">
                    🚀 Early Adopter
                  </span>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                    ✨ Pro Member
                  </span>
                </div>

                {/* User Details */}
                <div className="w-full space-y-3 text-left">
                  {user.title && (
                    <div className="flex items-center gap-3 text-gray-400 text-sm p-2 rounded-lg hover:bg-white/5 transition">
                      <span className="p-1.5 bg-white/5 rounded-md text-gray-300">💼</span>
                      <span className="truncate">{user.title}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-3 text-gray-400 text-sm p-2 rounded-lg hover:bg-white/5 transition">
                      <span className="p-1.5 bg-white/5 rounded-md text-gray-300">📍</span>
                      <span className="truncate">{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-indigo-400 text-sm p-2 rounded-lg hover:bg-indigo-500/10 transition group/link"
                    >
                      <span className="p-1.5 bg-indigo-500/20 rounded-md text-indigo-400 group-hover/link:text-indigo-300">🔗</span>
                      <span className="truncate group-hover/link:underline cursor-pointer">
                        {user.website.replace(/^https?:\/\//, "")}
                      </span>
                    </a>
                  )}
                </div>

                {/* Bio */}
                {user.bio && (
                  <div className="w-full mt-6 pt-6 border-t border-white/5">
                    <h3 className="text-gray-500 uppercase text-[10px] font-bold tracking-widest mb-3">
                      ABOUT ME
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed text-left">
                      {user.bio}
                    </p>
                  </div>
                )}

                <div className="w-full mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 font-medium">
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  <span>ID: #{user.id.slice(-4).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard & Stats */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            {/* Stats Raws */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total URLs"
                value={user.urlCount || 0}
                icon={
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                }
                trend="Total links created"
                trendUp={true}
                grad="from-indigo-500/10 to-blue-500/5"
                border="indigo"
              />
              <StatCard
                title="Unique Visitors"
                value={user.uniqueClicks || "0"}
                icon={
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                }
                trend="Actual unique clicks"
                trendUp={true}
                grad="from-emerald-500/10 to-teal-500/5"
                border="emerald"
              />
              <StatCard
                title="Avg. Performance"
                value={user.urlCount > 0 ? (user.totalClicks / user.urlCount).toFixed(1) : "0"}
                icon={
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                }
                trend="Avg clicks per link"
                trendUp={user.totalClicks > 0}
                grad="from-orange-500/10 to-red-500/5"
                border="orange"
              />
            </div>

            {/* Activity / Placeholder Section */}
            <div className="bg-[#13131F]/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 min-h-[300px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 text-lg">📊</span>
                  Recent Activity
                </h3>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 transition">View All</button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl mb-4 grayscale opacity-50">
                  📉
                </div>
                <h4 className="text-lg font-medium text-gray-300 mb-1">No Activity Yet</h4>
                <p className="text-gray-500 text-sm max-w-sm mb-6">
                  When you create short links and share them, analytics will appear here.
                </p>
                <button
                  onClick={() => window.location.href = '/urls/create'}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition shadow-lg shadow-indigo-500/25"
                >
                  Create New Link
                </button>
              </div>
            </div>

            {/* Additional Info Block - maybe Devices or Map */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#13131F]/50 backdrop-blur-xl rounded-3xl p-6 border border-white/5 h-48 flex flex-col justify-center items-center text-center">
                <h4 className="text-gray-400 font-medium mb-2">Top Locations</h4>
                <p className="text-2xl font-bold text-white">Global</p>
                <span className="text-xs text-gray-500 mt-1">Data from all links</span>
              </div>
              <div className="bg-[#13131F]/50 backdrop-blur-xl rounded-3xl p-6 border border-white/5 h-48 flex flex-col justify-center items-center text-center">
                <h4 className="text-gray-400 font-medium mb-2">Top Referrer</h4>
                <p className="text-2xl font-bold text-white">Direct / Email</p>
                <span className="text-xs text-gray-500 mt-1">Most traffic source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp, grad, border }) {
  const borderColors = {
    indigo: "group-hover:border-indigo-500/30",
    emerald: "group-hover:border-emerald-500/30",
    orange: "group-hover:border-orange-500/30",
  }

  return (
    <div className={`relative bg-[#13131F]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${borderColors[border] || ""}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${trendUp ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {trend}
          </span>
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}
