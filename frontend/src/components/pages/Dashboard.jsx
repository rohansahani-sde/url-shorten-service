import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchData();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!data) return <p className="p-6">No data found</p>;

  const { summary, topUrls, recentActivity, charts } = data;
  const { dailyClicks, devices, locations } = charts;

  const COLORS = ["#6366F1", "#F59E0B", "#10B981", "#EF4444", "#3B82F6"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card title="Total URLs" value={summary.totalUrls} />
        <Card title="Total Clicks" value={summary.totalClicks} />
        <Card title="Unique Clicks" value={summary.uniqueClicks} />
        <Card title="Avg Clicks/URL" value={summary.avgClicksPerUrl} />
        <Card title="Active URLs" value={summary.activeUrls} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Clicks Line Chart */}
        <ChartCard title="Daily Clicks">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyClicks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" stroke="#6366F1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Device Distribution Pie Chart */}
        <ChartCard title="Devices">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={devices}
                dataKey="count"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {devices.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Locations Bar Chart */}
        <ChartCard title="Locations">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={locations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top URLs */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">🔥 Top URLs</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Short URL</th>
                <th className="p-3">Original URL</th>
                <th className="p-3">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {topUrls.map((url) => (
                <tr key={url.shortCode} className="border-t">
                  <td className="p-3 text-blue-600">{url.shortUrl}</td>
                  <td className="p-3 truncate max-w-xs">{url.originalUrl}</td>
                  <td className="p-3">{url.clickCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">🕒 Recent Activity</h2>
        <div className="bg-white shadow rounded-lg divide-y">
          {recentActivity.slice(0, 5).map((activity, idx) => (
            <div key={idx} className="p-3 flex justify-between text-sm">
              <div>
                <p className="font-medium">{activity.shortCode}</p>
                <p className="text-gray-500">{activity.originalUrl}</p>
              </div>
              <div className="text-right">
                <p>{new Date(activity.timestamp).toLocaleString()}</p>
                <p className="text-gray-500">
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

/* Reusable Card Component */
function Card({ title, value }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg text-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

/* Reusable Chart Wrapper */
function ChartCard({ title, children }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
