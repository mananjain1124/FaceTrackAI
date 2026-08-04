import { useEffect, useState } from "react";
import {
  Search, Download, UserPlus, Pencil, Trash2, ShieldCheck,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import { getEmployees } from "@/services/employeeService";
import AddEmployeeModal from "@/components/users/AddEmployeeModal";

const deptColors: Record<string, string> = {
  Engineering: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Finance:     "bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400",
  HR:          "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Design:      "bg-pink-100 dark:bg-pink-500/15 text-pink-700 dark:text-pink-400",
  "IT Ops":    "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400",
  IT:          "bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
};

const avatarGradients = [
  "from-blue-500 to-cyan-500", "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-500", "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500", "from-cyan-500 to-sky-500",
];

export default function Users() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees();
      setEmployees(res.employees);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) setSortOrder(o => o === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const filtered = employees
    .filter(e => {
      const q = search.toLowerCase();
      return (e.name.toLowerCase().includes(q) || e.employee_id.toLowerCase().includes(q)) &&
        (department === "All" || e.department === department);
    })
    .sort((a, b) => {
      const av = String(a[sortField]).toLowerCase();
      const bv = String(b[sortField]).toLowerCase();
      return av < bv ? (sortOrder === "asc" ? -1 : 1) : av > bv ? (sortOrder === "asc" ? 1 : -1) : 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const SortIcon = ({ field }: { field: string }) =>
    sortField !== field ? null : sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />;

  const thCls = "px-5 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none";

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employee Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all registered face-recognition employees</p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-white text-sm font-semibold hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus size={16} />
          Add Employee
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl p-4 shadow-sm dark:shadow-none">
        <div className="flex flex-col xl:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or ID..."
              className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Department filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <select
              value={department}
              onChange={e => { setDepartment(e.target.value); setPage(1); }}
              className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2.5 text-sm outline-none cursor-pointer"
            >
              {["All", "Engineering", "Finance", "HR", "Design", "IT Ops", "IT"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Export */}
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all">
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading employees...</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Employees <span className="text-slate-400 dark:text-slate-500 font-normal text-sm ml-1">({filtered.length} found)</span>
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
                    <th className={thCls} onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">Employee <SortIcon field="name" /></div>
                    </th>
                    <th className={thCls} onClick={() => handleSort("employee_id")}>
                      <div className="flex items-center gap-1">ID <SortIcon field="employee_id" /></div>
                    </th>
                    <th className={thCls} onClick={() => handleSort("department")}>
                      <div className="flex items-center gap-1">Department <SortIcon field="department" /></div>
                    </th>
                    <th className={thCls} onClick={() => handleSort("position")}>
                      <div className="flex items-center gap-1">Position <SortIcon field="position" /></div>
                    </th>
                    <th className={thCls}>Face Status</th>
                    <th className="px-5 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 dark:text-slate-500">
                        <UserPlus size={36} className="mx-auto mb-3 opacity-30" />
                        No employees found
                      </td>
                    </tr>
                  ) : paginated.map((emp, i) => (
                    <tr key={emp._id} className="border-b border-slate-50 dark:border-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} shrink-0`}>
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{emp.name}</p>
                            <p className="text-xs text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-sm text-slate-600 dark:text-slate-300">{emp.employee_id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${deptColors[emp.department] ?? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{emp.position}</td>
                      <td className="px-5 py-4">
                        {emp.embedding_path ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/15 px-2.5 py-1 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                            <ShieldCheck size={12} /> Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-500/15 px-2.5 py-1 text-red-600 dark:text-red-400 text-xs font-medium">
                            ✕ Missing
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/25 flex items-center justify-center transition-all">
                            <Pencil size={14} />
                          </button>
                          <button className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/25 flex items-center justify-center transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {filtered.length === 0 ? 0 : (page-1)*rowsPerPage+1}–{Math.min(page*rowsPerPage, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] disabled:opacity-40 transition-all">
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${page === n ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md" : "border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]"}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] disabled:opacity-40 transition-all">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddEmployeeModal open={openModal} onClose={() => { setOpenModal(false); loadEmployees(); }} />
    </div>
  );
}