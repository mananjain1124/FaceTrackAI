import { Search, Download, UserPlus } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

export default function UsersToolbar({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
}: Props) {
  return (
    <div className="bg-white rounded-3xl border shadow-sm p-5">

      <div className="flex flex-col xl:flex-row gap-4 justify-between">

        <div className="flex flex-col md:flex-row gap-4 flex-1">

          <div className="relative flex-1">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="w-full border rounded-xl py-3 pl-11 pr-4"
            />

          </div>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option>All</option>
            <option>IT</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Security</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Leave</option>
          </select>

        </div>

        <div className="flex gap-3">

          <button className="flex items-center gap-2 border rounded-xl px-5 py-3">
            <Download size={18} />
            Export
          </button>

          

        </div>

      </div>

    </div>
  );
}