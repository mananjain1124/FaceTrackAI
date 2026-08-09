import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { isAuthenticated } from "@/services/authService";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`transition-all duration-300 ${collapsed ? "ml-20" : "ml-72"}`}>
        <Navbar />
        <main className="p-6 min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
