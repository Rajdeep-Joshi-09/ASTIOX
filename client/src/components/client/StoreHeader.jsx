import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import StoreThemeToggle from "@/components/client/StoreThemeToggle";
import { cn } from "@/lib/utils";
import logo from "../../assets/logo.png"

const NAV_LINKS = [
  { to: "/", label: "Catalog", match: (path) => path === "/" || path.startsWith("/product/") },
  { to: "/collections", label: "Collections", match: (path) => path === "/collections" },
  { to: "/about", label: "About", match: (path) => path === "/about" },
];

const StoreHeader = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-store-border bg-store-bg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center gap-4">
        <Link
          to="/"
          className="font-serif text-lg sm:text-xl tracking-[0.12em] text-store-fg shrink-0"
        >
          <div className="h-15 w-35 overflow-hidden">
          <img src={logo} className="h-full w-full object-contain"/>
          </div>
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-10">
          {NAV_LINKS.map(({ to, label, match }) => (
            <Link
              key={label}
              to={to}
              className={cn(
                "text-[11px] uppercase tracking-[0.18em] text-store-fg transition-opacity hover:opacity-60",
                match(location.pathname) && "underline underline-offset-4"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5 ml-auto">
          <button
            type="button"
            aria-label="Search"
            className="hidden sm:block text-store-fg hover:opacity-60 transition-opacity"
          >
            <Search className="w-[18px] h-[18px] stroke-[1.5]" />
          </button>

          <StoreThemeToggle />

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden text-store-fg"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <X className="w-5 h-5 stroke-[1.5]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[1.5]" />
            )}
          </button>

          <Link
            to="/admin/login"
            className="hidden md:inline text-[10px] uppercase tracking-[0.15em] text-store-subtle hover:text-store-fg transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-store-border px-4 sm:px-6 py-5 flex flex-col gap-4 bg-store-bg">
          {NAV_LINKS.map(({ to, label, match }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "text-xs uppercase tracking-[0.18em] text-store-fg",
                match(location.pathname) && "underline underline-offset-4"
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setMenuOpen(false)}
            className="text-xs uppercase tracking-[0.15em] text-store-subtle"
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
};

export default StoreHeader;
