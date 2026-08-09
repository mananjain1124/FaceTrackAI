import api from "./api";
import type { AttendanceSummary } from "@/types";

export async function recognizeEmployee(image: string) {
  const response = await api.post(
    "/api/recognition/recognize",
    { image }
  );
  return response.data;
}

export async function getTodayAttendance(date?: string) {
  const params = date ? { date } : {};
  const response = await api.get("/api/attendance/today", { params });
  return response.data;
}

export async function getAttendanceSummary(
  from: string,
  to: string,
  department?: string
) {
  const params: Record<string, string> = { from, to };
  if (department && department !== "All") params.department = department;
  const response = await api.get("/api/attendance/summary", { params });
  return response.data as AttendanceSummary;
}
