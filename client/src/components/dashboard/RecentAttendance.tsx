const employees = [
  { name: "John Smith", dept: "Engineering", time: "09:02 AM", status: "Present", initials: "JS", color: "from-blue-500 to-cyan-500" },
  { name: "Sarah Wilson", dept: "Design", time: "09:15 AM", status: "Present", initials: "SW", color: "from-violet-500 to-purple-600" },
  { name: "Michael Chen", dept: "Finance", time: "09:30 AM", status: "Late", initials: "MC", color: "from-orange-500 to-amber-500" },
  { name: "Emily Davis", dept: "HR", time: "—", status: "Absent", initials: "ED", color: "from-red-500 to-rose-600" },
  { name: "Ravi Kumar", dept: "IT Ops", time: "08:58 AM", status: "Present", initials: "RK", color: "from-emerald-500 to-teal-500" },
];

const statusStyle: Record<string, string> = {
  Present: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
  Late:    "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  Absent:  "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
};

export default function RecentAttendance() {
  return (
    <div className="glass-card rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Attendance</h2>
          <p className="text-xs text-slate-500 mt-0.5">Latest check-ins via face recognition</p>
        </div>
        <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
          View All →
        </button>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 pb-2 text-[10px] text-slate-500 dark:text-slate-600 font-semibold uppercase tracking-wider">
          <span>Employee</span>
          <span>Time</span>
          <span>Status</span>
        </div>

        {employees.map((emp) => (
          <div
            key={emp.name}
            className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors duration-150 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 bg-gradient-to-br ${emp.color}`}>
                {emp.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                  {emp.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-600">{emp.dept}</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">{emp.time}</span>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${statusStyle[emp.status]}`}>
              {emp.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}