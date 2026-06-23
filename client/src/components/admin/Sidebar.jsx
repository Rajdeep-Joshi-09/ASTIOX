import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getMenuIcon } from "@/lib/menuIcons";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const { menus, user } = useAuth();

  return (
    <aside className="flex flex-col w-60 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">ASTIOX</p>
          <p className="text-[11px] text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {menus
          .filter((item) => item.menuKey !== "collection" && item.menuKey !== "menu-master")
          .map((item) => {
            const Icon = getMenuIcon(item.icon);
            return (
            <NavLink
              key={item.menuKey}
              to={item.menuPath}
              end={item.menuPath === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.menuName}</span>
              {item.isDeveloperOnly && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium">
                  DEV
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <p className="text-[11px] text-muted-foreground truncate">{user?.userEmail}</p>
        <p className="text-xs font-medium capitalize mt-0.5">
          {user?.userType?.replace("_", " ")}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
