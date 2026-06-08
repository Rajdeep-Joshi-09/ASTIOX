import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, getStoredUser, setStoredUser } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [menus, setMenus] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("astoix_menus") || "[]");
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const res = await apiFetch("/auth/me");
      const data = res.data;
      const stored = {
        userName: data.userName,
        userEmail: data.userEmail,
        userType: data.userType,
      };
      setStoredUser(stored);
      setUser(stored);
      setMenus(data.menus || []);
      localStorage.setItem("astoix_menus", JSON.stringify(data.menus || []));
    } catch {
      setUser(getStoredUser());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const hasMenuAccess = (menuKey) => {
    if (user?.userType === "super_admin") return true;
    return menus.some((m) => m.menuKey === menuKey);
  };

  const hasPathAccess = (path) => {
    if (user?.userType === "super_admin") return true;
    return menus.some((m) => m.menuPath === path);
  };

  return (
    <AuthContext.Provider
      value={{ user, menus, loading, hasMenuAccess, hasPathAccess, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
