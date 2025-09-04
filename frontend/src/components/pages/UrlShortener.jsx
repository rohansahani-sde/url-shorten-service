import React, { useState } from "react";
import axios from "../../api/axios";


export default function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponseData(null);

    try {
      const yourToken = localStorage.getItem("token");
      const res = await axios.post("/urls", {
        headers: {
          // "Content-Type": "application/json",
          // ⚠️ Agar JWT token required hai to yaha Authorization header add karo:
          "Authorization": `Bearer ${yourToken}`
        },
        body: JSON.stringify({
          originalUrl,
          customAlias: customAlias || undefined, // optional
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setResponseData(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-2xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">URL Shortener</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter your long URL (with http:// or https://)"
          className="w-full p-2 border rounded-md"
          required
        />

        <input
          type="text"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          placeholder="Custom alias (optional)"
          className="w-full p-2 border rounded-md"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Shorten URL"}
        </button>
      </form>

      {/* Error */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Response */}
      {responseData && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Short URL Created 🎉</h2>
          <p>
            <strong>Original URL:</strong>{" "}
            <a
              href={responseData.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {responseData.originalUrl}
            </a>
          </p>
          <p>
            <strong>Short URL:</strong>{" "}
            <a
              href={responseData.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline"
            >
              {responseData.shortUrl}
            </a>
          </p>
          <p>
            <strong>Clicks:</strong> {responseData.clickCount}
          </p>
          {responseData.description && (
            <p>
              <strong>Description:</strong> {responseData.description}
            </p>
          )}
          {responseData.expiresAt && (
            <p>
              <strong>Expires At:</strong>{" "}
              {new Date(responseData.expiresAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
