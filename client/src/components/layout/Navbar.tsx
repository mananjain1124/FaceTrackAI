import { Bell, Search, Camera, ChevronDown, Command } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Navbar() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.06] px-6 flex items-center justify-between transition-colors duration-300">
      {/* Left: Search + Date */}
      <div className="flex items-center gap-5">
        <div className="relative hidden md:flex items-center">
          <Search size={15} className="absolute left-3.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search employees..."
            className="
              w-72 rounded-xl
              bg-slate-100 dark:bg-white/[0.04]
              border border-slate-200 dark:border-white/[0.08]
              text-slate-800 dark:text-slate-300
              placeholder:text-slate-400 dark:placeholder:text-slate-600
              py-2.5 pl-10 pr-12 text-sm outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
              transition-all duration-200
            "
          />
          <div className="absolute right-3 flex items-center gap-1 text-slate-400 dark:text-slate-600">
            <Command size={11} />
            <span className="text-[10px]">K</span>
          </div>
        </div>
        <div className="hidden xl:block">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{today}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Camera status */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <Camera size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">6 Cameras Online</span>
        </div>

        <ThemeToggle />

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.08] transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <Bell size={18} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[10px] font-bold text-white">3</span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.08] px-3 py-2 transition-all duration-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-blue-500/20">A</div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">Administrator</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">admin@facetrack.ai</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 hidden md:block" />
        </button>
      </div>
    </header>
  );
}
