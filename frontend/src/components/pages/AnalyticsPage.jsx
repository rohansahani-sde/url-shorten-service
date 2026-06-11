import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  Legend
} from "recharts";

const COLORS = ["#6366F1", "#A855F7", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl px-4 py-3 shadow-xl text-sm">
        {label && <p className="text-slate-400 text-xs mb-1">{label}</p>}
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || "#6366F1" }} className="font-bold">
            {p.value?.toLocaleString()} {p.name}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`relative p-5 rounded-2xl border overflow-hidden group hover:-translate-y-0.5 transition-all duration-300 ${color}`}>
      <div className="absolute top-3 right-3 text-3xl opacity-20">{icon}</div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <p className="text-3xl font-black text-white">{(value || 0).toLocaleString()}</p>
    </div>
  );
}

function ChartCard({ title, icon, children, fullWidth = false }) {
  return (
    <div className={`bg-[#0D1117]/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-xl ${fullWidth ? "col-span-full" : ""}`}>
      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

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
        setError("Failed to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (shortCode) fetchAnalytics();
  }, [shortCode]);

  if (loading) return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="h-8 w-64 bg-slate-800/60 rounded-xl animate-pulse mb-6" />
      <div className="h-28 bg-slate-800/40 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-800/40 rounded-2xl animate-pulse" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-slate-800/40 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-red-400 mb-5">{error}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition">Go Back</button>
      </div>
    </div>
  );

  if (!analytics) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-400 text-lg">No analytics data found.</p>
    </div>
  );

  const { url, period, stats, charts } = analytics;

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/urls" className="hover:text-slate-300 transition-colors">My URLs</Link>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        <span className="text-slate-300 font-medium">Analytics</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        <span className="text-indigo-400 font-bold">{url.shortCode}</span>
      </div>

      {/* URL Header */}
      <div className="bg-[#0D1117]/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm font-bold">
                {url.shortCode}
              </div>
              {period && (
                <span className="text-xs text-slate-500 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700/40">
                  {typeof period === "object"
                    ? `${new Date(period.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(period.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : period}
                </span>
              )}
            </div>
            <h1 className="text-lg md:text-xl font-black text-white mb-1">Analytics Report</h1>
            <a href={url.originalUrl} target="_blank" rel="noreferrer"
              className="text-sm text-slate-400 hover:text-indigo-300 transition-colors truncate block max-w-2xl">
              {url.originalUrl}
            </a>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:border-indigo-500/40 rounded-xl font-semibold text-sm transition-all flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        <StatCard title="Total Clicks" value={stats.totalClicks} icon="👆" color="bg-indigo-900/40 border-indigo-500/20" />
        <StatCard title="Unique Clicks" value={stats.uniqueClicks} icon="👤" color="bg-emerald-900/40 border-emerald-500/20" />
        <StatCard title="Devices" value={stats.uniqueDevices} icon="📱" color="bg-purple-900/40 border-purple-500/20" />
        <StatCard title="Countries" value={stats.uniqueCountries} icon="🌍" color="bg-orange-900/40 border-orange-500/20" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Daily Clicks - full width */}
        <div className="col-span-full">
          <ChartCard title="Daily Clicks" icon="📅" fullWidth>
            {charts.dailyClicks?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={charts.dailyClicks} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="uniqueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "12px", color: "#94A3B8" }} />
                  <Area type="monotone" dataKey="clicks" name="Total Clicks" stroke="#6366F1" strokeWidth={2.5} fill="url(#dailyGrad)" dot={false} activeDot={{ r: 5 }} />
                  <Area type="monotone" dataKey="uniqueClicks" name="Unique Clicks" stroke="#10B981" strokeWidth={2} fill="url(#uniqueGrad)" dot={false} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-500">No daily click data available yet</div>
            )}
          </ChartCard>
        </div>

        {/* Devices Pie */}
        <ChartCard title="Device Types" icon="🖥️">
          {charts.devices?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={charts.devices} dataKey="count" nameKey="device" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {charts.devices.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value, entry) => {
                    const deviceName = entry?.payload?.device || value;
                    const percentage = entry?.payload?.percentage !== undefined ? `${entry.payload.percentage}%` : '';
                    return (
                      <span style={{ color: "#94A3B8", fontSize: "12px" }}>
                        {deviceName} {percentage ? `(${percentage})` : ""}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500">No device data yet</div>
          )}
        </ChartCard>

        {/* Browsers Bar */}
        <ChartCard title="Browsers" icon="🌐">
          {charts.browsers?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={charts.browsers} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="browser" stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="clicks" radius={[0, 6, 6, 0]}>
                  {charts.browsers.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500">No browser data yet</div>
          )}
        </ChartCard>

        {/* Locations Bar */}
        <ChartCard title="Top Countries" icon="📍">
          {charts.locations?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={charts.locations.slice(0, 6)} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="country" stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="clicks" radius={[6, 6, 0, 0]}>
                  {charts.locations.slice(0, 6).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500">No location data yet</div>
          )}
        </ChartCard>

        {/* Referrers */}
        <ChartCard title="Traffic Sources" icon="🔗">
          {charts.referrers?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={charts.referrers.slice(0, 6)} layout="vertical" margin={{ top: 5, right: 15, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="source" stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={80}
                  tickFormatter={v => v || "Direct"} />
                <Tooltip content={<CustomTooltip />} formatter={(val, name, props) => [val, props.payload.source || "Direct"]} />
                <Bar dataKey="count" name="visits" radius={[0, 6, 6, 0]}>
                  {charts.referrers.slice(0, 6).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500">No referrer data yet</div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
