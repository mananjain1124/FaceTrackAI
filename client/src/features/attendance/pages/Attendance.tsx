import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { CheckCircle, XCircle, Loader2, ScanFace, Clock, User, Building2, Briefcase, Percent } from "lucide-react";
import { recognizeEmployee } from "@/services/attendanceService";

export default function Attendance() {
  const webcamRef = useRef<Webcam>(null);
  const processingRef = useRef(false);
  const [result, setResult] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState("Waiting for face...");
  const [lastEmployee, setLastEmployee] = useState("");
  const [scanCount, setScanCount] = useState(0);

  const captureAttendance = async () => {
    if (processingRef.current || !webcamRef.current) return;
    const image = webcamRef.current.getScreenshot();
    if (!image) return;
    processingRef.current = true;
    setScanCount(c => c + 1);
    try {
      const response = await recognizeEmployee(image);
      if (!response.recognized) {
        setResult(response);
        setStatusMessage("Unknown Person Detected");
        return;
      }
      if (lastEmployee === response.employee.employee_id) return;
      setLastEmployee(response.employee.employee_id);
      setTimeout(() => setLastEmployee(""), 10000);
      setResult(response);
      setStatusMessage(
        response.already_marked
          ? `Already marked at ${response.time}`
          : `Marked successfully at ${response.time}`
      );
    } catch {
      setStatusMessage("AI Service Offline");
    } finally {
      processingRef.current = false;
    }
  };

  useEffect(() => {
    const timer = setInterval(captureAttendance, 2000);
    return () => clearInterval(timer);
  }, []);

  const isRecognized = result?.recognized;
  const isUnknown = result && !result.recognized;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Camera</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AI-powered live face recognition attendance system</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Scans Today", value: scanCount, icon: ScanFace, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Recognized", value: isRecognized ? 1 : 0, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Unknown", value: isUnknown ? 1 : 0, icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
          { label: "Accuracy", value: "98.7%", icon: Percent, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} shrink-0`}>
                <Icon size={20} className={s.color} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camera feed */}
        <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Live Camera Feed</h2>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Live Recognition</span>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-slate-900">
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored
              screenshotFormat="image/jpeg"
              className="w-full rounded-xl"
            />
            {/* HUD overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner brackets */}
              {["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2",
                "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map((cls, i) => (
                <div key={i} className={`absolute w-5 h-5 border-cyan-400/70 ${cls} rounded-sm`} />
              ))}
              {/* Scan line */}
              <div className="absolute left-0 right-0 h-[2px] animate-scan-line"
                style={{ background: "linear-gradient(90deg,transparent,rgba(6,182,212,0.6),transparent)", boxShadow: "0 0 8px rgba(6,182,212,0.4)" }} />
              {/* Bottom bar */}
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950 to-transparent flex items-end pb-2 px-3">
                <div className="flex items-center gap-2 text-xs text-cyan-400">
                  <ScanFace size={13} />
                  <span>AI Scanning @ 0.5 FPS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm dark:shadow-none">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recognition Result</h2>

          {/* Status banner */}
          <div className={`flex items-center gap-3 rounded-xl p-3 mb-5 border ${
            isRecognized
              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
              : isUnknown
              ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
              : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.06]"
          }`}>
            <Loader2 size={16} className={`animate-spin ${isRecognized ? "text-emerald-600 dark:text-emerald-400" : isUnknown ? "text-red-500 dark:text-red-400" : "text-blue-500"}`} />
            <span className={`font-semibold text-sm ${isRecognized ? "text-emerald-700 dark:text-emerald-300" : isUnknown ? "text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-300"}`}>
              {statusMessage}
            </span>
          </div>

          {/* Recognized result */}
          {isRecognized && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {result.employee.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-500" />
                    <span className="font-bold text-slate-900 dark:text-white text-lg">{result.employee.name}</span>
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Face Recognized</span>
                </div>
              </div>

              {[
                { icon: User, label: "Employee ID", value: result.employee.employee_id },
                { icon: Building2, label: "Department", value: result.employee.department },
                { icon: Briefcase, label: "Position", value: result.employee.position },
                { icon: Percent, label: "Confidence", value: `${(result.confidence * 100).toFixed(2)}%` },
                { icon: Clock, label: "Time", value: result.time },
              ].map(row => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.04]">
                    <Icon size={15} className="text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 w-24 shrink-0">{row.label}</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{row.value}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Unknown person */}
          {isUnknown && (
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center">
                <XCircle size={36} className="text-red-500" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Unknown Person</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
              </div>
            </div>
          )}

          {/* Idle */}
          {!result && (
            <div className="flex flex-col items-center py-12 gap-4 text-center">
              <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center">
                <ScanFace size={36} className="text-blue-500" />
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-sm">Position your face in front of the camera</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}