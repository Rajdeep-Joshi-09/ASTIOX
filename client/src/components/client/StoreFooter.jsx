import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"

const StoreFooter = () => (
  <footer className="mt-auto">
    <div className="bg-store-surface border-t border-store-border transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.15em] text-store-muted text-center sm:text-left">
        <Link
          to="/"
          className="font-serif text-sm tracking-[0.12em] text-store-fg normal-case"
        >
           <div className="h-15 w-35 overflow-hidden">
                    <img src={logo} className="h-full w-full object-contain"/>
                    </div>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          <span className="hover:text-store-fg transition-colors cursor-pointer">
            Terms
          </span>
          <span className="hover:text-store-fg transition-colors cursor-pointer">
            Privacy
          </span>
          <span className="hover:text-store-fg transition-colors cursor-pointer">
            Inquire
          </span>
        </div>

        <p className="text-store-subtle normal-case tracking-normal text-[10px]">
          © {new Date().getFullYear()} ASTIOX Gallery. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default StoreFooter;
