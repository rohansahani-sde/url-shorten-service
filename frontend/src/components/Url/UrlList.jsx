import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import { Copy, QrCode } from "lucide-react"; // icons
// import favicon from "/public/default-favicon.png"
import UpdateUrl from "./UpdateUrl";

export default function UrlList() {
  const [urls, setUrls] = useState([]);
  const [copied, setCopied] = useState("");
  // const [editingUrlId, setEditingUrlId] = useState(null);
  const [editingUrl, setEditingUrl] = useState(null);


  const onSuccess = (updatedUrl) => {
    console.log("Updated URL:", updatedUrl);
    setEditingUrl(null); // close popup after success
    // optionally refresh list of urls here
  };

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/urls", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // sort by createdAt (latest first)
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


  function Favicon({ url }) {
  const domain = new URL(url).hostname; // extract domain
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  return <img src={faviconUrl} alt="favicon" className="w-6 h-6"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/default-favicon.png"; // fallback image
  }}
   />;
}
  
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="min-h-screen bg-[#2C363F]">

    <div className="p-6 max-w-6xl mx-auto ">

      <h1 className="text-3xl flex pb-6 justify-center items-center font-extrabold text-transparent bg-clip-text 
      bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        Make Your Links Short & Sweet ✨
      </h1>
        

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-[#152632] text-white rounded-xl shadow-lg">
          <thead className="bg-[#131E2A] text-sm text-gray-300">
            <tr>
              <th className="py-3 px-4 text-left">No.</th>
              <th className="py-3 px-4 text-left">Short Link</th>
              <th className="py-3 px-4 text-left">Original Link</th>
              <th className="py-3 px-4 text-center">QR Code</th>
              <th className="py-3 px-4 text-center">Clicks</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Date</th>
              <th className="py-3 px-4 text-center">Analytics</th>
              <th className="py-3 px-4 text-center">Edit Link</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, idx) => (
              <tr
                key={url._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="py-3 px-4 max-w-[250px] truncate">
                  {idx+1}.
                </td>
                {/* Short Link + Copy */}
                <td className="py-3 px-4 flex items-center space-x-2">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#5EDFEA] hover:underline truncate"
                  >
                    {url.shortUrl}
                  </a>
                  <button
                    onClick={() => handleCopy(url.shortUrl)}
                    className="p-1 rounded-md hover:bg-white/10"
                  >
                    {copied === url.shortUrl ? (
                      <span className="text-xs text-green-400">Copied</span>
                    ) : (
                      <h1>COPY</h1>
                      // <button>Copy</button>
                      // {/* // <Copy size={16} className="text-gray-300" /> */}
                    )}
                  </button>
                </td>

                {/* Original Link */}
                <td className="py-3 px-4 max-w-[250px] truncate">
                  {/* <div className="flex items-center gap-3">
                  </div> */}

                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-300 hover:underline flex gap-2"
                  >
                      <Favicon url={url.originalUrl}  />
                    {url.originalUrl}
                  </a>

                </td>

                {/* QR Code */}
                <td className="py-3 px-4 text-center">
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${url.shortUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    QR
                    {/* <QrCode className="mx-auto text-gray-400 hover:text-[#5EDFEA]" /> */}
                  </a>
                </td>

                {/* Clicks */}
                <td className="py-3 px-4 text-center">{url.clickCount || 0}</td>

                {/* Status */}
                <td className="py-3 px-4 text-center">
                  {url.isActive ? (
                    <span className="text-green-400 font-medium">Active</span>
                  ) : (
                    <span className="text-red-400 font-medium">Inactive</span>
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
                <td>
                  <Link to={`/analytics/${url.shortCode}`}>View Analytics</Link>
                </td>

                {/* edit button */}
                <td>
                  <button
                  onClick={() => setEditingUrl(url)} 
                  className="px-2 py-1 bg-blue-600 rounded-md hover:bg-blue-700 text-sm text-white"
                  >
                    Edit
                  </button>

                </td>


              </tr>
            ))}
          </tbody>
        </table>

        {/* edit from  */}
        {editingUrl && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="bg-[#2C363F] p-6 rounded-xl shadow-xl w-full max-w-lg relative">
      <button
        onClick={() => setEditingUrl(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white"
      >
        ✕
      </button>

      {/* ✅ pass the full object */}
      <UpdateUrl
        url={editingUrl}
        onSuccess={(updatedUrl) => {
          setUrls((prev) =>
            prev.map((u) => (u._id === (updatedUrl._id || updatedUrl.id) ?  { ...u, ...updatedUrl } : u))
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

    </div>
  );
}
