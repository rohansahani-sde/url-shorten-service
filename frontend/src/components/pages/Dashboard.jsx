import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend, Area, AreaChart
} from "recharts";

const COLORS = ["#6366F1", "#A855F7", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl px-4 py-3 shadow-xl text-sm">
        {label && <p className="text-slate-400 text-xs mb-1">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">{p.value.toLocaleString()} {p.name}</p>
        ))}
      </div>
    );
  }
  return null;
};

function AnimatedStatCard({ title, value, color, icon, trend }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const numVal = parseFloat(value) || 0;
    let start = 0;
    const step = numVal / 40;
    const t = setInterval(() => {
      start += step;
      if (start >= numVal) { setDisplayed(numVal); clearInterval(t); }
      else setDisplayed(Math.floor(start));
    }, 20);
    return () => clearInterval(t);
  }, [value]);

  return (
    <div className={`relative p-5 rounded-2xl border shadow-lg overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-default ${color}`}>
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 flex items-center justify-center text-5xl">{icon}</div>
      <p className="text-sm font-semibold text-slate-300 mb-2 relative z-10">{title}</p>
      <p className="text-3xl font-black text-white relative z-10">{displayed.toLocaleString()}</p>
      {trend && (
        <p className="text-xs text-slate-400 mt-1 relative z-10 flex items-center gap-1">
          <span className="text-emerald-400">↑</span> {trend}
        </p>
      )}
    </div>
  );
}

function ChartCard({ title, children, span = "col-span-1" }) {
  return (
    <div className={`bg-[#0D1117]/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-xl ${span}`}>
      <h3 className="text-base font-bold text-slate-200 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
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
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <div className="h-9 w-48 bg-slate-800/60 rounded-xl animate-pulse" />
          <div className="h-10 w-28 bg-slate-800/60 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-slate-800/40 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="h-72 bg-slate-800/40 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-white mb-2">No analytics data yet</h2>
        <p className="text-slate-400 mb-5">Create some short links and start sharing them!</p>
        <a href="/urls/create" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition">Create a Link</a>
      </div>
    </div>
  );

  const { summary, topUrls, recentActivity, charts } = data;
  const { dailyClicks, devices, locations } = charts;

  const statCards = [
    { title: "Total URLs", value: summary.totalUrls, color: "bg-indigo-900/40 border-indigo-500/20", icon: "🔗", trend: "all time" },
    { title: "Total Clicks", value: summary.totalClicks, color: "bg-emerald-900/40 border-emerald-500/20", icon: "👆", trend: "cumulative" },
    { title: "Unique Clicks", value: summary.uniqueClicks, color: "bg-yellow-900/40 border-yellow-500/20", icon: "👤", trend: "distinct visitors" },
    { title: "Avg / URL", value: summary.avgClicksPerUrl, color: "bg-purple-900/40 border-purple-500/20", icon: "📈", trend: "clicks per link" },
    { title: "Active URLs", value: summary.activeUrls, color: "bg-pink-900/40 border-pink-500/20", icon: "✅", trend: "live links" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Your link performance at a glance</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all text-sm font-semibold disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={refreshing ? "animate-spin" : ""}>
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
            <path d="M16 16h5v5"/>
          </svg>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 stagger-children">
        {statCards.map(c => <AnimatedStatCard key={c.title} {...c} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Daily Clicks - Area Chart */}
        <ChartCard title="📈 Daily Clicks (Last 30 days)" span="md:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyClicks} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="clicks" name="clicks" stroke="#6366F1" strokeWidth={2.5} fill="url(#clickGrad)" dot={false} activeDot={{ r: 5, fill: "#6366F1" }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Device Pie */}
        <ChartCard title="📱 Device Breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={devices} dataKey="count" nameKey="device" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} label={({ device, percent }) => `${device} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {devices.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Locations Bar */}
        <ChartCard title="🌍 Top Locations">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={locations.slice(0, 6)} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={true} vertical={false} />
              <XAxis dataKey="country" stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="clicks" radius={[6, 6, 0, 0]}>
                {locations.slice(0, 6).map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top URLs Table */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">🔥 Top Performing URLs</h2>
        <div className="bg-[#0D1117]/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800/80">
                <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Short URL</th>
                <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Original URL</th>
                <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {topUrls.map((url, i) => (
                <tr key={url.shortCode} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 font-bold w-5 text-center">{i + 1}</span>
                      <a href={url.shortUrl} target="_blank" rel="noreferrer" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                        {url.shortUrl.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-slate-500 truncate block max-w-xs text-xs">{url.originalUrl}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-black text-white text-base">{url.clickCount.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">🕒 Recent Activity</h2>
        <div className="bg-[#0D1117]/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl divide-y divide-slate-800/50">
          {recentActivity.slice(0, 5).map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 text-sm font-black">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-indigo-400 text-sm">{activity.shortCode}</p>
                  <p className="text-slate-500 truncate max-w-[180px] md:max-w-sm text-xs">{activity.originalUrl}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-300 text-xs font-medium">{new Date(activity.timestamp).toLocaleString()}</p>
                <p className="text-slate-500 text-xs">{activity.device} · {activity.browser}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
