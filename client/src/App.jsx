import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClientLayout from "./layout/client/ClientLayout";
import AdminLayout from "./layout/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import Home from "./pages/client/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
