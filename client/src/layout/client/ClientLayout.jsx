import { Outlet } from "react-router-dom";
import StoreHeader from "@/components/client/StoreHeader";
import StoreFooter from "@/components/client/StoreFooter";

const ClientLayout = () => (
  <div className="min-h-screen bg-[#eaeded] flex flex-col">
    <StoreHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <StoreFooter />
  </div>
);

export default ClientLayout;
