import { Camera, CircleCheck, CircleX, Maximize2 } from "lucide-react";

const cameras = [
  { id: "CAM-01", label: "Main Entrance", status: "Online",  fps: "30 FPS", res: "1080p" },
  { id: "CAM-02", label: "East Corridor", status: "Online",  fps: "24 FPS", res: "720p"  },
  { id: "CAM-03", label: "Parking Zone",  status: "Offline", fps: "—",      res: "—"     },
  { id: "CAM-04", label: "Lobby",         status: "Online",  fps: "30 FPS", res: "1080p" },
];

export default function CameraStatus() {
  return (
    <div className="glass-card rounded-2xl p-6 card-hover">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Camera size={15} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Camera Status</h2>
            <p className="text-xs text-slate-500">3 of 4 cameras active</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          75% Online
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cameras.map((cam) => (
          <div
            key={cam.id}
            className={`rounded-xl border p-4 transition-all duration-200 hover:scale-[1.02] ${
              cam.status === "Online"
                ? "bg-slate-50 border-slate-200 dark:bg-white/[0.03] dark:border-white/[0.08] hover:border-emerald-500/30"
                : "bg-red-50 border-red-200 dark:bg-red-500/5 dark:border-red-500/15"
            }`}
          >
            <div className={`relative rounded-lg h-20 flex items-center justify-center mb-3 overflow-hidden ${cam.status === "Online" ? "bg-slate-900" : "bg-slate-800 dark:bg-slate-950"}`}>
              {cam.status === "Online" ? (
                <>
                  <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                  <Camera size={24} className="text-slate-500 dark:text-slate-600" />
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1 text-[10px] text-emerald-400 bg-black/40 px-1.5 py-0.5 rounded">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <CircleX size={20} className="text-red-400 dark:text-red-500/50" />
                  <span className="text-[10px] text-red-400 dark:text-red-500/50">No Signal</span>
                </div>
              )}
              <button className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                <Maximize2 size={10} className="text-white/70" />
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{cam.id}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{cam.label}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`flex items-center gap-1 text-xs font-medium ${cam.status === "Online" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {cam.status === "Online" ? <CircleCheck size={13} /> : <CircleX size={13} />}
                  {cam.status}
                </div>
                {cam.fps !== "—" && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-600">{cam.res} · {cam.fps}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}