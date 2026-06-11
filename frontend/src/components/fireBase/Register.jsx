import { useState, useContext } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

const InputField = ({ icon, type, placeholder, name, value, onChange, id }) => (
  <div className="relative group w-full">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors pointer-events-none duration-200">
      {icon}
    </div>
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-11 pr-5 py-3.5 bg-[#090d16] border border-slate-800 focus:border-indigo-500/80 rounded-xl text-white placeholder-slate-500 outline-none transition-all text-sm font-medium duration-200 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
    />
  </div>
);

function PasswordStrength({ password }) {
  const getStrength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(password);
  const labels = ["", "Weak Matrix security", "Fair Registry entropy", "Good Integrity profile", "Strong Terminal lock"];
  const colors = ["", "bg-rose-500", "bg-amber-500", "bg-indigo-500", "bg-emerald-500"];
  const textColors = ["", "text-rose-400", "text-amber-400", "text-indigo-400", "text-emerald-400"];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5 px-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : "bg-slate-800"}`} />
        ))}
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${textColors[strength]}`}>{labels[strength]}</p>
    </div>
  );
}

export default function Register() {
  const { fetchMe } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogleRegister = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post("/auth/google", { idToken });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Google infrastructure handshake failed. Try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Security parameter mismatch: Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      await fetchMe();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-200 flex font-['Inter'] selection:bg-indigo-500/30 selection:text-white overflow-hidden">
      
      {/* ── LEFT CANVAS: METRIC INSIGHTS SHIELD ── */}
      <div className="hidden lg:flex lg:w-[50%] relative items-center justify-center p-12 border-r border-slate-900 bg-[#050811]">
        <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
        
        <div className="max-w-xl relative z-10 w-full space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase font-bold tracking-widest">
              Infrastructure Node v2.0
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              Deploy alias routes, <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">scale tracking clusters.</span>
            </h2>
          </div>

          {/* Terminal Component */}
          <div className="w-full bg-[#070b14] border border-slate-900 rounded-2xl p-5 shadow-2xl space-y-4 font-mono text-xs text-slate-400">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <span>snaplink-registry-cluster</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-slate-500">{"// Awaiting deployment signature synchronization..."}</p>
              <p><span className="text-purple-400">🌐 WAN</span> Target: cluster-node-01 <span className="text-slate-600">ready</span></p>
              <p><span className="text-pink-400">📊 Stats Matrix:</span> Engine allocations isolated [100% Free]</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT CANVAS: HIGH-CONTRAST FORM WRAPPER ── */}
      <div className="w-full lg:w-[50%] flex flex-col justify-between p-6 sm:p-10 md:p-12 relative bg-[#04060a] overflow-y-auto">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between z-10 shrink-0 mb-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Snap<span className="text-indigo-400">Link</span></span>
          </div>

          <button 
            onClick={() => navigate("/login")}
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg"
          >
            Sign in
          </button>
        </div>

        {/* Central Auth Surface Card (Fixed Contrast) */}
        <div className="my-auto max-w-md w-full mx-auto z-10 py-8 px-6 sm:px-8 bg-[#0c101b] border border-slate-900 rounded-2xl shadow-xl shadow-black/40">
          <div className="space-y-1.5 mb-6 text-left">
            <h1 className="text-xl font-bold text-white tracking-tight">Provision Identity Cluster</h1>
            <p className="text-slate-400 text-xs font-medium">Create a localized platform environment node config.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium animate-scale-in">
              <svg className="w-4 h-4 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Social Google Action */}
          <button
            id="google-register-btn"
            type="button"
            onClick={handleGoogleRegister}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-[#111726] hover:bg-[#161e33] border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold rounded-xl transition-all text-xs tracking-wide disabled:opacity-40 shadow-sm"
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
            <span>Sign up with Google</span>
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-[1px] bg-slate-800" />
            <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">Or Registry Configuration</span>
            <div className="flex-1 h-[1px] bg-slate-800" />
          </div>

          {/* Secure Form Registration Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField id="reg-name" type="text" name="name" value={form.name} placeholder="Full Name" onChange={handleChange}
                icon={<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              />
              <InputField id="reg-username" type="text" name="username" value={form.username} placeholder="Username hash" onChange={handleChange}
                icon={<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
              />
            </div>
            
            <InputField id="reg-email" type="email" name="email" value={form.email} placeholder="System email address" onChange={handleChange}
              icon={<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
            />
            
            <div>
              <InputField id="reg-password" type="password" name="password" value={form.password} placeholder="Cluster deployment password" onChange={handleChange}
                icon={<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              />
              <PasswordStrength password={form.password} />
            </div>
            
            <InputField id="reg-confirm-password" type="password" name="confirmPassword" value={form.confirmPassword} placeholder="Confirm configuration password" onChange={handleChange}
              icon={<svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
            />

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl transition-all text-sm shadow-md shadow-purple-500/10 active:scale-[0.99] disabled:opacity-40 select-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Compiling Engine Environment...
                </span>
              ) : "Initialize Platform Node"}
            </button>
          </form>
          
          <p className="text-center text-slate-400 text-xs mt-5">
            Already authenticated?{" "}
            <button onClick={() => navigate("/login")} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in to Node
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium tracking-wide z-10 border-t border-slate-900 pt-4 shrink-0 mt-6">
          <span>Protected Node Environment</span>
          <div className="flex gap-4">
            <span>🛡️ TLS v1.3 Secured</span>
            <span>📊 Edge Telemetry</span>
          </div>
        </div>

      </div>
    </div>
  );
}