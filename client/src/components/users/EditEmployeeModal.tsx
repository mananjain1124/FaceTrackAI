import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, ScanFace, User, Save } from "lucide-react";

import {
  updateEmployee,
  reRegisterFace,
} from "@/services/employeeService";
import FaceCapture from "@/features/camera/components/FaceCapture";
import type { Employee } from "@/types";

interface Props {
  open: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  department: "",
  position: "",
};

type Tab = "details" | "face";

const DEPARTMENTS = [
  "IT", "HR", "Finance", "Security", "Administration",
];

export default function EditEmployeeModal({
  open,
  employee,
  onClose,
  onSuccess,
}: Props) {
  const [tab, setTab] = useState<Tab>("details");
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
      });
      setTab("details");
      setCapturedImages([]);
    }
  }, [employee]);

  const handleClose = useCallback(() => {
    setCapturedImages([]);
    setTab("details");
    onClose();
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    if (!employee) return;
    setLoading(true);
    try {
      await updateEmployee(employee.employee_id, form);
      toast.success("Employee updated successfully");
      onSuccess();
      handleClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReRegisterFace = async () => {
    if (!employee) return;
    if (capturedImages.length < 15) {
      toast.error("Please capture all 15 images before saving");
      return;
    }
    setRegenerating(true);
    try {
      await reRegisterFace(employee.employee_id, capturedImages);
      toast.success("Face re-registered successfully");
      onSuccess();
      handleClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Face re-registration failed");
    } finally {
      setRegenerating(false);
    }
  };

  if (!open || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Employee</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update details or re-register the face
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X />
          </button>
        </div>

        <div className="flex border-b border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
          <button
            onClick={() => setTab("details")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              tab === "details"
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <User size={14} /> Details
          </button>
          <button
            onClick={() => setTab("face")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              tab === "face"
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <ScanFace size={14} /> Face Re-registration
          </button>
        </div>

        {tab === "details" && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Employee ID
              </label>
              <input
                value={employee.employee_id}
                disabled
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Position
                </label>
                <input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
              <button
                onClick={handleClose}
                className="rounded-xl border border-slate-200 dark:border-white/[0.08] px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={14} />
                {loading ? "Saving..." : "Save Details"}
              </button>
            </div>
          </div>
        )}

        {tab === "face" && (
          <div className="p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Re-register <span className="font-semibold text-slate-900 dark:text-white">{employee.name}</span>'s
              face by completing a new 15-image capture. This replaces the stored face data.
            </p>
            <div className="max-h-[480px] overflow-y-auto rounded-xl border border-slate-200 dark:border-white/[0.06]">
              <FaceCapture onComplete={(images) => setCapturedImages(images)} />
            </div>
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.04]">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Captured {capturedImages.length}/15 images
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="rounded-xl border border-slate-200 dark:border-white/[0.08] px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReRegisterFace}
                  disabled={regenerating || capturedImages.length < 15}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {regenerating ? "Re-registering..." : "Save New Face"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}