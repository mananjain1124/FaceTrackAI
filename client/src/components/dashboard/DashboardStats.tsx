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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8 gap-6">

      <StatCard
        title="Employees"
        value="356"
        subtitle="+12 this month"
        icon={Users}
        color="bg-blue-600"
      />

      <StatCard
        title="Present"
        value="312"
        subtitle="87%"
        icon={UserCheck}
        color="bg-green-600"
      />

      <StatCard
        title="Absent"
        value="44"
        subtitle="13%"
        icon={UserX}
        color="bg-red-500"
      />

      <StatCard
        title="Cameras"
        value="6"
        subtitle="Online"
        icon={Camera}
        color="bg-orange-500"
      />

      <StatCard
        title="Accuracy"
        value="98.7%"
        subtitle="Recognition"
        icon={ScanFace}
        color="bg-purple-600"
      />

      <StatCard
        title="Spoof Attempts"
        value="3"
        subtitle="Blocked"
        icon={ShieldCheck}
        color="bg-emerald-600"
      />

      <StatCard
        title="Unknown Faces"
        value="7"
        subtitle="Detected"
        icon={TriangleAlert}
        color="bg-yellow-500"
      />

      <StatCard
        title="New Users"
        value="18"
        subtitle="This Week"
        icon={UserPlus}
        color="bg-cyan-600"
      />

    </div>
  );
}