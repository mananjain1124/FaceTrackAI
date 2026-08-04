import { useState } from "react";
import {
  User, Lock, Bell, Camera, Cpu, Shield, ChevronRight, Save, Eye, EyeOff,
  Globe, Palette, Database, Wifi,
} from "lucide-react";

const sections = [
  { id: "profile",    label: "Profile",        icon: User },
  { id: "security",   label: "Security",       icon: Lock },
  { id: "ai",         label: "AI & Camera",    icon: Camera },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "system",     label: "System",         icon: Cpu },
];

function SectionNav({ active, setActive }: any) {
  return (
    <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl p-3 shadow-sm">
      {sections.map(s => {
        const Icon = s.icon;
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 last:mb-0 ${
              isActive
                ? "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Icon size={16} />
            {s.label}
            <ChevronRight size={14} className={`ml-auto transition-transform ${isActive ? "rotate-90" : ""}`} />
          </button>
        );
      })}
    </div>
  );
}

function Card({ title, subtitle, children }: any) {
  return (
    <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl border border-slate-200 dark:border-white/[0.06] rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.06]">
        <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: any) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
    />
  );
}

function Toggle({ label, desc, defaultOn = false }: any) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/[0.04] last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
        {desc && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${on ? "bg-blue-500" : "bg-slate-200 dark:bg-white/[0.12]"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const [active, setActive] = useState("profile");
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage system configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${saved ? "bg-emerald-500 shadow-emerald-500/30" : "bg-gradient-to-r from-blue-600 to-violet-600 shadow-blue-500/30 hover:from-blue-500 hover:to-violet-500"}`}
        >
          <Save size={16} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid xl:grid-cols-4 gap-5">
        {/* Nav */}
        <div className="xl:col-span-1">
          <SectionNav active={active} setActive={setActive} />
        </div>

        {/* Content */}
        <div className="xl:col-span-3 space-y-5">
          {active === "profile" && (
            <>
              <Card title="Profile Information" subtitle="Update your personal details">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">A</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Administrator</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">admin@facetrack.ai</p>
                    <button className="text-xs text-blue-500 hover:text-blue-400 mt-1 transition-colors">Change photo</button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <Input defaultValue="Administrator" />
                  </Field>
                  <Field label="Employee ID">
                    <Input defaultValue="ADMIN-001" />
                  </Field>
                  <Field label="Email">
                    <Input type="email" defaultValue="admin@facetrack.ai" />
                  </Field>
                  <Field label="Phone">
                    <Input defaultValue="+91 9000 000000" />
                  </Field>
                </div>
                <Field label="Organization">
                  <Input defaultValue="FaceTrack AI Ltd." />
                </Field>
              </Card>
              <Card title="Preferences" subtitle="Appearance and regional settings">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Language">
                    <div className="relative">
                      <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none cursor-pointer">
                        <option>English (US)</option>
                        <option>Hindi</option>
                        <option>Marathi</option>
                      </select>
                    </div>
                  </Field>
                  <Field label="Theme">
                    <div className="relative">
                      <Palette size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none cursor-pointer">
                        <option>System Default</option>
                        <option>Dark Mode</option>
                        <option>Light Mode</option>
                      </select>
                    </div>
                  </Field>
                </div>
              </Card>
            </>
          )}

          {active === "security" && (
            <Card title="Change Password" subtitle="Keep your account secure">
              <Field label="Current Password">
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPass ? "text" : "password"} placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 pl-10 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>
              <Field label="New Password">
                <Input type="password" placeholder="Min. 8 characters" />
              </Field>
              <Field label="Confirm Password">
                <Input type="password" placeholder="Repeat new password" />
              </Field>

              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Security Features</p>
                <Toggle label="Two-Factor Authentication" desc="Require OTP on login" defaultOn />
                <Toggle label="Session Timeout" desc="Auto-logout after 30 minutes of inactivity" defaultOn />
                <Toggle label="Audit Log" desc="Record all admin actions" defaultOn />
              </div>
            </Card>
          )}

          {active === "ai" && (
            <>
              <Card title="AI Recognition Settings" subtitle="Configure face recognition parameters">
                <Field label="Confidence Threshold" hint="Faces below this confidence are marked unknown">
                  <div className="flex items-center gap-4">
                    <input type="range" min={50} max={99} defaultValue={75} className="flex-1 accent-blue-500" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white w-10 text-right">75%</span>
                  </div>
                </Field>
                <Field label="Recognition Interval (ms)" hint="Delay between recognition attempts">
                  <Input type="number" defaultValue={2000} />
                </Field>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Recognition Options</p>
                  <Toggle label="Anti-Spoofing Detection" desc="Block photo/video-based spoofing" defaultOn />
                  <Toggle label="Unknown Face Alerts" desc="Send alert when unknown face detected" defaultOn />
                  <Toggle label="Duplicate Detection" desc="Prevent marking same person twice within 10 min" defaultOn />
                  <Toggle label="Night Vision Mode" desc="Enhance recognition in low-light conditions" />
                </div>
              </Card>
              <Card title="Camera Configuration" subtitle="Live camera stream settings">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Resolution">
                    <select className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm outline-none cursor-pointer">
                      <option>1080p (Full HD)</option>
                      <option>720p (HD)</option>
                      <option>480p (SD)</option>
                    </select>
                  </Field>
                  <Field label="Frame Rate">
                    <select className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm outline-none cursor-pointer">
                      <option>30 FPS</option><option>24 FPS</option><option>15 FPS</option>
                    </select>
                  </Field>
                </div>
                <Toggle label="Mirror Camera Feed" desc="Flip horizontally for front-facing cameras" defaultOn />
                <Toggle label="Auto-Restart on Disconnect" desc="Reconnect camera stream automatically" defaultOn />
              </Card>
            </>
          )}

          {active === "notifications" && (
            <Card title="Notification Preferences" subtitle="Choose what alerts you receive">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Bell size={12} />Attendance Alerts</p>
                <Toggle label="Attendance Marked" desc="Notify when employee is recognized" defaultOn />
                <Toggle label="Late Arrival Alert" desc="Alert when employee arrives after 9:30 AM" defaultOn />
                <Toggle label="Absent Summary" desc="Daily summary of absent employees" defaultOn />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Shield size={12} />Security Alerts</p>
                <Toggle label="Unknown Face Detected" desc="Immediate alert for unrecognized faces" defaultOn />
                <Toggle label="Spoof Attempt Blocked" desc="Alert when anti-spoof triggers" defaultOn />
                <Toggle label="Camera Offline" desc="Alert when a camera goes offline" defaultOn />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Wifi size={12} />Delivery Channels</p>
                <Toggle label="In-App Notifications" defaultOn />
                <Toggle label="Email Alerts" defaultOn />
                <Toggle label="Desktop Push Notifications" />
              </div>
            </Card>
          )}

          {active === "system" && (
            <>
              <Card title="System Information" subtitle="Current server and service status">
                {[
                  { label: "Application Version", value: "v2.0.0", icon: Globe },
                  { label: "AI Service", value: "Running — Port 8000", icon: Cpu },
                  { label: "Database", value: "MongoDB Connected", icon: Database },
                  { label: "GPU Acceleration", value: "Active (CUDA 12.0)", icon: Cpu },
                  { label: "Uptime", value: "3d 14h 22m", icon: Wifi },
                ].map(row => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/[0.04] last:border-0">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Icon size={14} className="text-slate-400" /> {row.label}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{row.value}</span>
                    </div>
                  );
                })}
              </Card>
              <Card title="Database Management" subtitle="Backup and reset options">
                <Toggle label="Auto Backup" desc="Daily backup to local storage at midnight" defaultOn />
                <Toggle label="Log Retention (30 days)" desc="Automatically delete logs older than 30 days" defaultOn />
                <div className="pt-4 flex gap-3">
                  <button className="flex-1 rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 py-2.5 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all">
                    Backup Now
                  </button>
                  <button className="flex-1 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 py-2.5 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                    Clear Old Logs
                  </button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}