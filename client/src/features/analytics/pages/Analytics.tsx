import { BarChart3, TrendingUp, TrendingDown, Users, ScanFace, Clock, Calendar } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

const weeklyData = [
  { day: "Mon", present: 280, absent: 40 },
  { day: "Tue", present: 295, absent: 25 },
  { day: "Wed", present: 310, absent: 10 },
  { day: "Thu", present: 300, absent: 20 },
  { day: "Fri", present: 325, absent: 15 },
  { day: "Sat", present: 260, absent: 60 },
];

const hourlyData = [
  { hour: "8AM", scans: 45 }, { hour: "9AM", scans: 120 }, { hour: "10AM", scans: 38 },
  { hour: "11AM", scans: 22 }, { hour: "12PM", scans: 15 }, { hour: "1PM", scans: 60 },
  { hour: "2PM", scans: 18 }, { hour: "5PM", scans: 95 }, { hour: "6PM", scans: 52 },
];

const deptData = [
  { name: "Engineering", value: 45, color: "#3b82f6" },
  { name: "Finance", value: 22, color: "#8b5cf6" },
  { name: "HR", value: 13, color: "#10b981" },
  { name: "Design", value: 10, color: "#ec4899" },
  { name: "IT Ops", value: 10, color: "#f59e0b" },
];

const kpis = [
  { label: "Avg. Attendance Rate", value: "87.6%", change: "+2.3%", up: true, icon: Users },
  { label: "Avg. Recognition Conf.", value: "98.7%", change: "+0.4%", up: true, icon: ScanFace },
  { label: "Peak Hours", value: "9–10 AM", change: "Most active", up: true, icon: Clock },
  { label: "This Month", value: "22 days", change: "Working days", up: true, icon: Calendar },
];

function ChartCard({ title, subtitle, children }: any) {
  return (
    <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm dark:shadow-none card-hover">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Analytics() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const axisColor = isDark ? "#475569" : "#94a3b8";
  const gridColor = isDark ? "rgba(148,163,184,0.06)" : "rgba(0,0,0,0.05)";

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deep insights into attendance patterns and AI performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                  <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kpi.up ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400"}`}>
                  {kpi.up ? <TrendingUp size={10} className="inline mr-1" /> : <TrendingDown size={10} className="inline mr-1" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{kpi.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div className="grid xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <ChartCard title="Weekly Present vs Absent" subtitle="Last 6 working days">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: "12px", color: isDark ? "#f1f5f9" : "#0f172a" }} />
                <Bar dataKey="present" name="Present" fill="#3b82f6" radius={[6,6,0,0]} />
                <Bar dataKey="absent" name="Absent" fill="#f87171" radius={[6,6,0,0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Department Distribution" subtitle="Employee breakdown">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {deptData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", color: isDark ? "#94a3b8" : "#64748b" }} />
              <Tooltip contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: "12px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <ChartCard title="Hourly Scan Volume" subtitle="Face recognition events throughout the day">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={hourlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="hourlyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={isDark ? 0.3 : 0.15} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="hour" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: "12px", color: isDark ? "#f1f5f9" : "#0f172a" }} />
            <Area type="monotone" dataKey="scans" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#hourlyFill)"
              dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 2, stroke: isDark ? "#1e1b4b" : "#ede9fe" }}
              activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Recent performance */}
      <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          <BarChart3 size={18} className="inline mr-2 text-violet-500" />AI Performance Metrics
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Recognition Accuracy", value: 98.7, color: "from-emerald-500 to-teal-500" },
            { label: "False Positive Rate", value: 1.1, color: "from-red-500 to-rose-500" },
            { label: "Spoof Detection Rate", value: 99.2, color: "from-blue-500 to-violet-500" },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">{m.label}</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{m.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
                <div className={`h-2 rounded-full bg-gradient-to-r ${m.color}`} style={{ width: `${m.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}