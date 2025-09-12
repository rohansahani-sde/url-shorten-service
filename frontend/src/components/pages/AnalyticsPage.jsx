import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { shortCode } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/analytics/${shortCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    if (shortCode) fetchAnalytics();
  }, [shortCode]);

  console.log(analytics)

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C363F] text-[#29ABE2] font-semibold">
        Loading analytics...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C363F] text-red-500 font-semibold">
        {error}
      </div>
    );
  if (!analytics)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2C363F] text-gray-400 font-medium">
        No analytics found.
      </div>
    );

  const { url, period, stats, charts, urlAnalytics } = analytics;


  return (
    <div className="min-h-screen p-8 bg-[#2C363F] text-white">
      <div className="max-w-5xl mx-auto bg-[#1E242B] rounded-xl shadow-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-4 text-[#29ABE2]">
          Analytics for <span className="text-white">{url.shortCode}</span>
        </h2>

        <div className="space-y-2 mb-6 text-gray-300">
          <p>
            <strong className="text-[#29ABE2]">Original URL:</strong>{" "}
            <a
            href={url.originalUrl}
            target="_blank"
            rel="noreferrer"
            title={url.originalUrl} // tooltip on hover
            className="underline text-[#29ABE2] hover:text-[#1d91c0] block max-w-full truncate"
            >
              {url.originalUrl}
            </a>

          </p>
          <p>
            <strong className="text-[#29ABE2]">Total Clicks:</strong>{" "}
            {url.totalClicks}
          </p>
          <p>
            <strong className="text-[#29ABE2]">Period:</strong>{" "}
            {new Date(period.startDate).toLocaleDateString()} →{" "}
            {new Date(period.endDate).toLocaleDateString()}
          </p>
        </div>

        <hr className="border-gray-700 my-6" />

        {/* Stats Summary */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-[#29ABE2]">
            📊 Stats Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#2C363F] p-4 rounded-lg shadow text-center">
              <p className="text-gray-400 text-sm">Total Clicks</p>
              <p className="font-bold text-lg">{stats.totalClicks}</p>
            </div>
            <div className="bg-[#2C363F] p-4 rounded-lg shadow text-center">
              <p className="text-gray-400 text-sm">Unique Clicks</p>
              <p className="font-bold text-lg">{stats.uniqueClicks}</p>
            </div>
            <div className="bg-[#2C363F] p-4 rounded-lg shadow text-center">
              <p className="text-gray-400 text-sm">Devices</p>
              <p className="font-bold text-lg">{stats.uniqueDevices}</p>
              {/* <p className="font-bold text-lg">{urlAnalytics.os.name}</p> */}

            </div>
            <div className="bg-[#2C363F] p-4 rounded-lg shadow text-center">
              <p className="text-gray-400 text-sm">Countries</p>
              <p className="font-bold text-lg">{stats.uniqueCountries}</p>
            </div>
          </div>
        </section>

        {/* Analytics Sections */}
        <div className="space-y-6">
          {[
            { key: "dailyClicks", title: "📅 Daily Clicks", label: (item) => `${item.date}: ${item.clicks} clicks, ${item.uniqueClicks} unique` },
            { key: "devices", title: "🖥️ Devices", label: (item) => `${item.device}: ${item.count} clicks (${item.percentage}%)` },
            { key: "browsers", title: "🌐 Browsers", label: (item) => `${item.browser}: ${item.count}` },
            { key: "locations", title: "📍 Locations", label: (item) => `${item.country}: ${item.count}` },
            { key: "referrers", title: "🔗 Referrers", label: (item) => `${item.source || "Direct"}: ${item.count}` },
          ].map(({ key, title, label }) => (
            <section key={key}>
              <h3 className="text-xl font-semibold mb-2 text-[#29ABE2]">
                {title}
              </h3>
              {charts[key]?.length > 0 ? (
                <ul className="space-y-1 text-gray-300">
                  {charts[key].map((item, idx) => (
                    <li key={idx}>{label(item)}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No {key} data available.</p>
              )}
            </section>
          ))}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-[#29ABE2] hover:bg-[#1d91c0] text-black font-bold py-2 px-6 rounded-lg shadow transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage;
