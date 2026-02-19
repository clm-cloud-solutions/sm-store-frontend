// lib/api.js — API client for the Store Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", "Accept": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || `API error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  getProducts: (category) => apiFetch(`/api/products${category ? `?category=${category}` : ""}`),
  getProduct: (id) => apiFetch(`/api/products/${id}`),
  login: (email, password) => apiFetch("/api/auth", { method: "POST", body: JSON.stringify({ email, password }) }),
  validateCart: (items) => apiFetch("/api/cart/validate", { method: "POST", body: JSON.stringify({ items }) }),
  checkout: (userId, items, shipping) => apiFetch("/api/checkout", { method: "POST", body: JSON.stringify({ userId, items, shipping }) }),
  getOrders: (userId) => apiFetch(`/api/orders?userId=${userId}`),
};
