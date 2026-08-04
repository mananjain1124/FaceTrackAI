import {
  Users,
  UserCheck,
  UserX,
  Camera,
  ScanFace,
  ShieldCheck,
  TriangleAlert,
  UserPlus,
} from "lucide-react";

import StatCard from "./StatCard";

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
      <StatCard
        title="Employees"
        value="356"
        subtitle="+12 this month"
        icon={Users}
        color="bg-gradient-to-br from-blue-500 to-cyan-500"
        trend="up"
        glowColor="rgba(59,130,246,0.25)"
      />
      <StatCard
        title="Present"
        value="312"
        subtitle="87% rate"
        icon={UserCheck}
        color="bg-gradient-to-br from-emerald-500 to-teal-500"
        trend="up"
        glowColor="rgba(16,185,129,0.25)"
      />
      <StatCard
        title="Absent"
        value="44"
        subtitle="13% rate"
        icon={UserX}
        color="bg-gradient-to-br from-red-500 to-rose-600"
        trend="down"
        glowColor="rgba(239,68,68,0.25)"
      />
      <StatCard
        title="Cameras"
        value="6"
        subtitle="Online"
        icon={Camera}
        color="bg-gradient-to-br from-orange-500 to-amber-500"
        glowColor="rgba(249,115,22,0.25)"
      />
      <StatCard
        title="Accuracy"
        value="98.7%"
        subtitle="Recognition"
        icon={ScanFace}
        color="bg-gradient-to-br from-violet-500 to-purple-600"
        trend="up"
        glowColor="rgba(139,92,246,0.25)"
      />
      <StatCard
        title="Spoof Blocked"
        value="3"
        subtitle="Secured"
        icon={ShieldCheck}
        color="bg-gradient-to-br from-emerald-600 to-green-600"
        glowColor="rgba(5,150,105,0.25)"
      />
      <StatCard
        title="Unknown Faces"
        value="7"
        subtitle="Detected"
        icon={TriangleAlert}
        color="bg-gradient-to-br from-yellow-500 to-orange-500"
        trend="down"
        glowColor="rgba(234,179,8,0.25)"
      />
      <StatCard
        title="New Users"
        value="18"
        subtitle="This week"
        icon={UserPlus}
        color="bg-gradient-to-br from-cyan-500 to-sky-500"
        trend="up"
        glowColor="rgba(6,182,212,0.25)"
      />
    </div>
  );
}