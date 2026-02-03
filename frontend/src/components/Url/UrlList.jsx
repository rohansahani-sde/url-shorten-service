import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UpdateUrl from "./UpdateUrl";

export default function UrlList() {
  const [urls, setUrls] = useState([]);
  const [copied, setCopied] = useState("");
  const [editingUrl, setEditingUrl] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/urls?status=${statusFilter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
  }, [statusFilter]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  function Favicon({ url }) {
    try {
      const domain = new URL(url).hostname;
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
      return (
        <img
          src={faviconUrl}
          alt="favicon"
          className="w-5 h-5"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      );
    } catch {
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Shortened Links</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Manage and track your shortened URLs with ease.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
              <Link
                to="/urls/create"
                className="relative flex items-center gap-2 px-6 py-3 bg-[#1E293B] hover:bg-[#1e293b]/80 border border-slate-700/50 rounded-lg text-white font-semibold transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                Create New
              </Link>
            </div>
          </div>
        </div>

        {/* Global Toolbar - Similar to Bitly but unique */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1E293B]/40 backdrop-blur-md border border-slate-700/50 rounded-xl mb-6">
          {/* <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition group">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-[-1px] transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
            Export
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88 3.59 3.59" /><path d="m21 3-6.43 6.43" /><path d="m3 21 6.43-6.43" /><path d="m21 21-6.43-6.43" /></svg>
            Hide
            </button>
            </div> */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Links:</span>
              <span className="text-sm font-black text-indigo-400">{totalCount}</span>
            </div>

          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Show:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#151E31] border-none text-sm font-semibold focus:ring-0 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="active" className="text-green-400">Active</option>
              <option value="inactive" className="text-red-400">Inactive</option>
            </select>
          </div>
        </div>

        {/* Card Grid */}
        <div className="space-y-4">
          {urls.length > 0 ? (
            urls.map((url) => (
              <div
                key={url._id}
                className="group relative bg-[#1E293B]/40 hover:bg-[#1E293B]/60 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/30 rounded-2xl transition-all duration-300 p-5 md:p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center p-3 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Favicon url={url.originalUrl} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-white truncate mb-1 group-hover:text-indigo-300 transition-colors">
                          {url.title || "Untitled Link"}
                        </h3>
                        <div className="flex flex-col gap-1">
                          <a
                            href={url.shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 font-semibold text-lg hover:text-indigo-300 transition-colors truncate"
                          >
                            {url.shortUrl.replace(/^https?:\/\//, '')}
                          </a>
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-500 text-sm hover:text-slate-400 transition-colors truncate max-w-xl"
                          >
                            {url.originalUrl}
                          </a>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(url.shortUrl)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all duration-200 ${copied === url.shortUrl
                            ? "bg-green-500/10 border-green-500/50 text-green-400"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:text-white"
                            }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                          {copied === url.shortUrl ? "Copied" : "Copy"}
                        </button>
                        <button
                          onClick={() => setSelectedQR(url.shortUrl)}
                          className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:border-indigo-500/50 hover:text-white transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><rect width="5" height="5" x="7" y="7" /><rect width="5" height="5" x="12" y="12" /><rect width="5" height="5" x="7" y="12" /><rect width="5" height="5" x="12" y="7" /></svg>
                        </button>
                        <button
                          onClick={() => setEditingUrl(url)}
                          className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:border-indigo-500/50 hover:text-white transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                        </button>
                        <div className="relative">
                          <button className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:border-indigo-500/50 hover:text-white transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 transition-colors hover:bg-indigo-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">{url.clickCount || 0} Clicks</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                        <span className="text-sm font-medium">
                          {new Date(url.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "2-digit", year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l4.58-4.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
                        <div className="flex flex-wrap gap-1.5">
                          {url.tags && url.tags.length > 0 ? (
                            url.tags.map((tag, i) => (
                              <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-800/80 text-slate-400 rounded-md border border-slate-700/50 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-colors">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm font-medium text-slate-500">No tags</span>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/analytics/${url.shortCode}`}
                        className="ml-auto text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 group/link"
                      >
                        Detailed Analytics
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#1E293B]/20 rounded-2xl border-2 border-dashed border-slate-700/50">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" /></svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No links yet</h3>
              <p className="text-slate-500 mb-6">Start shortening your first link today!</p>
              <Link
                to="/urls/create"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
              >
                Create Your First Link
              </Link>
            </div>
          )}
        </div>

        {/* Modal Portals */}
        {selectedQR && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50 p-4">
            <div className="bg-[#1E293B] border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative flex flex-col items-center max-w-sm w-full animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setSelectedQR(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
              <h2 className="text-xl font-bold mb-6 text-white">QR Code</h2>
              <div className="p-4 bg-white rounded-2xl shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedQR}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="mt-6 text-slate-400 text-sm break-all text-center">{selectedQR}</p>
              <a
                href={selectedQR}
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-center transition-colors shadow-lg shadow-indigo-500/20"
              >
                Open Link
              </a>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingUrl && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-50 p-4">
            <div className="bg-[#1E293B] border border-slate-700/50 p-8 rounded-3xl shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setEditingUrl(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
              <UpdateUrl
                url={editingUrl}
                onSuccess={(updatedUrl) => {
                  setUrls((prev) =>
                    prev.map((u) =>
                      u._id === (updatedUrl._id || updatedUrl.id)
                        ? { ...u, ...updatedUrl }
                        : u
                    )
                  );
                  setEditingUrl(null);
                }}
                onCancel={() => setEditingUrl(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
