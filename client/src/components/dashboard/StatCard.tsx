import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
  trend?: "up" | "down" | "neutral";
  glowColor?: string;
}

export default function StatCard({ title, value, subtitle, icon: Icon, color, trend = "neutral", glowColor = "rgba(59,130,246,0.2)" }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 card-hover relative overflow-hidden group">
      {/* Hover glow (dark only) */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden dark:block"
        style={{ background: glowColor }}
      />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 ${color}`}>
          {Icon && <Icon size={22} />}
        </div>
        {trend !== "neutral" && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            trend === "up" ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400"
          }`}>
            {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend === "up" ? "↑" : "↓"}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-500 font-medium uppercase tracking-wider">{title}</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{value}</h2>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}