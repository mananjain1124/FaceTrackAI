import { useMemo, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  CircleCheck,
  CircleX,
  Pencil,
  Trash2,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  status: string;
  email: string;
}

interface Props {
  employees: Employee[];
}

type SortField =
  | "name"
  | "id"
  | "department"
  | "position"
  | "status";

type SortOrder = "asc" | "desc";

export default function EmployeeTable({
  employees,
}: Props) {

  /* -------------------- Selection -------------------- */

  const [selected, setSelected] = useState<string[]>([]);

  /* -------------------- Sorting -------------------- */

  const [sortField, setSortField] =
    useState<SortField>("name");

  const [sortOrder, setSortOrder] =
    useState<SortOrder>("asc");

  /* -------------------- Pagination -------------------- */

  const [page, setPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  /* -------------------- Select All -------------------- */

  const toggleAll = () => {

    if (selected.length === employees.length) {

      setSelected([]);

    } else {

      setSelected(
        employees.map((emp) => emp.id)
      );

    }

  };

  const toggleRow = (id: string) => {

    if (selected.includes(id)) {

      setSelected(
        selected.filter((x) => x !== id)
      );

    } else {

      setSelected([...selected, id]);

    }

  };

  /* -------------------- Sorting Logic -------------------- */

  const handleSort = (field: SortField) => {

    if (sortField === field) {

      setSortOrder(
        sortOrder === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortField(field);

      setSortOrder("asc");

    }

  };

  const sortedEmployees = useMemo(() => {

    return [...employees].sort((a, b) => {

      const first = String(
        a[sortField]
      ).toLowerCase();

      const second = String(
        b[sortField]
      ).toLowerCase();

      if (first < second)
        return sortOrder === "asc"
          ? -1
          : 1;

      if (first > second)
        return sortOrder === "asc"
          ? 1
          : -1;

      return 0;

    });

  }, [employees, sortField, sortOrder]);

  /* -------------------- Pagination -------------------- */

  const totalPages = Math.ceil(
    sortedEmployees.length / rowsPerPage
  );

  const startIndex =
    (page - 1) * rowsPerPage;

  const endIndex =
    startIndex + rowsPerPage;

  const currentEmployees =
    sortedEmployees.slice(
      startIndex,
      endIndex
    );

  const showingFrom =
    sortedEmployees.length === 0
      ? 0
      : startIndex + 1;

  const showingTo = Math.min(
    endIndex,
    sortedEmployees.length
  );

  /* -------------------- Header -------------------- */

  const SortIcon = ({
    field,
  }: {
    field: SortField;
  }) => {

    if (sortField !== field)
      return null;

    return sortOrder === "asc" ? (
      <ArrowUp size={16} />
    ) : (
      <ArrowDown size={16} />
    );

  };

  return (

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-5 border-b">

        <div>

          <h2 className="text-2xl font-bold">
            Employees
          </h2>

          <p className="text-slate-500">
            {sortedEmployees.length} Employees Found
          </p>

        </div>

        {selected.length > 0 && (

          <div className="mt-3 md:mt-0 rounded-xl bg-blue-100 px-4 py-2 text-blue-700 font-semibold">

            {selected.length} Selected

          </div>

        )}

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-5 py-4">

                <input
                  type="checkbox"
                  checked={
                    selected.length === employees.length &&
                    employees.length > 0
                  }
                  onChange={toggleAll}
                  className="w-4 h-4"
                />

              </th>

              <th
                onClick={() => handleSort("name")}
                className="cursor-pointer px-6 py-4 text-left font-semibold"
              >

                <div className="flex items-center gap-2">

                  Employee

                  <SortIcon field="name" />

                </div>

              </th>

              <th
                onClick={() => handleSort("id")}
                className="cursor-pointer px-6 py-4 text-left font-semibold"
              >

                <div className="flex items-center gap-2">

                  ID

                  <SortIcon field="id" />

                </div>

              </th>

              <th
                onClick={() => handleSort("department")}
                className="cursor-pointer px-6 py-4 text-left font-semibold"
              >

                <div className="flex items-center gap-2">

                  Department

                  <SortIcon field="department" />

                </div>

              </th>

              <th
                onClick={() => handleSort("position")}
                className="cursor-pointer px-6 py-4 text-left font-semibold"
              >

                <div className="flex items-center gap-2">

                  Position

                  <SortIcon field="position" />

                </div>

              </th>

              <th
                onClick={() => handleSort("status")}
                className="cursor-pointer px-6 py-4 text-left font-semibold"
              >

                <div className="flex items-center gap-2">

                  Status

                  <SortIcon field="status" />

                </div>

              </th>

              <th className="px-6 py-4 text-center font-semibold">

                Actions

              </th>

            </tr>

          </thead>

          <tbody>

            {currentEmployees.length === 0 ? (

              <tr>

                <td
                  colSpan={7}
                  className="py-12 text-center text-slate-500"
                >

                  No Employees Found

                </td>

              </tr>

            ) : (

              currentEmployees.map((emp) => (

                <tr
                  key={emp.id}
                  className="border-t hover:bg-slate-50 transition"
                >

                  <td className="px-5">

                    <input
                      type="checkbox"
                      checked={selected.includes(emp.id)}
                      onChange={() => toggleRow(emp.id)}
                      className="w-4 h-4"
                    />

                  </td>

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-4">

                      <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                        {emp.name.charAt(0)}

                      </div>

                      <div>

                        <p className="font-semibold">

                          {emp.name}

                        </p>

                        <p className="text-sm text-slate-500">

                          {emp.email}

                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="font-medium">

                    {emp.id}

                  </td>

                  <td>

                    {emp.department}

                  </td>

                  <td>

                    {emp.position}

                  </td>

                  <td>

                    {emp.status === "Active" && (

                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-green-700">

                        <CircleCheck size={15} />

                        Active

                      </span>

                    )}

                    {emp.status === "Inactive" && (

                      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-red-700">

                        <CircleX size={15} />

                        Inactive

                      </span>

                    )}

                    {emp.status === "Leave" && (

                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">

                        Leave

                      </span>

                    )}

                  </td>

                  <td>

                    <div className="flex justify-center gap-2">

                      <button className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-600 hover:text-white transition">

                        <Pencil size={18} />

                      </button>

                      <button className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-600 hover:text-white transition">

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

            {/* Footer */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t bg-slate-50 px-6 py-4">

        {/* Showing */}

        <div className="text-sm text-slate-600">

          Showing

          <span className="font-semibold mx-1">
            {showingFrom}
          </span>

          -

          <span className="font-semibold mx-1">
            {showingTo}
          </span>

          of

          <span className="font-semibold mx-1">
            {sortedEmployees.length}
          </span>

          employees

        </div>

        {/* Controls */}

        <div className="flex flex-wrap items-center gap-4">

          {/* Rows Per Page */}

          <div className="flex items-center gap-2">

            <span className="text-sm text-slate-600">

              Rows

            </span>

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border px-3 py-2"
            >

              <option value={5}>5</option>

              <option value={10}>10</option>

              <option value={25}>25</option>

              <option value={50}>50</option>

            </select>

          </div>

          {/* Previous */}

          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-4 py-2 disabled:opacity-40 hover:bg-slate-100"
          >

            Previous

          </button>

          {/* Page Numbers */}

          <div className="flex gap-2">

            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((number) => (

              <button
                key={number}
                onClick={() => setPage(number)}
                className={`h-10 w-10 rounded-lg transition ${
                  page === number
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-slate-100"
                }`}
              >

                {number}

              </button>

            ))}

          </div>

          {/* Next */}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-4 py-2 disabled:opacity-40 hover:bg-slate-100"
          >

            Next

          </button>

        </div>

      </div>

    </div>

  );

}
    