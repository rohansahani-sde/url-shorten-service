import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UpdateUrl from "./UpdateUrl";

export default function UrlList() {
  const [urls, setUrls] = useState([]);
  const [copied, setCopied] = useState("");
  const [editingUrl, setEditingUrl] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/urls", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedUrls = (res.data.urls || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUrls(sortedUrls);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUrls();
  }, []);

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
    <div className="min-h-screen bg-[#0A0A0F] text-gray-100">
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center pb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
          Make Your Links Short & Sweet ✨
        </h1>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg border border-white/10">
          <table className="w-full border-collapse bg-[#11161b]">
            <thead className="bg-[#1a1f27] text-sm text-gray-300">
              <tr>
                <th className="py-3 px-4 text-left">No.</th>
                <th className="py-3 px-4 text-left">Short Link</th>
                <th className="py-3 px-4 text-left">Original Link</th>
                <th className="py-3 px-4 text-center">QR Code</th>
                <th className="py-3 px-4 text-center">Clicks</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Date</th>
                <th className="py-3 px-4 text-center">Analytics</th>
                <th className="py-3 px-4 text-center">Edit</th>
              </tr>
            </thead>
            <tbody>
              {urls.length > 0 ? (
                urls.map((url, idx) => (
                  <tr
                    key={url._id}
                    className="border-t border-white/10 hover:bg-white/5 transition h-16 justify-center"
                  >
                    {/* Index */}
                    <td className="py-3 px-4">{idx + 1}.</td>

                    {/* Short URL */}
                    <td className="py-3 px-4 flex items-center gap-2">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:underline truncate max-w-[180px]"
                      >
                        {url.shortUrl}
                      </a>
                      <button
                        onClick={() => handleCopy(url.shortUrl)}
                        className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition"
                      >
                        {copied === url.shortUrl ? (<spane className="text-green-400"> Copied </spane>) : "Copy"}
                      </button>
                    </td>

                    {/* Original URL */}
                    <td className="py-3 px-4 max-w-[220px] truncate">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-gray-300 hover:underline"
                      >
                        <Favicon url={url.originalUrl} />
                        {url.originalUrl}
                      </a>
                    </td>

                    {/* QR Code */}
                    <td className="py-6 px-10 text-center">
                      <button
                        onClick={() => setSelectedQR(url.shortUrl)}
                        className="text-blue-400 hover:underline"
                      >
                        View QR
                      </button>
                    </td>

                    {/* Clicks */}
                    <td className="py-3 px-4 text-center font-medium">
                      {url.clickCount || 0}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {url.isActive ? (
                        <span className="text-green-400">Active</span>
                      ) : (
                        <span className="text-red-400">Inactive</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-center text-gray-400">
                      {new Date(url.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </td>

                    {/* Analytics */}
                    <td className="text-center">
                      <Link
                        to={`/analytics/${url.shortCode}`}
                        className="text-purple-400 hover:underline"
                      >
                        View
                      </Link>
                    </td>

                    {/* Edit */}
                    <td className="text-center">
                      <button
                        onClick={() => setEditingUrl(url)}
                        className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-md text-sm hover:bg-indigo-500/30 transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-gray-400">
                    No links found. Start shortening!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* QR Modal */}
        {selectedQR && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-[#11161b] p-6 rounded-xl shadow-xl relative flex flex-col items-center">
              <button
                onClick={() => setSelectedQR(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <h2 className="mb-4 font-semibold">QR Code</h2>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedQR}`}
                alt="QR Code"
                className="w-48 h-48"
              />
              <a
                href={selectedQR}
                target="_blank"
                rel="noreferrer"
                className="mt-4 text-blue-400 hover:underline"
              >
                Open Link
              </a>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingUrl && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-[#11161b] p-6 rounded-xl shadow-xl w-full max-w-lg relative">
              <button
                onClick={() => setEditingUrl(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                ✕
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
