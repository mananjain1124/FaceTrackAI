import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/services/api";
import { getSettings, updateSettings } from "../settingsService";

vi.mock("@/services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe("settingsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getSettings calls GET /api/settings and returns settings object", async () => {
    const settings = {
      recognition_threshold: 0.5,
      duplicate_window_seconds: 5,
      organization_name: "Test Org",
      work_start_hour: 9,
      work_end_hour: 18,
    };
    mockedApi.get.mockResolvedValue({ data: { settings } });

    const result = await getSettings();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/settings");
    expect(result).toEqual(settings);
  });

  it("updateSettings calls PUT /api/settings with partial data", async () => {
    const partial = { organization_name: "New Org" };
    const settings = { ...partial };
    mockedApi.put.mockResolvedValue({ data: { settings } });

    const result = await updateSettings(partial);

    expect(mockedApi.put).toHaveBeenCalledWith("/api/settings", partial);
    expect(result).toEqual(settings);
  });
});
