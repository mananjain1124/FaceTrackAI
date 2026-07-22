import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import Users from "@/features/users/pages/Users";
import Attendance from "@/features/attendance/pages/Attendance";
import Camera from "@/features/camera/pages/Camera";
import Reports from "@/features/reports/pages/Reports";
import Analytics from "@/features/analytics/pages/Analytics";
import Settings from "@/features/settings/pages/Settings";

import DashboardLayout from "@/layouts/DashboardLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}