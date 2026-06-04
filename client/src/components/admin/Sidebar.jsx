import { Badge, Box, CircleDashed, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Category", to: "/admin/category" },
  { label: "Collection", to: "/admin/collection" },
  { label: "Products", to: "/admin/products" },
];

const Sidebar = () => {
  return (
    <aside className="flex flex-col w-56 h-screen bg-slate-900 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <div>
          <p className="text-slate-100 text-sm font-medium">ASTOIX</p>
          <p className="text-slate-500 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors
              ${
                isActive
                  ? "bg-slate-800 text-indigo-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            <span className={`text-base w-5`}>
              <CircleDashed />
            </span>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="bg-indigo-500 text-indigo-100 text-[10px] px-2 py-0.5 rounded-full font-medium">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
