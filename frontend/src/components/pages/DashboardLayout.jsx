import React, { useState, useContext } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/login");
    }, 400);
  };

  const navLinks = [
    {
      path: "/dashboard",
      label: "Dashboard",
      tag: "SYS_DASH",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="0.5" /><rect width="7" height="5" x="14" y="3" rx="0.5" />
          <rect width="7" height="9" x="14" y="12" rx="0.5" /><rect width="7" height="5" x="3" y="16" rx="0.5" />
        </svg>
      ),
    },
    {
      path: "/urls",
      label: "My URLs",
      tag: "VEC_DATA",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
    {
      path: "/me",
      label: "Profile",
      tag: "USR_NODE",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      path: "/edit",
      label: "Settings",
      tag: "SYS_CONF",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  const SidebarContent = ({ collapsed }) => (
    <>
      {/* ── LOGO IDENTITY LAYER ── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-900 overflow-hidden shrink-0">
        <Link to="/" className="block">
          <div className="w-9 h-9 rounded-lg border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center transition-colors hover:border-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
        </Link>
        {!collapsed && (
          <span className="font-mono text-base font-black uppercase text-white tracking-wider whitespace-nowrap select-none">
            Snap<span className="text-cyan-400">_Link</span>
          </span>
        )}
      </div>

      {/* ── INITIALIZE ROUTE VECTOR (CTA) ── */}
      <div className="px-3 pt-4 pb-2 shrink-0">
        <Link
          to="/urls/create"
          className={`flex items-center gap-2 px-3 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-150 active:scale-[0.98] ${collapsed ? "justify-center" : ""}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          {!collapsed && <span>New_Vector</span>}
        </Link>
      </div>

      {/* ── CORE RUNTIME NAVIGATION ── */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto font-mono text-xs">
        <div className="text-[9px] font-bold text-slate-600 px-2.5 mb-2 tracking-widest uppercase select-none">
          {collapsed ? "//" : "// System_Navigation"}
        </div>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-150 group ${
                isActive
                  ? "bg-cyan-500/[0.02] text-cyan-400 border-cyan-500/20"
                  : "bg-transparent text-slate-400 border-transparent hover:bg-slate-950 hover:text-slate-200"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className={`transition-colors duration-150 flex-shrink-0 ${isActive ? "text-cyan-400" : "group-hover:text-cyan-400"}`}>
                  {link.icon}
                </span>
                {!collapsed && <span className="font-bold tracking-wide">{link.label}</span>}
              </div>

              {!collapsed && (
                <span className={`text-[8px] font-bold tracking-widest ${isActive ? "text-cyan-500/60" : "text-slate-600 group-hover:text-slate-500"}`}>
                  {link.tag}
                </span>
              )}

              {/* Active Matrix Nodes */}
              {isActive && (
                collapsed ? (
                  <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                ) : (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-cyan-400 rounded-l" />
                )
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── TELEMETRY SYSTEM FOOTER ── */}
      <div className="px-2.5 pb-4 border-t border-slate-900 pt-3 space-y-2 shrink-0 font-mono text-xs">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-950/40 border border-slate-900 rounded-lg">
            <div className="w-7 h-7 rounded border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-400 font-bold text-[10px] shrink-0 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
            <div className="min-w-0">
              <p className="text-slate-200 text-[11px] font-bold truncate tracking-tight">{user.name || "User"}</p>
              <p className="text-slate-600 text-[9px] font-semibold truncate tracking-tight">{user.email}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-slate-500 hover:bg-rose-500/5 hover:text-rose-400 border border-transparent hover:border-rose-500/10 transition-all duration-150 group ${collapsed ? "justify-center" : ""}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform shrink-0">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" x2="9" y1="12" y2="12"/>
          </svg>
          {!collapsed && <span className="font-bold tracking-wide uppercase text-[11px]">Disconnect</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className={`flex min-h-screen bg-[#030508] text-slate-300 antialiased transition-opacity duration-300 ${loggingOut ? "opacity-0" : "opacity-100"}`}>

      {/* ── DESKTOP PERSISTENT TERMINAL ASIDE ── */}
      <aside
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 transition-all duration-200 ease-in-out border-r border-slate-900 bg-[#070b12]/90 backdrop-blur-md ${isSidebarOpen ? "w-60" : "w-[68px]"}`}
      >
        <SidebarContent collapsed={!isSidebarOpen} />
      </aside>

      {/* ── MOBILE TERMINAL OVERLAY ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#070b12] border-r border-slate-900 flex flex-col">
            <SidebarContent collapsed={false} />
          </aside>
        </div>
      )}

      {/* ── DYNAMIC CENTRAL EXECUTION AREA ── */}
      <main className={`flex-1 transition-all duration-200 ease-in-out ${isSidebarOpen ? "md:ml-60" : "md:ml-[68px]"} min-h-screen flex flex-col`}>
        
        {/* Mobile Header Node bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#070b12]/90 backdrop-blur-md border-b border-slate-900 sticky top-0 z-30">
          <div className="flex items-center gap-2.5 font-mono">
            <div className="w-7 h-7 rounded border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className="font-black text-white text-xs uppercase tracking-wider">Snap<span className="text-cyan-400">_Link</span></span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </header>

        {/* View Routing Render Segment */}
        <div className="relative flex-1 p-0.5">
          {/* Subtle Structural Ambient Lighting */}
          <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-cyan-500/[0.01] blur-[120px] rounded-full pointer-events-none" />
          <div>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}