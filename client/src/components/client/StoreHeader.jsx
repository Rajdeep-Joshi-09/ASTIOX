import { Link } from "react-router-dom";

const StoreHeader = () => (
  <header className="bg-[#131921] text-white">
    <div className="max-w-[1500px] mx-auto px-4 h-14 flex items-center gap-6">
      <Link to="/" className="shrink-0 flex items-baseline gap-1 group">
        <span className="text-xl font-bold tracking-tight group-hover:text-[#febd69] transition-colors">
          ASTIOX
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-5 text-sm text-[#ccc]">
        <Link to="/" className="hover:text-white transition-colors">
          All Products
        </Link>
      </nav>

      <div className="flex-1" />

      <Link
        to="/admin/login"
        className="text-sm text-[#ccc] hover:text-white border border-[#848688] rounded px-3 py-1.5 transition-colors"
      >
        Admin
      </Link>
    </div>
    <div className="bg-[#232f3e] text-[#ccc] text-xs">
      <div className="max-w-[1500px] mx-auto px-4 py-2 flex items-center gap-2">
        <span className="text-white font-medium">Shop</span>
        <span className="text-[#666]">›</span>
        <span>Product Catalog</span>
      </div>
    </div>
  </header>
);

export default StoreHeader;
