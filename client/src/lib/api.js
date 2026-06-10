const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("astoix_token");

export const getStoredUser = () => {
  const raw = localStorage.getItem("astoix_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem("astoix_user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("astoix_token");
  localStorage.removeItem("astoix_user");
  localStorage.removeItem("astoix_menus");
};

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const apiUpload = async (path, formData, method = "POST") => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

// ✅ Fix imageUrl to use the same base
export const imageUrl = (filePath) => {
  if (!filePath) return null;
  const filename = filePath.split("/").pop().split("\\").pop();
  const base =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";
  return `${base}/uploads/products/${filename}`;
};
