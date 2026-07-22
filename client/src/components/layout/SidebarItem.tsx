import { NavLink } from "react-router-dom";

export default function SidebarItem({ item, collapsed }: any) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `group flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <Icon
        size={22}
        className="group-hover:scale-110 transition-transform"
      />

      {!collapsed && (
        <span className="font-medium">
          {item.title}
        </span>
      )}
    </NavLink>
  );
}