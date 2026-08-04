import { Bell, UserPlus, Camera, TriangleAlert, ShieldAlert, Check } from "lucide-react";

const notifications = [
  { icon: UserPlus, gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", dot: "bg-blue-500 dark:bg-blue-400", title: "New Employee Registered", desc: "Ravi Kumar has been enrolled", time: "5 min ago", unread: true },
  { icon: Camera, gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20", dot: "bg-emerald-500 dark:bg-emerald-400", title: "Attendance Recorded", desc: "12 employees checked in via Cam 2", time: "10 min ago", unread: true },
  { icon: TriangleAlert, gradient: "from-red-500 to-rose-600", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-100 dark:border-red-500/20", dot: "bg-red-500 dark:bg-red-400", title: "Unknown Face Detected", desc: "Alert triggered at East Entrance", time: "18 min ago", unread: true },
  { icon: ShieldAlert, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20", dot: "bg-amber-500 dark:bg-amber-400", title: "Spoof Attempt Blocked", desc: "AI flagged a photo-based attack", time: "35 min ago", unread: false },
];

export default function NotificationPanel() {
  return (
    <div className="glass-card rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-amber-500 dark:text-amber-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
          <span className="w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">3</span>
        </div>
        <button className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1">
          <Check size={12} /> Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`flex gap-3 p-3 rounded-xl border ${item.border} ${item.bg} hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all duration-200 relative cursor-pointer`}>
              {item.unread && (
                <span className={`absolute top-3 right-3 w-2 h-2 rounded-full ${item.dot} animate-pulse`} />
              )}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${item.gradient}`}>
                <Icon size={16} className="text-white" />
              </div>
              <div className="min-w-0 pr-4">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{item.title}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.desc}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1.5">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}