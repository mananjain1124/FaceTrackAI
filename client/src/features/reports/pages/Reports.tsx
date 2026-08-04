import { useState } from "react";
import { Download, FileText, Calendar, Filter, Search, Eye, ArrowUpDown } from "lucide-react";

const reports = [
  { id: "RPT-001", name: "Daily Attendance Summary", date: "2026-08-04", type: "Daily",   status: "Ready",    records: 356, dept: "All" },
  { id: "RPT-002", name: "Weekly Attendance Report", date: "2026-08-02", type: "Weekly",  status: "Ready",    records: 1820, dept: "All" },
  { id: "RPT-003", name: "Engineering Department",   date: "2026-08-01", type: "Dept",    status: "Ready",    records: 160, dept: "Engineering" },
  { id: "RPT-004", name: "Unknown Faces Log",        date: "2026-08-04", type: "Security",status: "Ready",    records: 7,   dept: "All" },
  { id: "RPT-005", name: "Monthly Summary – July",   date: "2026-07-31", type: "Monthly", status: "Ready",    records: 7210, dept: "All" },
  { id: "RPT-006", name: "Finance Dept Report",      date: "2026-08-03", type: "Dept",    status: "Generating",records: 78,  dept: "Finance" },
];

const typeColors: Record<string, string> = {
  Daily:    "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Weekly:   "bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Monthly:  "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Dept:     "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Security: "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400",
};

export default function Reports() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    return (r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) &&
      (typeFilter === "All" || r.type === typeFilter);
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Generate and download attendance reports</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-white text-sm font-semibold hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <FileText size={16} />
          Generate Report
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Reports",  value: reports.length,                           color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Ready",          value: reports.filter(r=>r.status==="Ready").length, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Generating",     value: reports.filter(r=>r.status==="Generating").length, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "Total Records",  value: "9.4K",                                  color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-slate-200 dark:border-white/[0.06] p-4 shadow-sm ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reports..."
              className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2.5 text-sm outline-none cursor-pointer"
            >
              {["All","Daily","Weekly","Monthly","Dept","Security"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <input type="date" className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2.5 text-sm outline-none cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Reports table */}
      <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Report History <span className="text-slate-400 dark:text-slate-500 font-normal text-sm ml-1">({filtered.length})</span>
          </h2>
          <button className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
            <ArrowUpDown size={14} /> Sort
          </button>
        </div>

        <div className="divide-y divide-slate-50 dark:divide-white/[0.04]">
          {filtered.map(report => (
            <div key={report.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{report.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColors[report.type]}`}>{report.type}</span>
                  {report.status === "Generating" && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" /> Generating
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">ID: {report.id} · {report.records.toLocaleString()} records · {report.dept}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 shrink-0">
                <Calendar size={12} />
                {new Date(report.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 flex items-center justify-center transition-all">
                  <Eye size={14} />
                </button>
                <button
                  disabled={report.status === "Generating"}
                  className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 flex items-center justify-center transition-all disabled:opacity-40"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}