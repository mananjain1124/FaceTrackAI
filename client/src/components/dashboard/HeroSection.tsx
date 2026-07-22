import { useEffect, useState } from "react";
import {
  Clock3,
  CalendarDays,
  BrainCircuit,
  BadgeCheck,
} from "lucide-react";

export default function HeroSection() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-xl">

      {/* Background Blur Circles */}

      <div className="absolute -right-16 -top-16 h-60 w-60 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cyan-400/10 blur-2xl"></div>

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div>

          <p className="text-blue-100 text-sm tracking-widest uppercase">
            AI Face Recognition System
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Welcome Back, Administrator 👋
          </h1>

          <p className="mt-4 max-w-2xl text-blue-100">
            Monitor employees, attendance, live recognition,
            camera health and AI performance in real time.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">

            <div className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 backdrop-blur">

              <BrainCircuit size={18} />

              <span>AI Recognition Active</span>

            </div>

            <div className="flex items-center gap-2 rounded-xl bg-green-500/20 px-4 py-2 backdrop-blur">

              <BadgeCheck size={18} />

              <span>98.7% Accuracy</span>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="rounded-3xl bg-white/15 p-6 backdrop-blur-lg min-w-[280px]">

          <div className="flex items-center gap-2 text-blue-100">

            <Clock3 size={18} />

            <span>Current Time</span>

          </div>

          <h2 className="mt-3 text-4xl font-bold">

            {time.toLocaleTimeString()}

          </h2>

          <div className="mt-6 flex items-center gap-2 text-blue-100">

            <CalendarDays size={18} />

            <span>

              {time.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}

            </span>

          </div>

          <div className="mt-8 rounded-2xl bg-white/10 p-4">

            <p className="text-sm text-blue-100">
              Today's Attendance
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              312 / 356
            </h2>

            <div className="mt-2 h-2 rounded-full bg-white/20">

              <div className="h-2 w-[87%] rounded-full bg-green-400"></div>

            </div>

            <p className="mt-2 text-green-300">
              87% Employees Present
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}