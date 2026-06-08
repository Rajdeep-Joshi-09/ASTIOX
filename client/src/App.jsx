import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ClientLayout from "./layout/client/ClientLayout";
import AdminLayout from "./layout/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import Home from "./pages/client/Home";
import LoginPage from "./pages/admin/LoginPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import PermissionRoute from "./components/admin/PermissionRoute";
import { AuthProvider } from "./context/AuthContext";
import UserList from "./pages/admin/UserList";
import UserForm from "./pages/admin/UserForm";
import CategoryList from "./pages/admin/CategoryList";
import CategoryForm from "./pages/admin/CategoryForm";
import CollectionList from "./pages/admin/CollectionList";
import CollectionForm from "./pages/admin/CollectionForm";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import MenuMasterList from "./pages/admin/MenuMasterList";
import MenuMasterForm from "./pages/admin/MenuMasterForm";
import RoleRights from "./pages/admin/RoleRights";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AuthProvider>
                <AdminLayout />
              </AuthProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route
            path="users"
            element={
              <PermissionRoute menuKey="users">
                <UserList />
              </PermissionRoute>
            }
          />
          <Route
            path="users/new"
            element={
              <PermissionRoute menuKey="users">
                <UserForm />
              </PermissionRoute>
            }
          />
          <Route
            path="users/:id/edit"
            element={
              <PermissionRoute menuKey="users">
                <UserForm />
              </PermissionRoute>
            }
          />
          <Route
            path="category"
            element={
              <PermissionRoute menuKey="category">
                <CategoryList />
              </PermissionRoute>
            }
          />
          <Route
            path="category/new"
            element={
              <PermissionRoute menuKey="category">
                <CategoryForm />
              </PermissionRoute>
            }
          />
          <Route
            path="category/:id/edit"
            element={
              <PermissionRoute menuKey="category">
                <CategoryForm />
              </PermissionRoute>
            }
          />
          <Route
            path="collection"
            element={
              <PermissionRoute menuKey="collection">
                <CollectionList />
              </PermissionRoute>
            }
          />
          <Route
            path="collection/new"
            element={
              <PermissionRoute menuKey="collection">
                <CollectionForm />
              </PermissionRoute>
            }
          />
          <Route
            path="collection/:id/edit"
            element={
              <PermissionRoute menuKey="collection">
                <CollectionForm />
              </PermissionRoute>
            }
          />
          <Route
            path="products"
            element={
              <PermissionRoute menuKey="products">
                <ProductList />
              </PermissionRoute>
            }
          />
          <Route
            path="products/new"
            element={
              <PermissionRoute menuKey="products">
                <ProductForm />
              </PermissionRoute>
            }
          />
          <Route
            path="products/:id/edit"
            element={
              <PermissionRoute menuKey="products">
                <ProductForm />
              </PermissionRoute>
            }
          />
          <Route
            path="menu-master"
            element={
              <PermissionRoute menuKey="menu-master">
                <MenuMasterList />
              </PermissionRoute>
            }
          />
          <Route
            path="menu-master/new"
            element={
              <PermissionRoute menuKey="menu-master">
                <MenuMasterForm />
              </PermissionRoute>
            }
          />
          <Route
            path="menu-master/:id/edit"
            element={
              <PermissionRoute menuKey="menu-master">
                <MenuMasterForm />
              </PermissionRoute>
            }
          />
          <Route
            path="role-rights"
            element={
              <PermissionRoute menuKey="role-rights">
                <RoleRights />
              </PermissionRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
