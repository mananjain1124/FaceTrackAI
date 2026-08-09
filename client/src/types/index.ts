export interface Employee {
  _id?: string;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  image_folder?: string;
  images?: string[];
  embedding_path?: string;
  created_at?: string;
}

export interface AttendanceRecord {
  _id?: string;
  employee_id: string;
  name: string;
  department: string;
  position?: string;
  date: string;
  time: string;
  status: string;
}

export interface DayCount {
  date: string;
  present: number;
}

export interface AttendanceSummary {
  success?: boolean;
  from: string;
  to: string;
  department: string;
  total_present: number;
  distinct_employees: number;
  per_day: DayCount[];
  per_department: { department: string; present: number }[];
  per_hour: { hour: number; present: number }[];
  per_employee: {
    employee_id: string;
    name: string;
    present: number;
  }[];
}

export interface Settings {
  recognition_threshold: number;
  duplicate_window_seconds: number;
  organization_name: string;
  work_start_hour: number;
  work_end_hour: number;
}

export interface DashboardStats {
  total_employees: number;
  present_today: number;
  distinct_present_today: number;
  not_marked_today: number;
  present_rate: number;
  weekly_trend: DayCount[];
  department_distribution: { department: string; present: number }[];
  recent_attendance: AttendanceRecord[];
  today: string;
}
