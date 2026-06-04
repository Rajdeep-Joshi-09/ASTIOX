import Footer from "@/components/admin/Footer";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - fixed on left */}
      <Sidebar />

      {/* Right side - header, content, footer */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        {/* Main content area - this renders your nested route pages */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
