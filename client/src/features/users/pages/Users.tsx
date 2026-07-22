import { useState } from "react";

import UsersToolbar from "@/components/users/UsersToolbar";
import EmployeeTable from "@/components/users/EmployeeTable";
import AddEmployeeModal from "@/components/users/AddEmployeeModal";

import { employees } from "@/data/employees";

export default function Users() {
  const [search, setSearch] = useState("");

  const [department, setDepartment] = useState("All");

  const [status, setStatus] = useState("All");

  const [openModal, setOpenModal] = useState(false);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "All" || emp.department === department;

    const matchesStatus =
      status === "All" || emp.status === status;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesStatus
    );
  });

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Employee Management
          </h1>

          <p className="text-gray-500">
            Manage all registered employees
          </p>

        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"
        >
          + Add Employee
        </button>

      </div>

      {/* Toolbar */}

      <UsersToolbar
        search={search}
        setSearch={setSearch}
        department={department}
        setDepartment={setDepartment}
        status={status}
        setStatus={setStatus}
      />

      {/* Table */}

      <EmployeeTable employees={filteredEmployees} />

      {/* Modal */}

      <AddEmployeeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

    </div>
  );
}