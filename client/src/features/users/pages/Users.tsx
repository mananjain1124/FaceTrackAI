import { useEffect, useState } from "react";

import UsersToolbar from "@/components/users/UsersToolbar";
import EmployeeTable from "@/components/users/EmployeeTable";
import AddEmployeeModal from "@/components/users/AddEmployeeModal";

import { getEmployees } from "@/services/employeeService";

export default function Users() {
  const [search, setSearch] = useState("");

  const [department, setDepartment] = useState("All");

  const [status, setStatus] = useState("All");

  const [openModal, setOpenModal] = useState(false);

  const [employees, setEmployees] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const response = await getEmployees();

      console.log("Employees:", response);

      setEmployees(response.employees);
    } catch (error) {
      console.error("Failed to load employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "All" || emp.department === department;

    // Status is not stored in MongoDB yet
    const matchesStatus = true;

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

      {/* Employee Table */}

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          Loading employees...
        </div>
      ) : (
        <EmployeeTable employees={filteredEmployees} />
      )}

      {/* Register Employee Modal */}

      <AddEmployeeModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          loadEmployees();
        }}
      />

    </div>
  );
}