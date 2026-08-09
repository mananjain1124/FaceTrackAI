import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FaceStatus from "../FaceStatus";

const baseProps = {
  quality: { centered: false, tooClose: false, tooFar: false },
  instruction: "",
  headPose: "CENTER" as "CENTER" | "LEFT" | "RIGHT" | "UP" | "DOWN",
  blinked: false,
};

describe("FaceStatus", () => {
  it("renders Detect Face title for step 1", () => {
    render(<FaceStatus currentStep={1} {...baseProps} />);
    expect(screen.getByText("Detect Face")).toBeInTheDocument();
  });

  it("renders Blink title for step 3", () => {
    render(<FaceStatus currentStep={3} {...baseProps} />);
    expect(screen.getByText("Blink")).toBeInTheDocument();
  });

  it("renders Capturing Images title for step 8", () => {
    render(<FaceStatus currentStep={8} {...baseProps} />);
    expect(screen.getByText("Capturing Images")).toBeInTheDocument();
  });

  it("shows instruction text when provided", () => {
    render(
      <FaceStatus
        currentStep={1}
        {...baseProps}
        instruction="Look straight at the camera"
      />
    );
    expect(screen.getByText("Look straight at the camera")).toBeInTheDocument();
  });

  it("shows headPose indicator", () => {
    render(<FaceStatus currentStep={3} {...baseProps} headPose="LEFT" />);
    expect(screen.getByText("Head: LEFT")).toBeInTheDocument();
  });

  it("shows blink detection status", () => {
    render(<FaceStatus currentStep={3} {...baseProps} blinked />);
    expect(screen.getByText("Blink detected")).toBeInTheDocument();
    render(<FaceStatus currentStep={3} {...baseProps} />);
    expect(screen.getByText("Waiting for blink")).toBeInTheDocument();
  });
});
