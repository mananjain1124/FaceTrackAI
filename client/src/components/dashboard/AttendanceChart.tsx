import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useTheme } from "@/context/ThemeContext";
import type { DayCount } from "@/types";

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-slate-500 mb-2 font-medium">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-600 dark:text-slate-300 capitalize">{p.dataKey}:</span>
            <span className="font-bold text-slate-900 dark:text-white">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

interface AttendanceChartProps {
  weeklyTrend: DayCount[];
}

export default function AttendanceChart({ weeklyTrend }: AttendanceChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const data = weeklyTrend.map((item) => ({
    day: new Date(item.date).toLocaleDateString("en", { weekday: "short" }),
    present: item.present,
  }));

  const maxPresent = Math.max(1, ...data.map((d) => d.present));

  return (
    <div className="glass-card rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Weekly Attendance</h2>
          <p className="text-xs text-slate-500 mt-0.5">Attendance this week</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full bg-blue-500 inline-block" />Attendance</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDark ? 0.3 : 0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(148,163,184,0.07)" : "rgba(0,0,0,0.05)"} vertical={false} />
          <XAxis dataKey="day" tick={{ fill: isDark ? "#64748b" : "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: isDark ? "#64748b" : "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, maxPresent * 1.2]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: isDark ? "rgba(148,163,184,0.1)" : "rgba(0,0,0,0.05)" }} />
          <Area type="monotone" dataKey="present" stroke="#3b82f6" strokeWidth={2.5} fill="url(#attendanceFill)"
            dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: isDark ? "#1e3a8a" : "#eff6ff" }}
            activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: isDark ? "#1e3a8a" : "#eff6ff" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
