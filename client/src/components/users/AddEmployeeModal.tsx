import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, CheckCircle } from "lucide-react";

import FaceCapture from "@/features/camera/components/FaceCapture";
import { registerEmployee } from "@/services/employeeService";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY_EMPLOYEE = {
  id: "",
  name: "",
  email: "",
  phone: "",
  department: "IT",
  position: "",
};

export default function AddEmployeeModal({ open, onClose }: Props) {
  const [step, setStep] = useState(1);

  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const [employee, setEmployee] = useState(EMPTY_EMPLOYEE);

  useEffect(() => {
    if (open) {
      setStep(1);
      setCapturedImages([]);
      setEmployee(EMPTY_EMPLOYEE);
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setEmployee({
      ...employee,

      [e.target.name]: e.target.value,
    });
  };
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const result = await registerEmployee(employee, capturedImages);

      console.log(result);

      toast.success("Employee Registered Successfully!");

      onClose();
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureComplete = useCallback((images: string[]) => {
    setCapturedImages(images);
  }, []);

  if (!open) return null;
  return (
    <div
      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
      backdrop-blur-sm
    "
    >
      <div
        className="
        w-full
        max-w-6xl
        h-[850px]
        rounded-3xl
        bg-white
        shadow-2xl
        flex
        flex-col
        overflow-hidden
      "
      >
        {/* Header */}

        <div
          className="
          flex
          items-center
          justify-between
          border-b
          p-6
        "
        >
          <div>
            <h2
              className="
              text-3xl
              font-bold
            "
            >
              Register Employee
            </h2>

            <p
              className="
              mt-1
              text-slate-500
            "
            >
              Employee Details & Face Registration
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl
              p-2
              hover:bg-slate-100
            "
          >
            <X />
          </button>
        </div>

        {/* Progress */}

        <div
          className="
          flex
          items-center
          justify-center
          gap-4
          border-b
          p-5
        "
        >
          <div
            className={`
              h-10
              w-10
              rounded-full
              flex
              items-center
              justify-center
              font-bold
              ${step >= 1 ? "bg-blue-600 text-white" : "bg-slate-200"}
            `}
          >
            1
          </div>

          <div
            className="
            h-1
            w-28
            rounded-full
            bg-slate-300
          "
          />

          <div
            className={`
              h-10
              w-10
              rounded-full
              flex
              items-center
              justify-center
              font-bold
              ${step >= 2 ? "bg-blue-600 text-white" : "bg-slate-200"}
            `}
          >
            2
          </div>
        </div>

        {/* Body */}

        <div
          className="
             p-8
             flex-1
             overflow-hidden
             "
        >
          {/* STEP 1 */}

          {step === 1 && (
            <div
              className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
            >
              <Input
                label="Employee ID"
                name="id"
                value={employee.id}
                onChange={handleChange}
              />

              <Input
                label="Full Name"
                name="name"
                value={employee.name}
                onChange={handleChange}
              />

              <Input
                label="Email"
                name="email"
                value={employee.email}
                onChange={handleChange}
              />

              <Input
                label="Phone"
                name="phone"
                value={employee.phone}
                onChange={handleChange}
              />

              <div>
                <label className="font-medium">Department</label>

                <select
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  p-3
                "
                >
                  <option>IT</option>

                  <option>HR</option>

                  <option>Finance</option>

                  <option>Security</option>

                  <option>Administration</option>
                </select>
              </div>

              <Input
                label="Position"
                name="position"
                value={employee.position}
                onChange={handleChange}
              />
            </div>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <div
              className="
            grid
            grid-cols-1
            xl:grid-cols-3
            gap-8
            h-full
          "
            >
              {/* Face Capture */}

              <div
                className="
              xl:col-span-2
              h-full
            "
              >
                <FaceCapture
                  onComplete={handleCaptureComplete}
                />
              </div>

              {/* Preview */}

              <div
                className="
h-full
flex
flex-col
"
              >
                <h3
                  className="
text-xl
font-bold
mb-4
"
                >
                  Face Samples
                </h3>

                <div
                  className="
grid
grid-cols-3
gap-3
flex-1
content-start
overflow-hidden
"
                >
                  {capturedImages.map((img, index) => (
                    <div
                      key={index}
                      className="
relative
overflow-hidden
rounded-xl
"
                    >
                      <img
                        src={img}
                        alt={`face-${index}`}
                        className="
h-28
w-full
rounded-xl
border
object-cover
transition
duration-300
hover:scale-105
"
                      />

                      <div
                        className="
absolute
bottom-1
right-1
rounded-full
bg-blue-600
px-2
text-xs
text-white
"
                      >
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="
                mt-6
                rounded-2xl
                bg-green-50
                p-5
              "
                >
                  <div
                    className="
                  flex
                  items-center
                  gap-3
                "
                  >
                    <CheckCircle
                      className="
                    text-green-600
                    "
                    />

                    <div>
                      <p className="font-semibold">Images Captured</p>

                      <p className="text-green-700">
                        {capturedImages.length}/15 Images
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}

        <div
          className="
          flex
          items-center
          justify-between
          border-t
          bg-slate-50
          px-8
          py-5
          shrink-0
        "
        >
          {step === 1 ? (
            <button
              onClick={onClose}
              className="
              rounded-xl
              border
              px-6
              py-3
            "
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="
              rounded-xl
              border
              px-6
              py-3
            "
            >
              ← Back
            </button>
          )}

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={
                !employee.id ||
                !employee.name ||
                !employee.email ||
                !employee.phone ||
                !employee.position
              }
              className={`
rounded-xl
px-8
py-3
font-semibold
text-white

${
  employee.id &&
  employee.name &&
  employee.email &&
  employee.phone &&
  employee.position
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-slate-400 cursor-not-allowed"
}

`}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleRegister}
              disabled={loading || capturedImages.length < 15}
              className={`rounded-xl px-8 py-3 font-semibold text-white transition
    ${
      loading
        ? "bg-gray-500 cursor-wait"
        : capturedImages.length >= 15
          ? "bg-green-600 hover:bg-green-700"
          : "bg-slate-400 cursor-not-allowed"
    }`}
            >
              {loading ? "Registering..." : "Register Employee"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Input({
  label,

  ...props
}: InputProps) {
  return (
    <div>
      <label
        className="
mb-2
block
font-medium
text-slate-700
"
      >
        {label}
      </label>

      <input
        {...props}
        className="
w-full
rounded-xl
border
border-slate-300
p-3
outline-none
focus:ring-2
focus:ring-blue-500
"
      />
    </div>
  );
}
