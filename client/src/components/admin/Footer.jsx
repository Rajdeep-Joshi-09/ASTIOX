const Footer = () => {
  return (
    <footer className="h-10 bg-white border-t border-gray-200 flex items-center px-5 justify-between shrink-0">
      <p className="text-xs text-gray-400">ASTIOX Admin © 2026</p>
      <div className="flex gap-4">
        <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
          Help
        </span>
        <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
          Docs
        </span>
        <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
          Logout
        </span>
      </div>
    </footer>
  );
};

export default Footer;
