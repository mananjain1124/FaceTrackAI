import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="
        w-10 h-10 rounded-xl flex items-center justify-center
        bg-slate-100 dark:bg-white/[0.04]
        border border-slate-200 dark:border-white/[0.08]
        hover:bg-slate-200 dark:hover:bg-white/[0.08]
        text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white
        transition-all duration-200 hover:scale-105
      "
    >
      {theme === "dark" ? (
        <Sun size={16} className="text-amber-400" />
      ) : (
        <Moon size={16} className="text-blue-500" />
      )}
    </button>
  );
}