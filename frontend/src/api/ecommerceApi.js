import { api } from "./client";

export async function getProducts() {
  const response = await api.get("/products");
  return response.data;
}

export async function getProduct(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

export async function createProduct(payload) {
  const response = await api.post("/admin/products", payload);
  return response.data;
}

export async function updateProduct(id, payload) {
  const response = await api.put(`/admin/products/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id) {
  await api.delete(`/admin/products/${id}`);
}

export async function getCart(sessionId) {
  const response = await api.get("/cart", { params: { sessionId } });
  return response.data;
}

export async function addCartItem(payload) {
  const response = await api.post("/cart/items", payload);
  return response.data;
}

export async function updateCartItem(itemId, payload) {
  const response = await api.put(`/cart/items/${itemId}`, payload);
  return response.data;
}

export async function removeCartItem(itemId) {
  await api.delete(`/cart/items/${itemId}`);
}

export async function clearCart(sessionId) {
  await api.delete("/cart", { params: { sessionId } });
}

export async function createOrder(payload) {
  const response = await api.post("/orders", payload);
  return response.data;
}

export async function getOrder(id) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

export async function getOrders() {
  const response = await api.get("/admin/orders");
  return response.data;
}

export async function updateOrderStatus(id, status) {
  const response = await api.put(`/admin/orders/${id}/status`, { status });
  return response.data;
}

export async function getSystemInfo() {
  const response = await api.get("/system/info");
  return response.data;
}

export async function getSystemHealth() {
  const response = await api.get("/system/health");
  return response.data;
}

export async function getSystemVersion() {
  const response = await api.get("/system/version");
  return response.data;
}

export async function generateSystemLoad(durationMs = 3000) {
  const response = await api.get("/system/load", { params: { durationMs } });
  return response.data;
}
