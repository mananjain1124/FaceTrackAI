import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarDays,
  Camera,
  BarChart3,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Users",
    icon: Users,
    path: "/users",
  },
  {
    title: "Register User",
    icon: UserPlus,
    path: "/register",
  },
  {
    title: "Attendance",
    icon: CalendarDays,
    path: "/attendance",
  },
  {
    title: "Live Camera",
    icon: Camera,
    path: "/camera",
  },
  {
    title: "Reports",
    icon: FileText,
    path: "/reports",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
  {
    title: "Logout",
    icon: LogOut,
    path: "/logout",
  },
];