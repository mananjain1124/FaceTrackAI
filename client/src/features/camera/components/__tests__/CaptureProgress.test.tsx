import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CaptureProgress from "../CaptureProgress";

describe("CaptureProgress", () => {
  it("renders the progress bar with correct percentage", () => {
    render(<CaptureProgress current={5} total={10} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
    const bar = document.querySelector(".bg-gradient-to-r");
    expect(bar).toHaveStyle({ width: "50%" });
  });

  it("shows completion message when current equals total", () => {
    render(<CaptureProgress current={10} total={10} />);
    expect(
      screen.getByText(/all images captured successfully/i)
    ).toBeInTheDocument();
  });

  it("shows current/total counts", () => {
    render(<CaptureProgress current={3} total={8} />);
    expect(screen.getByText("3 / 8")).toBeInTheDocument();
  });
});
