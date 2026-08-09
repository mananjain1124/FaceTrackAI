import { Users, UserCheck, UserX, ScanFace, Building2 } from "lucide-react";

import StatCard from "./StatCard";

interface DashboardStatsProps {
  totalEmployees: number;
  presentToday: number;
  notMarkedToday: number;
  presentRate: number;
  distinctPresentToday: number;
  departmentCount: number;
}

export default function DashboardStats({
  totalEmployees,
  presentToday,
  notMarkedToday,
  presentRate,
  distinctPresentToday,
  departmentCount,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
      <StatCard
        title="Employees"
        value={String(totalEmployees)}
        subtitle="Total registered"
        icon={Users}
        color="bg-gradient-to-br from-blue-500 to-cyan-500"
        glowColor="rgba(59,130,246,0.25)"
      />
      <StatCard
        title="Present Today"
        value={String(presentToday)}
        subtitle={`distinct: ${distinctPresentToday}`}
        icon={UserCheck}
        color="bg-gradient-to-br from-emerald-500 to-teal-500"
        glowColor="rgba(16,185,129,0.25)"
      />
      <StatCard
        title="Not Marked"
        value={String(notMarkedToday)}
        subtitle="pending scan"
        icon={UserX}
        color="bg-gradient-to-br from-red-500 to-rose-600"
        glowColor="rgba(239,68,68,0.25)"
      />
      <StatCard
        title="Present Rate"
        value={`${presentRate}%`}
        subtitle="today"
        icon={ScanFace}
        color="bg-gradient-to-br from-violet-500 to-purple-600"
        glowColor="rgba(139,92,246,0.25)"
      />
      <StatCard
        title="Departments"
        value={String(departmentCount)}
        subtitle="active"
        icon={Building2}
        color="bg-gradient-to-br from-amber-500 to-orange-500"
        glowColor="rgba(245,158,11,0.25)"
      />
    </div>
  );
}
