import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddEmployeeModal from "../AddEmployeeModal";

vi.mock("@/features/camera/components/FaceCapture", () => ({
  default: () => <div data-testid="face-capture" />,
}));

vi.mock("@/services/employeeService", () => ({
  registerEmployee: vi.fn(),
}));

function getField(labelText: string) {
  const label = screen.getByText(labelText);
  const container = label.closest("div") as HTMLElement;
  return (
    within(container).queryByRole("textbox") ??
    within(container).getByRole("combobox")
  );
}

describe("AddEmployeeModal", () => {
  const onClose = vi.fn();

  it("renders nothing when open=false", () => {
    render(<AddEmployeeModal open={false} onClose={onClose} />);
    expect(
      screen.queryByText("Register Employee")
    ).not.toBeInTheDocument();
  });

  it("renders form when open=true on step 1", () => {
    render(<AddEmployeeModal open={true} onClose={onClose} />);
    expect(screen.getByText("Register Employee")).toBeInTheDocument();
    expect(screen.getByText("Employee Details & Face Registration")).toBeInTheDocument();
  });

  it("shows Register Employee heading", () => {
    render(<AddEmployeeModal open={true} onClose={onClose} />);
    expect(
      screen.getByRole("heading", { name: "Register Employee" })
    ).toBeInTheDocument();
  });

  it("has all form fields (id, name, email, phone, department, position)", () => {
    render(<AddEmployeeModal open={true} onClose={onClose} />);
    expect(getField("Employee ID")).toBeInTheDocument();
    expect(getField("Full Name")).toBeInTheDocument();
    expect(getField("Email")).toBeInTheDocument();
    expect(getField("Phone")).toBeInTheDocument();
    expect(getField("Department")).toBeInTheDocument();
    expect(getField("Position")).toBeInTheDocument();
  });

  it("has Continue button disabled when fields are empty", () => {
    render(<AddEmployeeModal open={true} onClose={onClose} />);
    expect(
      screen.getByRole("button", { name: /continue/i })
    ).toBeDisabled();
  });

  it("resets all state when open transitions from false to true", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <AddEmployeeModal open={false} onClose={onClose} />
    );

    rerender(<AddEmployeeModal open={true} onClose={onClose} />);

    await user.type(getField("Employee ID"), "EMP001");
    await user.type(getField("Full Name"), "John Doe");

    expect(getField("Employee ID")).toHaveValue("EMP001");
    expect(getField("Full Name")).toHaveValue("John Doe");

    rerender(<AddEmployeeModal open={false} onClose={onClose} />);
    rerender(<AddEmployeeModal open={true} onClose={onClose} />);

    expect(getField("Employee ID")).toHaveValue("");
    expect(getField("Full Name")).toHaveValue("");
    expect(getField("Email")).toHaveValue("");
    expect(getField("Phone")).toHaveValue("");
    expect(getField("Position")).toHaveValue("");
  });

  it("shows FaceCapture on step 2", async () => {
    const user = userEvent.setup();
    render(<AddEmployeeModal open={true} onClose={onClose} />);

    await user.type(getField("Employee ID"), "EMP001");
    await user.type(getField("Full Name"), "John Doe");
    await user.type(getField("Email"), "john@example.com");
    await user.type(getField("Phone"), "1234567890");
    await user.type(getField("Position"), "Engineer");

    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByTestId("face-capture")).toBeInTheDocument();
  });
});
