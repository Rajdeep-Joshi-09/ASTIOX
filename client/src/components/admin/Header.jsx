const Header = ({ title = "Dashboard" }) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-5 gap-3 shrink-0">
      <h1 className="flex-1 text-sm font-medium text-gray-800">{title}</h1>
    </header>
  );
};

export default Header;
