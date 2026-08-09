import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/services/api";
import {
  getEmployees,
  deleteEmployee,
  reRegisterFace,
} from "../employeeService";

vi.mock("@/services/api", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe("employeeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getEmployees calls GET /api/employees", async () => {
    const employees = [{ id: "1", name: "John Doe" }];
    mockedApi.get.mockResolvedValue({ data: employees });

    const result = await getEmployees();

    expect(mockedApi.get).toHaveBeenCalledWith("/api/employees");
    expect(result).toEqual(employees);
  });

  it("deleteEmployee calls DELETE /api/employees/<id>", async () => {
    mockedApi.delete.mockResolvedValue({ data: { message: "Deleted" } });

    const result = await deleteEmployee("emp-123");

    expect(mockedApi.delete).toHaveBeenCalledWith("/api/employees/emp-123");
    expect(result).toEqual({ message: "Deleted" });
  });

  it("reRegisterFace calls PUT /api/employees/<id>/face with images", async () => {
    const images = ["data:image/1", "data:image/2"];
    mockedApi.put.mockResolvedValue({ data: { success: true } });

    const result = await reRegisterFace("emp-123", images);

    expect(mockedApi.put).toHaveBeenCalledWith("/api/employees/emp-123/face", {
      images,
    });
    expect(result).toEqual({ success: true });
  });
});
