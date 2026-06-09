import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const StoreThemeToggle = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "text-store-fg hover:opacity-60 transition-opacity",
        className
      )}
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px] stroke-[1.5]" />
      ) : (
        <Moon className="w-[18px] h-[18px] stroke-[1.5]" />
      )}
    </button>
  );
};

export default StoreThemeToggle;
