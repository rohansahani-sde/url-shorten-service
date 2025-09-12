import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.removeItem("token");
    navigate("/login");
  }
};


  return (
    <div className="flex min-h-screen bg-[#2C363F] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1F25] shadow-lg flex flex-col fixed top-0 left-0 bottom-0">
        <div className="p-6 text-2xl font-bold text-center border-b border-white/10">
          🚀 URL Shortener
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-[#2C363F] transition"
          >
            📊 Dashboard
          </Link>
          <Link
            to="/me"
            className="block px-4 py-2 rounded hover:bg-[#2C363F] transition"
          >
            👤 Profile
          </Link>
          <Link
            to="/urls"
            className="block px-4 py-2 rounded hover:bg-[#2C363F] transition"
          >
            🔗 My URLs
          </Link>
          <Link
            to="/urls/create"
            className="block px-4 py-2 rounded hover:bg-[#2C363F] transition"
          >
            ➕ Create URL
          </Link>
          <Link
            to="/edit"
            className="block px-4 py-2 rounded hover:bg-[#2C363F] transition"
          >
            ✏️ Edit Profile
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 px-4 py-2 rounded bg-red-600 hover:bg-red-700"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-64 overflow-y-auto h-screen">
        <Outlet /> {/* This renders the child route component */}
      </main>
    </div>
  );
}
