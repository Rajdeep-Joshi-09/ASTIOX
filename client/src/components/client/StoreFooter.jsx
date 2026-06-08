const StoreFooter = () => (
  <footer className="bg-[#232f3e] text-[#ddd] mt-auto">
    <div className="max-w-[1500px] mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="font-semibold text-white mb-2">ASTIOX</p>
          <p className="text-[#999] leading-relaxed text-xs">
            A curated product catalog. Browse by category or collection to find what you need.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">Browse</p>
          <ul className="space-y-1 text-xs text-[#999]">
            <li>All Products</li>
            <li>By Category</li>
            <li>By Collection</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">Support</p>
          <p className="text-xs text-[#999]">Contact your account manager for inquiries.</p>
        </div>
      </div>
      <div className="border-t border-[#3a4553] mt-8 pt-6 text-center text-xs text-[#999]">
        © {new Date().getFullYear()} ASTIOX. All rights reserved.
      </div>
    </div>
  </footer>
);

export default StoreFooter;
