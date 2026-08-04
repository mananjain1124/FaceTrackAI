import { NavLink } from "react-router-dom";

const iconColors: Record<string, string> = {
  Dashboard:    "from-blue-500 to-cyan-500",
  Users:        "from-violet-500 to-purple-600",
  Attendance:   "from-emerald-500 to-teal-500",
  "Live Camera":"from-orange-500 to-amber-500",
  Reports:      "from-sky-500 to-blue-500",
  Analytics:    "from-pink-500 to-rose-500",
  Settings:     "from-slate-400 to-slate-500",
  Logout:       "from-red-500 to-rose-600",
};

export default function SidebarItem({ item, collapsed }: any) {
  const Icon = item.icon;
  const gradient = iconColors[item.title] ?? "from-blue-500 to-violet-500";

  return (
    <div className="relative group">
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
            isActive
              ? "bg-blue-50 dark:bg-gradient-to-r dark:from-blue-600/30 dark:to-violet-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-white shadow-sm dark:shadow-blue-900/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-slate-200"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br transition-all duration-200 ${
                isActive
                  ? gradient
                  : "from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
              }`}
            >
              <Icon
                size={16}
                className={
                  isActive
                    ? "text-white"
                    : "text-slate-500 dark:text-slate-400"
                }
              />
            </div>

            {!collapsed && (
              <span className="font-medium text-sm">{item.title}</span>
            )}

            {isActive && !collapsed && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            )}
          </>
        )}
      </NavLink>

      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
          {item.title}
        </div>
      )}
    </div>
  );
}