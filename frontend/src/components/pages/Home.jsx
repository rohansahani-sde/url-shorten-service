import axios from "axios";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";

/* ── Animated counter hook ── */
function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [count, ref];
}

function StatNumber({ value, suffix = "", label }) {
  const [count, ref] = useCountUp(value);
  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03]">
      <span className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-slate-400 text-xs md:text-sm font-medium mt-1 text-center">{label}</span>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Lightning Fast",
    desc: "Shorten any URL in milliseconds. Our infrastructure handles millions of redirects daily with 99.9% uptime.",
    color: "from-yellow-500/10 via-transparent to-transparent",
    border: "border-yellow-500/15 hover:border-yellow-500/30",
    glow: "group-hover:shadow-yellow-500/5",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Secure by Default",
    desc: "All links are encrypted. We scan for malicious URLs and protect your audience from harmful content.",
    color: "from-emerald-500/10 via-transparent to-transparent",
    border: "border-emerald-500/15 hover:border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/5",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Deep Analytics",
    desc: "Track clicks, devices, locations, browsers, and referrers — all in real-time with beautiful charts.",
    color: "from-indigo-500/10 via-transparent to-transparent",
    border: "border-indigo-500/15 hover:border-indigo-500/30",
    glow: "group-hover:shadow-indigo-500/5",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
    title: "Custom Aliases",
    desc: "Brand your links with memorable custom aliases. Make your URLs unforgettable and professional.",
    color: "from-purple-500/10 via-transparent to-transparent",
    border: "border-purple-500/15 hover:border-purple-500/30",
    glow: "group-hover:shadow-purple-500/5",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M4 8h16M4 16h16" />
      </svg>
    ),
    title: "QR Code Generator",
    desc: "Every shortened link auto-generates a QR code. Perfect for print, events, and offline marketing.",
    color: "from-cyan-500/10 via-transparent to-transparent",
    border: "border-cyan-500/15 hover:border-cyan-500/30",
    glow: "group-hover:shadow-cyan-500/5",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Link Expiry",
    desc: "Set expiration dates on your links. Great for campaigns, limited-time offers, and time-sensitive content.",
    color: "from-rose-500/10 via-transparent to-transparent",
    border: "border-rose-500/15 hover:border-rose-500/30",
    glow: "group-hover:shadow-rose-500/5",
  },
];

