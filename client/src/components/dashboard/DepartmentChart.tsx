interface DepartmentChartProps {
  departmentDistribution: { department: string; present: number }[];
  totalEmployees: number;
}

const gradientColors = [
  { color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
  { color: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20" },
  { color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
  { color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/20" },
  { color: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
];

export default function DepartmentChart({ departmentDistribution, totalEmployees }: DepartmentChartProps) {
  const departments = departmentDistribution.map((dept, i) => ({
    name: dept.department,
    count: dept.present,
    pct: Math.round((dept.present / (totalEmployees || 1)) * 100),
    ...gradientColors[i % gradientColors.length],
  }));

  return (
    <div className="glass-card rounded-2xl p-6 card-hover">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Department Distribution</h2>
        <p className="text-xs text-slate-500 mt-0.5">{totalEmployees} employees</p>
      </div>

      <div className="space-y-5">
        {departments.map((dept) => (
          <div key={dept.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{dept.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{dept.count} emp</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white w-9 text-right">{dept.pct}%</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${dept.color} shadow-sm ${dept.shadow}`}
                style={{ width: `${dept.pct}%`, transition: "width 0.8s ease" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {departments.map((dept) => (
          <div key={dept.name} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${dept.color}`} />
            <span className="text-[11px] text-slate-500">{dept.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
