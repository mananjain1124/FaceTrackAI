import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            FaceTrack AI
          </h1>

          <p className="text-slate-500 mt-2">
            Smart Face Recognition Attendance System
          </p>
        </div>

        <form className="space-y-5">

          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

              <input
                type="email"
                placeholder="admin@gmail.com"
                className="w-full rounded-lg border pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Password
            </label>

            <div className="relative mt-2">

              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full rounded-lg border pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>
          </div>

          <button
            className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
}