import { Camera, ScanFace, Maximize2, Wifi, Settings, RefreshCw } from "lucide-react";

const cameras = [
  { id: "CAM-01", label: "Main Entrance", status: "Online",  fps: "30 FPS", res: "1080p", location: "Ground Floor" },
  { id: "CAM-02", label: "East Corridor", status: "Online",  fps: "24 FPS", res: "720p",  location: "1st Floor" },
  { id: "CAM-03", label: "Parking Zone",  status: "Offline", fps: "—",      res: "—",     location: "Basement" },
  { id: "CAM-04", label: "Lobby",         status: "Online",  fps: "30 FPS", res: "1080p", location: "Reception" },
  { id: "CAM-05", label: "Server Room",   status: "Online",  fps: "15 FPS", res: "720p",  location: "3rd Floor" },
  { id: "CAM-06", label: "Exit Gate",     status: "Online",  fps: "30 FPS", res: "1080p", location: "Ground Floor" },
];

export default function CameraPage() {
  const online = cameras.filter(c => c.status === "Online").length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Live Camera Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor all camera feeds and status in real time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{online}/{cameras.length} Online</span>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Cameras", value: cameras.length, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Online", value: online, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Offline", value: cameras.length - online, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-slate-200 dark:border-white/[0.06] p-4 text-center ${s.bg} shadow-sm`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {cameras.map(cam => (
          <div
            key={cam.id}
            className={`rounded-2xl border overflow-hidden shadow-sm card-hover ${
              cam.status === "Online"
                ? "bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border-slate-200 dark:border-white/[0.06]"
                : "bg-slate-50 dark:bg-red-950/20 border-slate-200 dark:border-red-500/15"
            }`}
          >
            {/* Viewport */}
            <div className="relative h-44 bg-slate-900 overflow-hidden">
              {cam.status === "Online" ? (
                <>
                  <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: "linear-gradient(rgba(6,182,212,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.5) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
                  {/* Corner brackets */}
                  {["top-2 left-2 border-t border-l","top-2 right-2 border-t border-r","bottom-2 left-2 border-b border-l","bottom-2 right-2 border-b border-r"].map((cls,i) => (
                    <div key={i} className={`absolute w-4 h-4 border-cyan-500/50 ${cls}`} />
                  ))}
                  <div className="absolute left-0 right-0 h-[1px] animate-scan-line"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(6,182,212,0.5),transparent)" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera size={32} className="text-slate-700" />
                  </div>
                  {/* Live badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 backdrop-blur rounded-md px-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] text-white font-semibold">REC</span>
                  </div>
                  {/* Resolution */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur rounded px-2 py-0.5">
                    <Wifi size={10} className="text-slate-400" />
                    <span className="text-[10px] text-slate-300">{cam.res} · {cam.fps}</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <Camera size={28} className="text-red-400/40" />
                  <span className="text-xs text-red-400/60">No Signal</span>
                </div>
              )}
              {/* Fullscreen btn */}
              <button className="absolute top-2 right-2 w-7 h-7 rounded bg-black/30 hover:bg-black/50 flex items-center justify-center text-white/60 hover:text-white transition-all">
                <Maximize2 size={12} />
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{cam.id}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      cam.status === "Online"
                        ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400"
                    }`}>
                      {cam.status === "Online" ? "● Online" : "✕ Offline"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cam.label} · {cam.location}</p>
                </div>
                <div className="flex gap-1.5">
                  <button className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 flex items-center justify-center transition-all">
                    <ScanFace size={13} />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.08] flex items-center justify-center transition-all">
                    <Settings size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}