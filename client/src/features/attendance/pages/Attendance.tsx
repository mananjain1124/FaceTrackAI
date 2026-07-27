import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import { recognizeEmployee } from "@/services/attendanceService";

export default function Attendance() {
  const webcamRef = useRef<Webcam>(null);

  const processingRef = useRef(false);

  const [result, setResult] = useState<any>(null);

  const [statusMessage, setStatusMessage] =
    useState("Waiting for face...");

  const [lastEmployee, setLastEmployee] =
    useState("");

  //----------------------------------------------------
  // Capture Frame
  //----------------------------------------------------

  const captureAttendance = async () => {
    if (processingRef.current) return;

    if (!webcamRef.current) return;

    const image = webcamRef.current.getScreenshot();

    if (!image) return;

    processingRef.current = true;

    try {
      const response = await recognizeEmployee(image);

      //------------------------------------------------
      // Unknown Person
      //------------------------------------------------

      if (!response.recognized) {
        setResult(response);

        setStatusMessage("Unknown Person");

        return;
      }

      //------------------------------------------------
      // Ignore repeated recognition
      //------------------------------------------------

      if (
        lastEmployee === response.employee.employee_id
      ) {
        return;
      }

      setLastEmployee(response.employee.employee_id);

      setTimeout(() => {
        setLastEmployee("");
      }, 10000);

      setResult(response);

      //------------------------------------------------
      // Status Message
      //------------------------------------------------

      if (response.already_marked) {
        setStatusMessage(
          `Attendance already marked at ${response.time}`
        );
      } else {
        setStatusMessage(
          `Attendance marked successfully at ${response.time}`
        );
      }
    } catch (err) {
      console.error(err);

      setStatusMessage("Server Offline");
    } finally {
      processingRef.current = false;
    }
  };

  //----------------------------------------------------
  // Auto Recognition
  //----------------------------------------------------

  useEffect(() => {
    const timer = setInterval(() => {
      captureAttendance();
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  //----------------------------------------------------
  // UI
  //----------------------------------------------------

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Attendance Camera
        </h1>

        <p className="text-slate-500">
          AI Powered Face Recognition Attendance
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Camera */}

        <div className="rounded-3xl bg-white p-6 shadow-lg">

          <div className="mb-4 flex items-center gap-2">

            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>

            <span className="font-semibold text-green-600">
              Live Recognition Running
            </span>

          </div>

          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored
            screenshotFormat="image/jpeg"
            className="rounded-xl w-full"
          />

        </div>

        {/* Result */}

        <div className="rounded-3xl bg-white p-8 shadow-lg">

          <h2 className="text-2xl font-bold mb-6">
            Recognition Result
          </h2>

          <div className="mb-6 rounded-xl bg-slate-100 p-4">

            <div className="flex items-center gap-3">

              <Loader2
                size={18}
                className="animate-spin text-blue-600"
              />

              <span className="font-semibold">
                {statusMessage}
              </span>

            </div>

          </div>

          {!result && (
            <p className="text-slate-500">
              Waiting for face...
            </p>
          )}

          {result?.recognized && (
            <div className="space-y-4">

              <div className="flex items-center gap-3 text-green-600">

                <CheckCircle size={30} />

                <span className="text-2xl font-bold">
                  Face Recognized
                </span>

              </div>

              <div>
                <b>ID :</b>{" "}
                {result.employee.employee_id}
              </div>

              <div>
                <b>Name :</b>{" "}
                {result.employee.name}
              </div>

              <div>
                <b>Department :</b>{" "}
                {result.employee.department}
              </div>

              <div>
                <b>Position :</b>{" "}
                {result.employee.position}
              </div>

              <div>
                <b>Confidence :</b>{" "}
                {(result.confidence * 100).toFixed(2)}%
              </div>

            </div>
          )}

          {result && !result.recognized && (
            <div className="space-y-4">

              <div className="flex items-center gap-3 text-red-600">

                <XCircle size={30} />

                <span className="text-2xl font-bold">
                  Unknown Person
                </span>

              </div>

              <div>
                Confidence :
                {" "}
                {(result.confidence * 100).toFixed(2)}%
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}