import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-slate-100 min-h-screen">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`
          transition-all
          duration-300
          ${collapsed ? "ml-20" : "ml-72"}
        `}
      >
        <Navbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}