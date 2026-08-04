import { Eye, EyeOff, Lock, Mail, ArrowRight, BrainCircuit } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden bg-slate-950">

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full animate-float"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full animate-float"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)" }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="glass-card rounded-3xl p-8 border border-white/[0.08]">

          {/* Face-scan SVG ring */}
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Outer spinning ring */}
              <svg
                className="absolute inset-0 w-24 h-24 animate-spin-slow"
                viewBox="0 0 96 96"
              >
                <circle
                  cx="48" cy="48" r="44"
                  fill="none"
                  stroke="url(#ringGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="60 220"
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner reverse ring */}
              <svg
                className="absolute inset-0 w-24 h-24 animate-spin-reverse"
                viewBox="0 0 96 96"
              >
                <circle
                  cx="48" cy="48" r="36"
                  fill="none"
                  stroke="url(#ringGrad2)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="30 196"
                />
                <defs>
                  <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-blue-500/40">
                <BrainCircuit size={26} className="text-white" />
              </div>
            </div>
          </div>

          {/* Headings */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text">FaceTrack AI</h1>
            <p className="text-slate-500 text-sm mt-1.5">Smart Face Recognition Attendance</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email
              </label>
              <div className="relative mt-2">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  placeholder="admin@facetrack.ai"
                  defaultValue="admin@facetrack.ai"
                  className="
                    w-full rounded-xl
                    bg-white/[0.04] border border-white/[0.08]
                    text-slate-200 placeholder:text-slate-600
                    pl-10 pr-4 py-3 text-sm
                    outline-none
                    focus:border-blue-500/60 focus:bg-blue-500/5
                    transition-all duration-200
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-2">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="
                    w-full rounded-xl
                    bg-white/[0.04] border border-white/[0.08]
                    text-slate-200 placeholder:text-slate-600
                    pl-10 pr-12 py-3 text-sm
                    outline-none
                    focus:border-blue-500/60 focus:bg-blue-500/5
                    transition-all duration-200
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-white/20 bg-white/[0.04] flex items-center justify-center">
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                  Remember me
                </span>
              </label>
              <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full rounded-xl py-3 text-sm font-semibold text-white
                bg-gradient-to-r from-blue-600 to-violet-600
                hover:from-blue-500 hover:to-violet-500
                shadow-lg shadow-blue-500/30
                hover:shadow-blue-500/50
                transition-all duration-200
                hover:scale-[1.02] active:scale-[0.98]
                flex items-center justify-center gap-2
                disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
              "
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-[11px] text-slate-700">
            Protected by AI face recognition · v2.0.0
          </p>
        </div>

        {/* Glowing underlay */}
        <div
          className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-20 pointer-events-none"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
        />
      </div>
    </div>
  );
}