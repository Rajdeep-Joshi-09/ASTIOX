import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAuth } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("astoix_menus");
    navigate("/admin/login");
  };

  return (
    <>
      <header className="h-14 bg-card/80 backdrop-blur-md border-b border-border flex items-center px-5 gap-3 shrink-0 sticky top-0 z-30">
        <div className="flex-1" />

        <Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {user && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2.5 rounded-xl border border-border px-3 py-1.5 hover:bg-muted/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold leading-tight">{user.userName}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{user.userEmail}</p>
            </div>
          </button>
        )}
      </header>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold">Profile</h2>
          <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center text-center gap-3 pt-2">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/25">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold">{user?.userName}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{user?.userEmail}</p>
              <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-muted capitalize">
                {user?.userType?.replace("_", " ")}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;
