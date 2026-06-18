import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 12000,
});

export function getApiError(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again."
  );
}
