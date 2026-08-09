import { Database, Wifi, Zap, Users, UserCheck } from "lucide-react";

interface SystemHealthProps {
  presentRate: number;
  totalEmployees: number;
  presentToday: number;
}

export default function SystemHealth({ presentRate, totalEmployees, presentToday }: SystemHealthProps) {
  const metrics = [
    { label: "Recognition Present Rate", icon: Zap, value: presentRate, unit: "%", width: Math.min(presentRate, 100), color: "from-emerald-500 to-teal-500", status: "Normal", statusColor: "text-emerald-600 dark:text-emerald-400" },
    { label: "Total Employees", icon: Users, value: totalEmployees, unit: "", width: 100, color: "from-blue-500 to-cyan-500", status: "Normal", statusColor: "text-emerald-600 dark:text-emerald-400" },
    { label: "Present Today", icon: UserCheck, value: presentToday, unit: "", width: totalEmployees > 0 ? Math.min(Math.round((presentToday / totalEmployees) * 100), 100) : 0, color: "from-violet-500 to-purple-600", status: "Normal", statusColor: "text-emerald-600 dark:text-emerald-400" },
  ];

  const services = [
    { name: "MongoDB", icon: Database, active: true },
    { name: "API Server", icon: Wifi, active: true },
    { name: "Recognition Service", icon: Zap, active: true },
    { name: "WebSocket", icon: Wifi, active: false },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 card-hover">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">System Health</h2>
        <p className="text-xs text-slate-500 mt-0.5">Real-time resource monitoring</p>
      </div>

      <div className="space-y-4 mb-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon size={13} className="text-slate-400 dark:text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{m.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium ${m.statusColor}`}>{m.status}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {m.value}{m.unit}
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${m.color}`}
                  style={{ width: `${m.width}%`, transition: "width 0.8s ease" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 dark:border-white/[0.06] pt-4">
        <p className="text-[10px] text-slate-500 dark:text-slate-600 font-semibold uppercase tracking-wider mb-3">Services</p>
        <div className="grid grid-cols-2 gap-2">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.name}
                className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] px-3 py-2"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${svc.active ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse" : "bg-red-500"}`} />
                <Icon size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate">{svc.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
