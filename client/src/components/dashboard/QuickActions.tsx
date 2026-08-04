import { Download, Camera, UserPlus, FileText, ArrowRight } from "lucide-react";

const actions = [
  { icon: UserPlus, label: "Add User", desc: "Enroll new employee", gradient: "from-blue-500 to-cyan-500", glow: "shadow-blue-500/30", hover: "hover:shadow-blue-500/40" },
  { icon: Camera, label: "Start Camera", desc: "Launch live feed", gradient: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/30", hover: "hover:shadow-emerald-500/40" },
  { icon: Download, label: "Export Data", desc: "Download CSV / XLSX", gradient: "from-violet-500 to-purple-600", glow: "shadow-violet-500/30", hover: "hover:shadow-violet-500/40" },
  { icon: FileText, label: "Reports", desc: "View analytics", gradient: "from-orange-500 to-amber-500", glow: "shadow-amber-500/30", hover: "hover:shadow-amber-500/40" },
];

export default function QuickActions() {
  return (
    <div className="glass-card rounded-2xl p-6 card-hover">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
        <p className="text-xs text-slate-500 mt-0.5">Frequently used operations</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={`group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/[0.15] shadow-sm hover:shadow-md dark:shadow-lg ${action.glow} ${action.hover}`}
            >
              <div className={`absolute -top-3 -right-3 w-16 h-16 rounded-full blur-xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-60 transition-opacity duration-300 bg-gradient-to-br ${action.gradient}`} />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${action.gradient} shadow-md dark:shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{action.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{action.desc}</p>
              <ArrowRight size={14} className="absolute bottom-4 right-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-200" />
            </button>
          );
        })}
      </div>
    </div>
  );
}