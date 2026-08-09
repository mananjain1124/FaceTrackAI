import { useQuery } from "@tanstack/react-query";

import HeroSection from "@/components/dashboard/HeroSection";
import DashboardStats from "@/components/dashboard/DashboardStats";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import RecentAttendance from "@/components/dashboard/RecentAttendance";
import DepartmentChart from "@/components/dashboard/DepartmentChart";
import SystemHealth from "@/components/dashboard/SystemHealth";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import QuickActions from "@/components/dashboard/QuickActions";

import { getDashboardStats } from "@/services/statsService";
import { getSettings } from "@/services/settingsService";

export default function Dashboard() {
  const { data } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  return (
    <div className="space-y-6">
      <HeroSection
        presentRate={data?.present_rate ?? 0}
        orgName={settings?.organization_name || "Administrator"}
        totalEmployees={data?.total_employees ?? 0}
        presentToday={data?.present_today ?? 0}
      />

      <DashboardStats
        totalEmployees={data?.total_employees ?? 0}
        presentToday={data?.present_today ?? 0}
        notMarkedToday={data?.not_marked_today ?? 0}
        presentRate={data?.present_rate ?? 0}
        distinctPresentToday={data?.distinct_present_today ?? 0}
        departmentCount={data?.department_distribution?.length ?? 0}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AttendanceChart weeklyTrend={data?.weekly_trend ?? []} />
        </div>

        <NotificationPanel />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentAttendance records={data?.recent_attendance ?? []} />
        </div>

        <QuickActions />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DepartmentChart
          departmentDistribution={data?.department_distribution ?? []}
          totalEmployees={data?.total_employees ?? 0}
        />

        <SystemHealth
          presentRate={data?.present_rate ?? 0}
          totalEmployees={data?.total_employees ?? 0}
          presentToday={data?.present_today ?? 0}
        />
      </div>
    </div>
  );
}
