import { Camera, ScanFace, Maximize2, Wifi } from "lucide-react";

export default function CameraPreview() {
  return (
    <div className="glass-card rounded-2xl p-5 card-hover h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Live Camera</h2>
          <p className="text-xs text-slate-500">Main Entrance — Cam 1</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Live</span>
          </div>
          <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-transparent">
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Camera viewport */}
      <div className="flex-1 relative rounded-xl bg-slate-900 border border-slate-800 dark:border-white/[0.06] overflow-hidden min-h-[280px]">
        {/* Scan line animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div
            className="absolute left-0 right-0 h-[2px] animate-scan-line"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)",
              boxShadow: "0 0 8px rgba(6,182,212,0.4)",
            }}
          />
        </div>

        {/* Corner brackets */}
        {[
          "top-3 left-3 border-t-2 border-l-2",
          "top-3 right-3 border-t-2 border-r-2",
          "bottom-3 left-3 border-b-2 border-l-2",
          "bottom-3 right-3 border-b-2 border-r-2",
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute w-5 h-5 border-cyan-400/60 ${cls} rounded-sm pointer-events-none z-20`}
          />
        ))}

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
            <Camera size={36} className="text-slate-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-300">Camera Preview</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
            OpenCV video stream will appear here
          </p>
        </div>

        {/* Bottom HUD bar */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950 to-transparent z-20 flex items-end pb-2 px-3">
          <div className="flex items-center gap-3 w-full">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs">
              <ScanFace size={13} />
              <span>AI Detection Ready</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-slate-400 text-xs">
              <Wifi size={12} />
              <span>1080p</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}