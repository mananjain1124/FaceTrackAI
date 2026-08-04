import { useEffect, useState } from "react";
import { Clock3, CalendarDays, BrainCircuit, BadgeCheck, TrendingUp } from "lucide-react";

export default function HeroSection() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const attendancePct = 87;
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (attendancePct / 100) * circumference;

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8 text-white animate-fade-in-up"
      style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)" }}
    >
      {/* Floating orbs */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-violet-500/15 blur-2xl animate-float pointer-events-none" style={{ animationDelay: "2s" }} />
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3 py-1 text-xs text-blue-200 tracking-widest uppercase font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI Face Recognition System
          </div>
          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Welcome Back, <span className="gradient-text">Administrator</span> 👋
          </h1>
          <p className="mt-3 max-w-xl text-blue-200/80 text-sm leading-relaxed">
            Monitor employees, attendance, live recognition, camera health and AI performance in real time.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur px-4 py-2 text-sm border border-white/10">
              <BrainCircuit size={16} className="text-cyan-300" />
              <span className="text-white/90">AI Recognition Active</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 backdrop-blur px-4 py-2 text-sm border border-emerald-500/20">
              <BadgeCheck size={16} className="text-emerald-300" />
              <span className="text-emerald-200">98.7% Accuracy</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-amber-500/20 backdrop-blur px-4 py-2 text-sm border border-amber-500/20">
              <TrendingUp size={16} className="text-amber-300" />
              <span className="text-amber-200">↑ 4.2% vs last week</span>
            </div>
          </div>
        </div>

        {/* Right cards */}
        <div className="flex gap-4 shrink-0 flex-wrap lg:flex-nowrap">
          {/* Clock */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 p-5 min-w-[200px]">
            <div className="flex items-center gap-2 text-blue-200 text-xs mb-2">
              <Clock3 size={14} />
              <span>Current Time</span>
            </div>
            <h2 className="text-3xl font-bold tabular-nums tracking-tight">{time.toLocaleTimeString()}</h2>
            <div className="mt-3 flex items-center gap-1.5 text-blue-200/70 text-xs">
              <CalendarDays size={13} />
              <span>{time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>

          {/* Attendance ring */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 p-5 flex items-center gap-5 min-w-[200px]">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#attendanceGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: "stroke-dashoffset 1s ease" }} />
                <defs>
                  <linearGradient id="attendanceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{attendancePct}%</span>
              </div>
            </div>
            <div>
              <p className="text-blue-200 text-xs mb-1">Today's Attendance</p>
              <h2 className="text-2xl font-bold">312</h2>
              <p className="text-slate-400 text-xs">of 356 employees</p>
              <p className="mt-2 text-emerald-300 text-xs font-medium">● Present today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}