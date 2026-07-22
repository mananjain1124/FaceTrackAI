import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import SidebarItem from "./SidebarItem";
import { sidebarItems } from "@/lib/sidebar";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {

  return (

    <aside
      className={`
      fixed
      top-0
      left-0
      h-screen
      bg-slate-950
      border-r
      border-slate-800
      text-white
      z-50
      transition-all
      duration-300
      ${collapsed ? "w-20" : "w-72"}
      `}
    >

      {/* Logo */}

      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">

        {!collapsed && (

          <div>

            <h1 className="text-3xl font-bold text-blue-500">

              FaceTrack AI

            </h1>

            <p className="text-slate-400 text-sm">

              Smart Attendance

            </p>

          </div>

        )}

        <button

          onClick={() => setCollapsed(!collapsed)}

          className="rounded-lg p-2 hover:bg-slate-800"

        >

          {collapsed ? (
            <ChevronRight />
          ) : (
            <ChevronLeft />
          )}

        </button>

      </div>

      {/* Menu */}

      <div className="overflow-y-auto h-[calc(100vh-170px)] py-5 px-3">

        {sidebarItems.map((item) => (

          <SidebarItem

            key={item.title}

            item={item}

            collapsed={collapsed}

          />

        ))}

      </div>

      {/* Footer */}

      <div className="absolute bottom-0 left-0 w-full p-5 border-t border-slate-800">

        {collapsed ? (

          <div className="flex justify-center">

            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold">

              A

            </div>

          </div>

        ) : (

          <div className="rounded-2xl bg-slate-800 p-4">

            <div className="flex gap-3">

              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">

                A

              </div>

              <div>

                <h3 className="font-semibold">

                  Administrator

                </h3>

                <p className="text-slate-400 text-sm">

                  admin@facetrack.ai

                </p>

                <p className="text-green-400 text-sm">

                  ● Online

                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </aside>

  );
}