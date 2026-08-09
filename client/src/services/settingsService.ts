import api from "./api";
import type { Settings } from "@/types";

export async function getSettings() {
  const response = await api.get("/api/settings");
  return response.data.settings as Settings;
}

export async function updateSettings(partial: Partial<Settings>) {
  const response = await api.put("/api/settings", partial);
  return response.data.settings as Settings;
}
