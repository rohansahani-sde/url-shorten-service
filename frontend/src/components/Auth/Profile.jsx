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
      <div className="flex items-center justify-center min-h-screen bg-[#030508] text-slate-500 font-mono text-xs selection:bg-cyan-500/20">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
          <span className="tracking-widest uppercase animate-pulse text-cyan-400">Executing handshake protocol...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030508] text-slate-300 font-sans selection:bg-cyan-500/20 selection:text-cyan-200 antialiased p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ── TOP SYSTEM BAR / HEADER ── */}
        <header className="border border-slate-800 bg-[#070b12] rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              Core System Node Active
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase font-mono">
              User_Profile // <span className="text-slate-500">{user.username}</span>
            </h1>
          </div>
          
          <button
            onClick={() => (window.location.href = "/edit")}
            className="w-full sm:w-auto font-mono text-xs font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 px-5 py-2.5 rounded-lg transition-all duration-200 group/btn shadow-inner"
          >
            Modify Configuration <span className="inline-block transition-transform group-hover/btn:translate-x-1">→</span>
          </button>
        </header>

        {/* ── CORE GRID MONITOR WORKSPACE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: IDENTITY STRUCT */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="border border-slate-800 bg-[#070b12] rounded-xl p-6 relative">
              <div className="absolute top-3 right-4 font-mono text-[9px] font-bold text-slate-600">[01]</div>
              
              <div className="flex flex-col items-center text-center">
                {/* Profile Matrix Avatar */}
                <div className="relative mb-4 group">
                  <div className="h-24 w-24 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden relative p-1 transition-all duration-300 group-hover:border-cyan-500/50">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <div className="h-full w-full bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center font-mono text-2xl font-bold text-slate-400">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[8px] font-bold uppercase rounded">
                    ON
                  </div>
                </div>

                <h2 className="text-base font-bold text-white tracking-tight">{user.name}</h2>
                <p className="text-xs font-mono text-slate-500">@{user.username}</p>

                {/* Authority Tokens */}
                <div className="flex gap-1.5 my-4">
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-400 font-mono uppercase tracking-wider font-semibold">
                    Tier_01
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[9px] text-cyan-400 font-mono uppercase tracking-wider font-semibold">
                    Verified_Node
                  </span>
                </div>

                {/* Parameter Registries */}
                <div className="w-full space-y-2 border-t border-slate-800/60 pt-4 text-xs font-mono">
                  {user.title && (
                    <div className="flex items-center gap-2.5 p-2 bg-slate-950/50 border border-slate-800/40 rounded-lg text-slate-400">
                      <span className="text-slate-600 font-bold">POS://</span>
                      <span className="truncate text-slate-300">{user.title}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-2.5 p-2 bg-slate-950/50 border border-slate-800/40 rounded-lg text-slate-400">
                      <span className="text-slate-600 font-bold">LOC://</span>
                      <span className="truncate text-slate-300">{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 p-2 bg-cyan-500/[0.02] border border-cyan-500/10 rounded-lg text-cyan-400 hover:border-cyan-500/30 transition group/link"
                    >
                      <span className="text-cyan-500/70 font-bold">URI://</span>
                      <span className="truncate group-hover/link:underline">
                        {user.website.replace(/^https?:\/\//, "")}
                      </span>
                    </a>
                  )}
                </div>

                {/* Raw Signature Box */}
                {user.bio && (
                  <div className="w-full mt-4 pt-4 border-t border-slate-800/60 text-left font-mono">
                    <span className="text-slate-600 text-[9px] font-bold uppercase tracking-widest block mb-2">
                      // Metadata_Manifest
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed bg-slate-950/40 border border-slate-800/50 p-3 rounded-lg">
                      {user.bio}
                    </p>
                  </div>
                )}

                {/* Cryptographic Key Index */}
                <div className="w-full mt-4 pt-4 border-t border-slate-800/60 flex justify-between font-mono text-[9px] text-slate-600 font-bold">
                  <span>SYS_INIT: {new Date(user.createdAt).toLocaleDateString()}</span>
                  <span>HEX_ID: #{user.id.slice(-4).toUpperCase()}</span>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT PANEL: DYNAMIC ANALYTICS ARRAYS */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            
            {/* 3-Column Metrics System Array */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Active Vectors"
                value={user.urlCount || 0}
                metric="LINKS"
                index="[02]"
                icon={<svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
              />
              <StatCard
                title="Exchange Clust"
                value={user.uniqueClicks || "0"}
                metric="CLICKS"
                index="[03]"
                icon={<svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
              />
              <StatCard
                title="Vector Ratio"
                value={user.urlCount > 0 ? (user.totalClicks / user.urlCount).toFixed(1) : "0"}
                metric="RATIO"
                index="[04]"
                icon={<svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
              />
            </div>

            {/* Terminal Main Activity Frame */}
            <div className="border border-slate-800 bg-[#070b12] rounded-xl p-6 min-h-[340px] flex flex-col relative">
              <div className="absolute top-3 right-4 font-mono text-[9px] font-bold text-slate-600">[05]</div>
              
              <div className="flex justify-between items-center mb-6 border-b border-slate-800/80 pb-4 shrink-0">
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Stream_Telemetry_Logs
                </h3>
                <button className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 hover:border-cyan-500/30 px-3 py-1 rounded transition duration-150">
                  REFRESH_STREAM
                </button>
              </div>

              {/* Central Operational Terminal Display Frame */}
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-slate-800/60 rounded-xl bg-slate-950/40 font-mono text-xs">
                <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-500 mb-4 font-bold text-sm">
                  //
                </div>
                <h4 className="text-slate-300 font-bold mb-1 uppercase tracking-widest text-[11px]">Buffer Stack Empty</h4>
                <p className="text-slate-500 max-w-xs mb-6 text-[11px] leading-relaxed">
                  No tracking parameters routed to core cluster. Initialize dynamic vectors to trigger data stream pipelines.
                </p>
                <button
                  onClick={() => window.location.href = '/urls/create'}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-mono font-bold uppercase tracking-wider text-[11px] transition duration-150 active:scale-[0.98]"
                >
                  Deploy_New_Vector
                </button>
              </div>
            </div>

            {/* Base Auxiliary Telemetry Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div className="border border-slate-800 bg-[#070b12] rounded-xl p-5 flex flex-col justify-center items-center text-center h-32 relative">
                <div className="absolute top-3 left-4 text-[8px] font-bold text-slate-600 uppercase tracking-widest">REG_01 // COORD_NET</div>
                <h4 className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Target Geometries</h4>
                <p className="text-lg font-bold text-white tracking-tight uppercase">Global Namespace</p>
              </div>
              
              <div className="border border-slate-800 bg-[#070b12] rounded-xl p-5 flex flex-col justify-center items-center text-center h-32 relative">
                <div className="absolute top-3 left-4 text-[8px] font-bold text-slate-600 uppercase tracking-widest">REG_02 // PORT_INGRESS</div>
                <h4 className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Primary Network Gateway</h4>
                <p className="text-lg font-bold text-white tracking-tight uppercase">Direct / Ingress</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, metric, index, icon }) {
  return (
    <div className="relative border border-slate-800 bg-[#070b12] rounded-xl p-5 shadow-sm overflow-hidden transition-all duration-200 hover:border-slate-700 font-mono">
      <div className="absolute top-3 right-4 text-[9px] font-bold text-slate-600">{index}</div>
      <div className="flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">
            {icon}
          </div>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{title}</h3>
        </div>
        <div>
          <p className="text-2xl font-bold text-white tracking-tight leading-none mb-1">{value}</p>
          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">// UNIT: {metric}</span>
        </div>
      </div>
    </div>
  );
}