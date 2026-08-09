import api from "./api";
import type { DashboardStats } from "@/types";

export async function getDashboardStats() {
  const response = await api.get("/api/stats/dashboard");
  return response.data as DashboardStats;
}
