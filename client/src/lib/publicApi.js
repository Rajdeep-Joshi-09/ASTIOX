const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/public`;

export const publicFetch = async (path) => {
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const getPublicProducts = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.categoryId) qs.set("categoryId", params.categoryId);
  if (params.collectionId) qs.set("collectionId", params.collectionId);
  const query = qs.toString();
  return publicFetch(`/products${query ? `?${query}` : ""}`);
};

export const getPublicProduct = async (id) => {
  const res = await publicFetch(`/products/${id}`);
  return res;
};
export const getPublicCategories = () => publicFetch("/categories");
export const getPublicCollections = () => publicFetch("/collections");

export { imageUrl } from "./api";
