import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";

const StatCard = ({ title, value }) => (
  <div className="bg-[#1e293b] p-6 rounded-xl shadow hover:shadow-lg transition">
    <p className="text-gray-400 text-sm">{title}</p>
    <p className="text-2xl font-bold text-[#38bdf8]">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-[#1e293b] p-6 rounded-xl shadow space-y-4">
    <h3 className="text-lg font-semibold text-[#38bdf8]">{title}</h3>
    {children}
  </div>
);

export default function AnalyticsPage() {
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-[#38bdf8] font-semibold">
        Loading analytics...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-red-500 font-semibold">
        {error}
      </div>
    );
  if (!analytics)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-gray-400 font-medium">
        No analytics found.
      </div>
    );

  const { url, period, stats, charts } = analytics;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#38bdf8]">
              Analytics Report
            </h2>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-400 hover:underline block truncate max-w-md"
              title={url.originalUrl}
            >
              {url.originalUrl}
            </a>
          </div>
          <span className="px-3 py-1 bg-[#38bdf8]/20 text-[#38bdf8] rounded-lg text-sm">
            {url.shortCode}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard title="Total Clicks" value={stats.totalClicks} />
          <StatCard title="Unique Clicks" value={stats.uniqueClicks} />
          <StatCard title="Devices" value={stats.uniqueDevices} />
          <StatCard title="Countries" value={stats.uniqueCountries} />
        </div>

        {/* Charts area */}
        <div className="grid md:grid-cols-2 gap-6">
          <ChartCard title="📅 Daily Clicks">
            {charts.dailyClicks?.length ? (
              <ul className="space-y-1 text-gray-300 text-sm">
                {charts.dailyClicks.map((d, i) => (
                  <li key={i}>
                    {d.date}: {d.clicks} clicks ({d.uniqueClicks} unique)
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No daily data.</p>
            )}
          </ChartCard>

          <ChartCard title="🖥️ Devices">
            {charts.devices?.length ? (
              <ul className="space-y-1 text-gray-300 text-sm">
                {charts.devices.map((d, i) => (
                  <li key={i}>
                    {d.device}: {d.count} ({d.percentage}%)
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No device data.</p>
            )}
          </ChartCard>

          <ChartCard title="🌐 Browsers">
            {charts.browsers?.length ? (
              <ul className="space-y-1 text-gray-300 text-sm">
                {charts.browsers.map((b, i) => (
                  <li key={i}>
                    {b.browser}: {b.count}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No browser data.</p>
            )}
          </ChartCard>

          <ChartCard title="📍 Locations">
            {charts.locations?.length ? (
              <ul className="space-y-1 text-gray-300 text-sm">
                {charts.locations.map((l, i) => (
                  <li key={i}>
                    {l.country}: {l.count}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No location data.</p>
            )}
          </ChartCard>

          <ChartCard title="🔗 Referrers">
            {charts.referrers?.length ? (
              <ul className="space-y-1 text-gray-300 text-sm">
                {charts.referrers.map((r, i) => (
                  <li key={i}>
                    {r.source || "Direct"}: {r.count}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No referrer data.</p>
            )}
          </ChartCard>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="bottom-6 left-6 bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-bold py-2 px-6 rounded-full shadow-lg transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
