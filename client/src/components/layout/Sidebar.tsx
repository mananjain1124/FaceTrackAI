import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "@/lib/sidebar";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const mainItems = ["Dashboard", "Users", "Attendance", "Live Camera"];
const systemItems = ["Reports", "Analytics", "Settings", "Logout"];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-50 flex flex-col
        transition-all duration-300
        ${collapsed ? "w-20" : "w-72"}
        bg-white dark:bg-slate-900/80
        backdrop-blur-xl
        border-r border-slate-200 dark:border-white/[0.06]
      `}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/[0.06] shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold gradient-text leading-tight">FaceTrack AI</h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 tracking-widest uppercase">Smart Attendance</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto">
            <Zap size={18} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 pb-2">
            Main
          </p>
        )}
        {sidebarItems.filter((i) => mainItems.includes(i.title)).map((item) => (
          <SidebarItem key={item.title} item={item} collapsed={collapsed} />
        ))}

        <div className={`${collapsed ? "my-3 border-t border-slate-200 dark:border-white/[0.06]" : "mt-5"}`} />

        {!collapsed && (
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 pb-2">
            System
          </p>
        )}
        {sidebarItems.filter((i) => systemItems.includes(i.title)).map((item) => (
          <SidebarItem key={item.title} item={item} collapsed={collapsed} />
        ))}
      </div>

      {/* Collapse toggle when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-3 mb-3 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all flex justify-center"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Profile */}
      <div className="shrink-0 p-3 border-t border-slate-200 dark:border-white/[0.06]">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-lg">A</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] p-3">
            <div className="flex gap-3 items-center">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white shadow-lg">A</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-blink-dot" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">Administrator</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">admin@facetrack.ai</p>
              </div>
              <div className="ml-auto shrink-0">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">Online</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}