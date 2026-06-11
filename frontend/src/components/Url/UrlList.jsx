import React, { useState, useEffect, useRef } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import UpdateUrl from "./UpdateUrl";

function Favicon({ url }) {
  try {
    const domain = new URL(url).hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    return (
      <img src={faviconUrl} alt="favicon" className="w-5 h-5"
        onError={(e) => (e.currentTarget.style.display = "none")} />
    );
  } catch { return null; }
}

function DropdownMenu({ url, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:border-indigo-500/50 hover:text-white transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-20 w-36 bg-[#1E293B] border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden animate-scale-in">
          <button
            onClick={() => { onEdit(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            Edit
          </button>
          <div className="h-px bg-slate-700/40 mx-2" />
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/></svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-fade-in-up text-sm font-semibold ${
      type === "success" ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-300" : "bg-red-900/90 border-red-500/40 text-red-300"
    }`}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      {message}
    </div>
  );
}

export default function UrlList() {
  const [urls, setUrls] = useState([]);
  const [copied, setCopied] = useState("");
  const [editingUrl, setEditingUrl] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const params = new URLSearchParams({ status: statusFilter });
        if (search) params.set("search", search);
        const res = await axios.get(`/urls?${params}`);
        const sortedUrls = (res.data.urls || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUrls(sortedUrls);
        setTotalCount(res.data.pagination?.total || sortedUrls.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUrls();
  }, [statusFilter, search]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleDelete = async (url) => {
    if (!window.confirm(`Delete "${url.title || url.shortCode}"? This cannot be undone.`)) return;
    setDeletingId(url._id);
    try {
      await axios.delete(`/urls/${url._id}`);
      setUrls(prev => prev.filter(u => u._id !== url._id));
      setTotalCount(c => c - 1);
      setToast({ message: "Link deleted successfully", type: "success" });
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Failed to delete link", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-200 font-['Inter']">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-1">
              My <span className="gradient-text-cyan">Links</span>
            </h1>
            <p className="text-slate-400 text-sm">Manage, track, and analyze all your shortened URLs</p>
          </div>
          <Link
            to="/urls/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Create New
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 px-4 py-2.5 bg-[#0D1117]/60 border border-slate-800/80 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 flex-shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Search by URL, alias, or description..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 outline-none text-sm"
            />
            {searchInput && (
              <button type="button" onClick={() => { setSearchInput(""); setSearch(""); }} className="text-slate-600 hover:text-slate-400 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
          </form>

          {/* Total count */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0D1117]/60 border border-slate-800/80 rounded-xl">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total:</span>
            <span className="text-sm font-black text-indigo-400">{totalCount}</span>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0D1117]/60 border border-slate-800/80 rounded-xl">
            <span className="text-xs text-slate-500 font-medium">Show:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-300 text-sm font-semibold outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#1E293B]">All</option>
              <option value="active" className="bg-[#1E293B]">Active</option>
              <option value="inactive" className="bg-[#1E293B]">Inactive</option>
            </select>
          </div>
        </div>

        {/* URL Cards */}
        <div className="space-y-4">
          {urls.length > 0 ? (
            urls.map((url) => (
              <div
                key={url._id}
                className={`group relative bg-[#0D1117]/50 hover:bg-[#0D1117]/80 backdrop-blur-sm border border-slate-800/60 hover:border-indigo-500/20 rounded-2xl transition-all duration-300 p-5 md:p-6 ${deletingId === url._id ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Favicon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-inner overflow-hidden">
                      <Favicon url={url.originalUrl} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors truncate">
                            {url.title || "Untitled Link"}
                          </h3>
                          <span className={`flex-shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            url.isActive
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                              : "bg-red-500/10 border border-red-500/20 text-red-400"
                          }`}>
                            {url.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <a href={url.shortUrl} target="_blank" rel="noreferrer"
                          className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors block truncate text-base">
                          {url.shortUrl?.replace(/^https?:\/\//, "") || ""}
                        </a>
                        <a href={url.originalUrl} target="_blank" rel="noreferrer"
                          className="text-slate-500 text-sm hover:text-slate-400 transition-colors block truncate max-w-lg mt-0.5">
                          {url.originalUrl}
                        </a>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleCopy(url.shortUrl)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition-all duration-200 ${
                            copied === url.shortUrl
                              ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                              : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:text-white"
                          }`}
                        >
                          {copied === url.shortUrl ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          )}
                          {copied === url.shortUrl ? "Copied!" : "Copy"}
                        </button>
                        <button
                          onClick={() => setSelectedQR(url.shortUrl)}
                          className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:border-indigo-500/50 hover:text-white transition-all"
                          title="Show QR Code"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                        </button>
                        <DropdownMenu
                          url={url}
                          onEdit={() => setEditingUrl(url)}
                          onDelete={() => handleDelete(url)}
                        />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/15 text-indigo-300 text-xs font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 12-4-4v3H3v2h15v3z"/></svg>
                        {url.clickCount || 0} clicks
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        {new Date(url.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                      </span>
                      {url.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {url.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-800/80 text-slate-400 rounded-md border border-slate-700/50 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <Link to={`/analytics/${url.shortCode}`}
                        className="ml-auto text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 group/link"
                      >
                        View Analytics
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-[#0D1117]/30 rounded-2xl border-2 border-dashed border-slate-800">
              <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mb-5 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{search ? "No results found" : "No links yet"}</h3>
              <p className="text-slate-500 mb-6 text-sm">
                {search ? `No links match "${search}"` : "Start shortening your first link today!"}
              </p>
              {!search && (
                <Link to="/urls/create" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                  Create Your First Link
                </Link>
              )}
            </div>
          )}
        </div>

        {/* QR Modal */}
        {selectedQR && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50 p-4" onClick={() => setSelectedQR(null)}>
            <div className="bg-[#0D1117] border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative flex flex-col items-center max-w-xs w-full animate-scale-in" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelectedQR(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-full transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              <h2 className="text-xl font-black text-white mb-5">QR Code</h2>
              <div className="p-4 bg-white rounded-2xl shadow-inner mb-4">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedQR}`} alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-slate-500 text-xs break-all text-center mb-5">{selectedQR}</p>
              <a href={selectedQR} target="_blank" rel="noreferrer" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-center transition shadow-lg shadow-indigo-500/20 text-sm">
                Open Link ↗
              </a>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingUrl && (
          <UpdateUrl
            url={editingUrl}
            onSuccess={(updatedUrl) => {
              setUrls(prev => prev.map(u => u._id === (updatedUrl._id || updatedUrl.id) ? { ...u, ...updatedUrl } : u));
              setEditingUrl(null);
              setToast({ message: "Link updated successfully!", type: "success" });
            }}
            onCancel={() => setEditingUrl(null)}
          />
        )}

        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
