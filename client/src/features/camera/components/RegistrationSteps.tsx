import {
  CheckCircle2,
  Circle,
  ArrowRightCircle,
} from "lucide-react";

interface Props {
  currentStep: number;
}

const steps = [
  "Detect Face",
  "Center Face",
  "Blink",
  "Turn Left",
  "Turn Right",
  "Look Up",
  "Look Down",
  "Capturing 15 Images",
  "Generating Face Embeddings",
  "Registration Complete",
];

export default function RegistrationSteps({
  currentStep,
}: Props) {
  return (
    <div className="h-full rounded-2xl border bg-white shadow-lg">

      {/* Header */}

      <div className="border-b p-5">

        <h2 className="text-xl font-bold">
          Registration Progress
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Complete every step to register a new employee.
        </p>

      </div>

      {/* Steps */}

      <div className="max-h-[520px] overflow-y-auto p-5">

        <div className="space-y-4">

          {steps.map((step, index) => {
            const number = index + 1;

            const completed = currentStep > number;

            const active = currentStep === number;

            return (
              <div
                key={step}
                className="flex items-start gap-4"
              >
                {/* Icon */}

                <div className="mt-1">

                  {completed ? (
                    <CheckCircle2
                      size={24}
                      className="text-green-500"
                    />
                  ) : active ? (
                    <ArrowRightCircle
                      size={24}
                      className="animate-pulse text-blue-600"
                    />
                  ) : (
                    <Circle
                      size={22}
                      className="text-slate-300"
                    />
                  )}

                </div>

                {/* Text */}

                <div>

                  <p
                    className={`font-semibold

                    ${
                      completed
                        ? "text-green-600"

                        : active
                        ? "text-blue-600"

                        : "text-slate-500"
                    }
                    `}
                  >
                    Step {number}
                  </p>

                  <p
                    className={`

                    ${
                      completed
                        ? "text-green-700"

                        : active
                        ? "text-slate-900"

                        : "text-slate-400"
                    }

                    `}
                  >
                    {step}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}