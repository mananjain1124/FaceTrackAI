import {
  Bell,
  Search,
  Moon,
  Camera,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">

      <div className="flex items-center justify-between">

        {/* Left Section */}

        <div className="flex items-center gap-6">

          {/* Search */}

          <div className="relative hidden md:block">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search employees..."
              className="w-80 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

          </div>

          {/* Date */}

          <div className="hidden xl:block">

            <p className="text-sm text-slate-500">
              {today}
            </p>

          </div>

        </div>

        {/* Right Section */}

        <div className="flex items-center gap-4">

          {/* Camera Status */}

          <div className="hidden lg:flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2">

            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>

            <Camera
              size={18}
              className="text-green-600"
            />

            <span className="text-sm font-medium text-green-700">
              Cameras Online
            </span>

          </div>

          {/* Dark Mode */}

          <button className="rounded-xl bg-slate-100 p-3 hover:bg-slate-200 transition">

            <Moon size={20} />

          </button>

          {/* Notifications */}

          <button className="relative rounded-xl bg-slate-100 p-3 hover:bg-slate-200 transition">

            <Bell size={20} />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>

          </button>

          {/* Profile */}

          <div className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-100 px-3 py-2 hover:bg-slate-200 transition">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-lg">
              A
            </div>

            <div className="hidden md:block">

              <h3 className="font-semibold">
                Administrator
              </h3>

              <p className="text-xs text-slate-500">
                admin@facetrack.ai
              </p>

            </div>

            <ChevronDown
              size={18}
              className="text-slate-500"
            />

          </div>

        </div>

      </div>

    </header>
  );
}