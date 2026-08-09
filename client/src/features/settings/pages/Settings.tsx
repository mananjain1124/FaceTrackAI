import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User, Lock, Cpu, ChevronRight, Save, Eye, EyeOff,
  Globe, Palette,
} from "lucide-react";

import { getSettings, updateSettings } from "@/services/settingsService";
import type { Settings as SettingsType } from "@/types";

const sections = [
  { id: "profile",    label: "Profile",        icon: User },
  { id: "ai",         label: "AI Recognition",  icon: Cpu },
];

function SectionNav({ active, setActive }: { active: string; setActive: (s: string) => void }) {
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

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

export default function Settings() {
  const [active, setActive] = useState("profile");
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const [orgName, setOrgName] = useState("");
  const [threshold, setThreshold] = useState(75);
  const [dupWindow, setDupWindow] = useState(0);
  const [workStart, setWorkStart] = useState(9);
  const [workEnd, setWorkEnd] = useState(18);

  useEffect(() => {
    if (settings) {
      setOrgName(settings.organization_name || "");
      setThreshold(Math.round((settings.recognition_threshold || 0.75) * 100));
      setDupWindow(settings.duplicate_window_seconds || 0);
      setWorkStart(settings.work_start_hour || 9);
      setWorkEnd(settings.work_end_hour || 18);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to save settings");
    },
  });

  const handleSave = () => {
    mutation.mutate({
      organization_name: orgName,
      recognition_threshold: threshold / 100,
      duplicate_window_seconds: dupWindow,
      work_start_hour: workStart,
      work_end_hour: workEnd,
    });
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
          disabled={mutation.isPending}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
            mutation.isPending
              ? "bg-slate-400 cursor-wait"
              : "bg-gradient-to-r from-blue-600 to-violet-600 shadow-blue-500/30 hover:from-blue-500 hover:to-violet-500"
          }`}
        >
          <Save size={16} />
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid xl:grid-cols-4 gap-5">
        <div className="xl:col-span-1">
          <SectionNav active={active} setActive={setActive} />
        </div>

        <div className="xl:col-span-3 space-y-5">
          {active === "profile" && (
            <Card title="Organization" subtitle="General system settings">
              <Field label="Organization Name" hint="Displayed in the sidebar and dashboard">
                <input
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  placeholder="FaceTrackAI"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </Field>
              <Field label="Work Start Hour" hint="Used to determine early/late attendance (for future check-in/check-out)">
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={workStart}
                  onChange={e => setWorkStart(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </Field>
              <Field label="Work End Hour" hint="Used to determine early departure (for future check-in/check-out)">
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={workEnd}
                  onChange={e => setWorkEnd(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </Field>
            </Card>
          )}

          {active === "ai" && (
            <>
              <Card title="AI Recognition Settings" subtitle="Configure face recognition parameters">
                <Field label="Confidence Threshold" hint="Faces below this confidence are marked unknown">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={50}
                      max={99}
                      value={threshold}
                      onChange={e => setThreshold(Number(e.target.value))}
                      className="flex-1 accent-blue-500"
                    />
                    <span className="text-sm font-bold text-slate-900 dark:text-white w-12 text-right">{threshold}%</span>
                  </div>
                </Field>
                <Field label="Duplicate Window (seconds)" hint="Prevent re-scanning within this interval (0 = once per day)">
                  <input
                    type="number"
                    min={0}
                    value={dupWindow}
                    onChange={e => setDupWindow(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </Field>
              </Card>
              <Card title="System Status" subtitle="Real-time service health">
                {isLoading ? (
                  <p className="text-sm text-slate-500">Loading...</p>
                ) : (
                  <div className="space-y-3">
                    {[
                      { label: "Recognition Threshold", value: `${threshold}%` },
                      { label: "Duplicate Window", value: dupWindow === 0 ? "Once per day" : `${dupWindow}s` },
                      { label: "Work Hours", value: `${workStart}:00 – ${workEnd}:00` },
                      { label: "Organization", value: orgName || "—" },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/[0.04] last:border-0">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{row.label}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{row.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
