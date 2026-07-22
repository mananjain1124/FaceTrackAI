import HeroSection from "@/components/dashboard/HeroSection";
import DashboardStats from "@/components/dashboard/DashboardStats";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import CameraPreview from "@/components/dashboard/CameraPreview";
import CameraStatus from "@/components/dashboard/CameraStatus";
import RecentAttendance from "@/components/dashboard/RecentAttendance";
import DepartmentChart from "@/components/dashboard/DepartmentChart";
import SystemHealth from "@/components/dashboard/SystemHealth";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import QuickActions from "@/components/dashboard/QuickActions";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <HeroSection />

      <DashboardStats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AttendanceChart />
        </div>

        <CameraPreview />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentAttendance />
        </div>

        <NotificationPanel />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DepartmentChart />

        <SystemHealth />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CameraStatus />

        <QuickActions />
      </div>
    </div>
  );
}