import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../fireBase/firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "../../api/axios";

const InputField = ({ icon, type, placeholder, value, onChange, id }) => (
  <div className="relative group w-full">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none duration-200">
      {icon}
    </div>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-11 pr-5 py-3.5 bg-white/[0.01] border border-white/[0.06] focus:border-indigo-500/40 focus:bg-white/[0.03] rounded-xl text-white placeholder-slate-600 outline-none transition-all text-sm font-medium duration-200 shadow-inner"
    />
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all configuration parameters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid authentication matrix signature.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = result._tokenResponse.idToken;
      const res = await axios.post("/auth/google", { idToken: credential });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Google handshake exchange rejected. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-200 flex font-['Inter'] selection:bg-indigo-500/30 selection:text-white overflow-hidden">
      
      {/* ── LEFT CANVAS: METRIC INSIGHTS SHIELD ── */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center p-12 border-r border-white/[0.03] bg-[#050811]">
        {/* Abstract Matrix Canvas Pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-xl relative z-10 w-full space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest">
              Routing Cluster v2.0
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Enterprise link scaling, <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">monitored in real-time.</span>
            </h2>
          </div>

          {/* Dummy Structural Terminal View Component */}
          <div className="w-full bg-[#070b14] border border-white/[0.06] rounded-2xl p-5 shadow-2xl space-y-4 font-mono text-xs text-slate-400">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <span>snaplink-cluster-edge</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-slate-500">{"// Active connection stream handshake initialized"}</p>
              <p><span className="text-indigo-400">⚡ GET</span> /api/v2/metrics/summary <span className="text-emerald-400">200 OK</span> <span className="text-slate-600">14ms</span></p>
              <p><span className="text-purple-400">📦 Core Matrix:</span> Syncing global key distribution maps...</p>
              <p><span className="text-pink-400">🛡️ TLS Layer:</span> Encrypted tunnels validated [AES-256]</p>
            </div>
            <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-500">
              <span>Payload size: 1.42kb</span>
              <span className="text-emerald-400 animate-pulse">● System Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT CANVAS: MINIMAL AUTHENTICATION INTERFACE ── */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-6 sm:p-10 md:p-16 relative bg-[#04060a]">
        {/* Mobile Background Ambient Blur Cover */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/[0.05] rounded-full blur-[100px]" />
        </div>

        {/* Top Branding Section Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Snap<span className="text-indigo-400">Link</span></span>
          </div>

          <button 
            onClick={() => navigate("/register")}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-white/[0.02] border border-white/[0.06] px-3 py-1.5 rounded-lg"
          >
            Create account
          </button>
        </div>

        {/* Central Core Login Shell Wrapper */}
        <div className="my-auto max-w-sm w-full mx-auto z-10 py-12 bg-[#0b0f21] px-10 rounded-2xl">
          <div className="space-y-1.5 mb-8 text-left">
            <h1 className="text-2xl font-black text-white tracking-tight">Access Environment</h1>
            <p className="text-slate-400 text-xs font-medium">Verify credentials to launch routing cluster dashboard.</p>
          </div>

          {/* Action Error Output Notification Banner */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-rose-500/[0.03] border border-rose-500/15 rounded-xl text-rose-400 text-xs font-medium animate-scale-in">
              <svg className="w-4 h-4 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Oauth Social Auth Platform Actions */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] text-white font-bold rounded-xl transition-all text-xs tracking-wide disabled:opacity-40"
          >
            {googleLoading ? (
              <svg className="animate-spin w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>Identity Authorization via Google</span>
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-white/[0.04]" />
            <span className="text-slate-600 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">Standard Registry Parameters</span>
            <div className="flex-1 h-[1px] bg-white/[0.04]" />
          </div>

          {/* Secure Credential Input Form Fields */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <InputField
              id="login-email"
              type="email"
              placeholder="System email hash"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
            />
            <InputField
              id="login-password"
              type="password"
              placeholder="Cluster security key"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl transition-all text-sm shadow-md active:scale-[0.99] disabled:opacity-40 select-none"
            >
              {loading ? "Authenticating Session Token..." : "Authenticate Protocol"}
            </button>
          </form>
        </div>

        {/* Inline Base Footer Legal Notice Parameters */}
        <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium tracking-wide z-10 border-t border-white/[0.3] pt-4">
          <span>Protected Node Environment</span>
          <div className="flex gap-4 ">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Infrastructure</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;