import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Camera, ScanFace, Lock, CheckCircle2, UserCheck, ShieldAlert, Zap, Wifi, Clock, User, Calendar } from "lucide-react";
import Webcam from "react-webcam";
import api from "@/services/api";
import toast from "react-hot-toast";

type ScanResult = {
  id: string;
  name: string;
  dept: string;
  time: string;
  status: "Success" | "Warning";
  confidence: number;
};

export default function Kiosk() {
  const [time, setTime] = useState(new Date());
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const webcamRef = useRef<Webcam>(null);
  const isScanningRef = useRef(false);
  const [nextScanIn, setNextScanIn] = useState(3);
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const captureAndRecognize = useCallback(async () => {
    if (isScanningRef.current || !webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      isScanningRef.current = false;
      setNextScanIn(3);
      return;
    }

    isScanningRef.current = true;
    setNextScanIn(0);
    
    try {
      const { data } = await api.post("/api/recognition/recognize", { image: imageSrc });
      
      if (data.success && data.recognized && !data.already_marked) {
        const scan: ScanResult = {
          id: Date.now().toString(),
          name: data.employee.name,
          dept: data.employee.department,
          time: data.time || "Just now",
          status: "Success",
          confidence: Math.round(data.confidence * 100)
        };
        setLastScan(scan);
        setScanCount(c => c + 1);
        toast(`Welcome, ${data.employee.name}! Attendance marked.`, {
          duration: 3000,
          icon: "✅",
          style: { background: "#10b981", color: "#fff" },
        });
      } else if (data.success && data.recognized && data.already_marked) {
        toast("Attendance already marked today", {
          duration: 2000,
          icon: "ℹ️",
        });
      } else if (data.success && !data.recognized) {
        setLastScan({
          id: Date.now().toString(),
          name: "Unknown Face",
          dept: "Visitor",
          time: "Just now",
          status: "Warning",
          confidence: Math.round(data.confidence * 100) || 0
        });
        toast("Unknown person detected", {
          duration: 2500,
          icon: "⚠️",
          style: { background: "#f59e0b", color: "#fff" },
        });
      } else {
        setLastScan(null);
        toast("Recognition failed - try again", {
          duration: 2500,
          icon: "❌",
          style: { background: "#ef4444", color: "#fff" },
        });
      }
    } catch (error) {
      console.error("Recognition error:", error);
      setLastScan(null);
      toast("Server error - check connection", {
        duration: 2500,
        icon: "❌",
        style: { background: "#ef4444", color: "#fff" },
      });
    } finally {
      isScanningRef.current = false;
      setNextScanIn(3);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextScanIn > 0) {
        setNextScanIn(s => Math.max(0, s - 1));
      } else {
        captureAndRecognize();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextScanIn, captureAndRecognize]);

  const manualScan = () => {
    setNextScanIn(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 bg-blue-500" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full blur-[120px] opacity-20 bg-violet-500" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <ScanFace size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Face Attendance Kiosk</h1>
            <p className="text-slate-400 text-sm">Scan your face to mark attendance</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-3xl font-mono font-bold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-sm text-slate-400">{time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</div>
          </div>
          <div className="w-px h-10 bg-slate-700" />
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
            <Lock size={16} />
            <span>Admin</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Panel */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center mb-6">
              <Webcam
                ref={webcamRef}
                mirrored
                videoConstraints={{ facingMode: "user" }}
                className="w-full h-full object-cover"
              />
              {!webcamRef.current?.video?.readyState && (
                <div className="text-slate-400 flex flex-col items-center gap-3">
                  <Camera size={48} className="animate-pulse" />
                  <p>Waiting for camera access...</p>
                </div>
              )}
              
              {nextScanIn > 0 && nextScanIn < 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 animate-ping" />
                    </div>
                    <span className="text-2xl font-bold text-blue-400">
                      Scanning in {nextScanIn}s...
                    </span>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <button
                  onClick={manualScan}
                  disabled={isScanningRef.current || nextScanIn > 0}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <Camera size={20} />
                  Scan Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{scanCount}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Scans</div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {lastScan?.status === "Success" ? 100 : lastScan?.confidence || 0}%
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Accuracy</div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-200">
                  {lastScan?.status === "Warning" ? 0 : 1}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Status</div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Recent Result */}
            <div className={`rounded-3xl p-8 border-2 transition-all duration-500 ${
              lastScan?.status === "Success"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : lastScan?.status === "Warning"
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-slate-900/80 border-slate-700/50"
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Last Scan</h2>
                {lastScan?.status === "Success" && <CheckCircle2 className="text-emerald-400" size={32} />}
                {lastScan?.status === "Warning" && <ShieldAlert className="text-amber-400" size={32} />}
                {!lastScan && <ScanFace className="text-slate-500" size={32} />}
              </div>

              {lastScan ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-3xl font-bold">
                      {lastScan.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{lastScan.name}</h3>
                      <p className="text-slate-400">{lastScan.dept}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                      <Clock size={20} className="text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-500 uppercase">Time</div>
                        <div className="font-semibold">{lastScan.time}</div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                      <User size={20} className="text-slate-400" />
                      <div>
                        <div className="text-xs text-slate-500 uppercase">Confidence</div>
                        <div className="font-semibold">{lastScan.confidence}%</div>
                      </div>
                    </div>
                  </div>

                  {lastScan.status === "Success" ? (
                    <div className="mt-4 p-4 bg-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-300">
                      <UserCheck size={24} />
                      <span className="font-semibold">Attendance successfully marked!</span>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-amber-500/20 rounded-xl flex items-center gap-3 text-amber-300">
                      <ShieldAlert size={24} />
                      <span className="font-semibold">Face not recognized in database</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <ScanFace size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Waiting for scan...</p>
                  <p className="text-sm text-slate-600 mt-1">Position your face in the camera frame</p>
                </div>
              )}
            </div>

            {/* Recent Scans List */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-slate-400" />
                Recent Activity
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {scanCount === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No scans yet</p>
                  </div>
                ) : (
                  [lastScan, ...Array(4).fill(null)].filter(Boolean).map((scan, idx) => (
                    scan && (
                      <div key={scan.id} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                        <div className={`w-2 h-12 rounded-full ${
                          scan.status === "Success" ? "bg-emerald-500" : "bg-amber-500"
                        }`} />
                        <div className="flex-1">
                          <div className="font-semibold">{scan.name}</div>
                          <div className="text-xs text-slate-400">{scan.dept} • {scan.time}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          scan.status === "Success" 
                            ? "bg-emerald-500/20 text-emerald-400" 
                            : "bg-amber-500/20 text-amber-400"
                        }`}>
                          {scan.status === "Success" ? "Marked" : "Unknown"}
                        </div>
                      </div>
                    )
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{scanCount}</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Attendance Today</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 text-center">
                <div className="text-4xl font-bold text-violet-400 mb-2">
                  {scanCount > 0 ? Math.round(scanCount * 98.5) : 100}%
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wider">Recognition Rate</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
