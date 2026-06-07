import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ClientLayout from "./layout/client/ClientLayout";
import AdminLayout from "./layout/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import Home from "./pages/client/Home";
import LoginPage from "./pages/admin/LoginPage";
import ProtectedRoute from "./components/admin/ProtectedRoute"; // adjust path if needed

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Client ── */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* ── Admin login (public) ── */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* ── Admin layout (protected) ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          {/* add more admin pages here as nested routes */}
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
