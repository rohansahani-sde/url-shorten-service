import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/analytics/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data.analytics);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshHandle = async () => {
    fetchData();
  };

  if (loading) return <p className="p-6 animate-pulse text-gray-400">Loading...</p>;
  if (!data) return <p className="p-6 text-gray-400">No data found</p>;

  const { summary, topUrls, recentActivity, charts } = data;
  const { dailyClicks, devices, locations } = charts;

  const COLORS = ["#6366F1", "#F59E0B", "#10B981", "#EF4444", "#3B82F6"];

  return (
    <div className="p-6 space-y-8 bg-gray-900 min-h-screen text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📊 Dashboard</h1>
        <button
          onClick={refreshHandle}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition"
        >
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryCard title="Total URLs" value={summary.totalUrls} color="bg-indigo-700 text-indigo-100" />
        <SummaryCard title="Total Clicks" value={summary.totalClicks} color="bg-green-700 text-green-100" />
        <SummaryCard title="Unique Clicks" value={summary.uniqueClicks} color="bg-yellow-700 text-yellow-100" />
        <SummaryCard title="Avg Clicks/URL" value={summary.avgClicksPerUrl} color="bg-purple-700 text-purple-100" />
        <SummaryCard title="Active URLs" value={summary.activeUrls} color="bg-pink-700 text-pink-100" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Clicks Line Chart */}
        <ChartCard title="📈 Daily Clicks">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyClicks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px" }}
                labelStyle={{ color: "#F9FAFB" }}
              />
              <Line type="monotone" dataKey="clicks" stroke="#6366F1" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Device Distribution Pie Chart */}
        <ChartCard title="📱 Devices">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={devices}
                dataKey="count"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {devices.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px" }}
                labelStyle={{ color: "#F9FAFB" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Locations Bar Chart */}
        <ChartCard title="🌍 Locations">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={locations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="country" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px" }}
                labelStyle={{ color: "#F9FAFB" }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top URLs */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">🔥 Top URLs</h2>
        <div className="bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="p-3">Short URL</th>
                <th className="p-3">Original URL</th>
                <th className="p-3">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {topUrls.map((url) => (
                <tr key={url.shortCode} className="border-t border-gray-700 hover:bg-gray-700 transition">
                  <td className="p-3 text-indigo-400 font-medium">{url.shortUrl}</td>
                  <td className="p-3 truncate max-w-xs text-gray-400">{url.originalUrl}</td>
                  <td className="p-3 font-semibold">{url.clickCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">🕒 Recent Activity</h2>
        <div className="bg-gray-800 shadow-lg rounded-xl divide-y divide-gray-700">
          {recentActivity.slice(0, 5).map((activity, idx) => (
            <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-700 transition">
              <div>
                <p className="font-medium text-indigo-400">{activity.shortCode}</p>
                <p className="text-gray-400 truncate max-w-md">{activity.originalUrl}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium text-gray-200">{new Date(activity.timestamp).toLocaleString()}</p>
                <p className="text-gray-400">
                  {activity.device} • {activity.browser}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Reusable Summary Card */
function SummaryCard({ title, value, color }) {
  return (
    <div className={`p-4 rounded-xl shadow-md text-center ${color} hover:scale-105 transition`}>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

/* Reusable Chart Wrapper */
function ChartCard({ title, children }) {
  return (
    <div className="p-5 bg-gray-800 shadow-lg rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-gray-200">{title}</h3>
      {children}
    </div>
  );
}
