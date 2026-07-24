import { useEffect, useState } from "react";
import { updateEmployee } from "@/services/employeeService";

interface Props {
  open: boolean;
  employee: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEmployeeModal({
  open,
  employee,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
      });
    }
  }, [employee]);

  if (!open || !employee) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateEmployee(
        employee.employee_id,
        form
      );

      alert("Employee Updated Successfully");

      onSuccess();

      onClose();

    } catch (err) {
      console.error(err);
      alert("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="w-full max-w-xl rounded-2xl bg-white p-6">

        <h2 className="mb-6 text-2xl font-bold">
          Edit Employee
        </h2>

        <div className="space-y-4">

          <input
            value={employee.employee_id}
            disabled
            className="w-full rounded-lg border p-3 bg-gray-100"
          />

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full rounded-lg border p-3"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-lg border p-3"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full rounded-lg border p-3"
          />

          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
            className="w-full rounded-lg border p-3"
          />

          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Position"
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            {loading ? "Updating..." : "Update Employee"}
          </button>

        </div>

      </div>

    </div>
  );
}