const steps = [
  { num: "01", title: "Paste Your URL", desc: "Drop any long URL into SnapLink — from any website, social media, or app." },
  { num: "02", title: "Customize It", desc: "Add a custom alias, set tags, description, and expiration to match your needs." },
  { num: "03", title: "Share & Track", desc: "Share your short link everywhere and watch real-time analytics pour in." },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [demoUrl, setDemoUrl] = useState("");
  const [demoResult, setDemoResult] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState("");
  const [copied, setCopied] = useState(false);

  const isLoggedIn = !!user;

  const handleLogout = useCallback(async () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
  }, [navigate, setUser]);

  const handleDemoShorten = async () => {
    if (!demoUrl.trim()) return;
    try {
      setDemoLoading(true);
      setDemoError("");
      setDemoResult("");

      const res = await axios.post("/api/urls/guest", {
        originalUrl: demoUrl
      });
      setDemoResult(res.data.shortUrl);
    } catch (err) {
      setDemoResult("");
      setDemoError(err?.response?.data?.message || "Failed to create short URL");
    } finally {
      setDemoLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(demoResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-200 font-['Inter'] overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#060913]/70 border-b border-white/[0.05] transitioning-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16 md:h-20">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-white">Snap<span className="text-indigo-400">Link</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-indigo-400 hover:after:w-full after:transition-all">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-indigo-400 hover:after:w-full after:transition-all">How It Works</a>
            <a href="#stats" className="hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-indigo-400 hover:after:w-full after:transition-all">Stats</a>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/me")}
                  className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-bold bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-xl border border-white/[0.05] transition-all hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2.5 text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 overflow-hidden">
        {/* Ambient Blurred Canvas elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px]" />
          {/* Enhanced Grid Background */}
          <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '45px 45px'}} />
        </div>

        {/* Badge Banner */}
        <div className="mb-6 z-10 animate-fade-in-down">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            v2.0 — Live Dashboard Updates
          </span>
        </div>

        {/* Hero Copywriting Header */}
        <div className="z-10 max-w-4xl px-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] mb-6">
            Shorten. <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Track.</span> Grow.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            The advanced link management platform with instant structural analytics, custom branding alias parameters, and seamless automation matrices.
          </p>
        </div>

        {/* Interaction Form Area Container */}
        <div className="z-10 w-full max-w-2xl px-2">
          <div className="bg-slate-900/40 backdrop-blur-md p-2 rounded-2xl border border-white/[0.08] shadow-2xl focus-within:border-indigo-500/45 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={demoUrl}
                onChange={e => setDemoUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDemoShorten()}
                placeholder="Paste your long destination link..."
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-500 outline-none text-sm font-medium"
              />
              <button
                onClick={handleDemoShorten}
                disabled={demoLoading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] whitespace-nowrap text-sm"
              >
                {demoLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing...
                  </span>
                ) : "Shorten Now"}
              </button>
            </div>
          </div>

          {/* Inline Action Response Cards */}
          {demoResult && (
            <div className="mt-4 text-left bg-slate-900/60 border border-white/[0.06] rounded-xl p-4 shadow-xl animate-fade-in-up">
              <div className="flex items-center justify-between gap-3 p-3 bg-emerald-500/[0.04] border border-emerald-500/20 rounded-lg">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs shrink-0">✓</span>
                  <a href={demoResult} target="_blank" rel="noopener noreferrer" className="text-emerald-300 font-semibold text-sm break-all underline hover:text-emerald-200 transition-colors">
                    {demoResult}
                  </a>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] rounded-md text-slate-200 transition-colors shrink-0"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>

              {!isLoggedIn && (
                <div className="mt-4 p-4 rounded-lg border border-amber-500/10 bg-amber-500/[0.02]">
                  <h4 className="text-amber-400 font-bold text-sm">Guest Mode URL Limitations</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    This generated link will automatically deactivate within 7 days. Create your dashboard deployment space to configure indefinite storage parameters and link tracking setups.
                  </p>
                  <button
                    onClick={() => navigate("/register")}
                    className="mt-3 px-4 py-2 text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg transition-all"
                  >
                    Claim Lifetime Dashboard Free
                  </button>
                </div>
              )}
            </div>
          )}

          {demoError && (
            <div className="mt-3 p-3.5 rounded-xl bg-rose-500/[0.04] border border-rose-500/20 text-rose-400 text-sm font-medium text-left">
              {demoError}
            </div>
          )}
          <p className="mt-4 text-xs text-slate-500">No payment profiles required. Access completely sandbox dynamic parameters free.</p>
        </div>

        {/* Primary Anchor Link Triggers */}
        <div className="flex items-center justify-center gap-4 mt-8 z-10 flex-wrap">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm rounded-xl transition-all shadow-xl shadow-white/5 hover:-translate-y-0.5"
          >
            Deploy Space Free
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5"
          >
            Access Core System
          </button>
        </div>

        {/* Absolute Bottom Indicator Hook */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30 select-none">
          <span className="text-[10px] tracking-widest uppercase font-medium text-slate-400">Scroll to Explore</span>
          <svg className="w-4 h-4 text-slate-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section id="stats" className="py-16 px-4 max-w-7xl mx-auto relative">
        <div className="bg-gradient-to-b from-white/[0.01] to-transparent border border-white/[0.04] rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatNumber value={10} suffix="M+" label="Links Shortened" />
            <StatNumber value={500} suffix="K+" label="Registered Systems" />
            <StatNumber value={50} suffix="B+" label="Total API Handshakes" />
            <StatNumber value={99} suffix=".9%" label="Active Service Engine" />
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Platform Infrastructure</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-2">
            Engineered for speed, built for security
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group relative p-6 rounded-2xl bg-gradient-to-b ${f.color} border ${f.border} hover:shadow-2xl ${f.glow} transition-all duration-300`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4 shadow-sm">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS SECTION ── */}
      <section id="how-it-works" className="py-20 px-4 max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Procedural Workflows</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-2">Functional inside 3 phases</h2>
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={step.num} className="bg-white/[0.01] border border-white/[0.03] rounded-2xl p-6 flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black mb-4 border ${
                  i === 0 ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                  i === 1 ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                  'bg-pink-500/10 border-pink-500/20 text-pink-400'
                }`}>
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Initialize Environment
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] py-10 px-6 backdrop-blur-sm bg-[#060913]/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className="font-bold text-sm text-white">Snap<span className="text-indigo-400">Link</span></span>
          </div>
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} SnapLink. Structural Cloud Matrices.</p>
          <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}