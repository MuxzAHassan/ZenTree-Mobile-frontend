// [FIX 2026-03-29] Authenticated API client — attaches JWT token to all requests.
// All authenticated API requests should use this client instead of raw fetch().

import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./config";

/**
 * Makes an authenticated API request by automatically attaching
 * the JWT token from AsyncStorage to the Authorization header.
 */
export const apiClient = async (endpoint, options = {}) => {
  const userData = await AsyncStorage.getItem("auth_user");
  const token = userData ? JSON.parse(userData).token : null;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // [FIX 2026-03-29] Prepend /api if the endpoint doesn't already include it
  const url = endpoint.startsWith("/api")
    ? `${BASE_URL}${endpoint}`
    : `${BASE_URL}/api${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized — clear stored auth
  if (response.status === 401) {
    await AsyncStorage.removeItem("auth_user");
  }

  return response;
};

// [FIX 2026-03-29] Convenience methods — return parsed JSON instead of raw Response
export const apiGet = async (endpoint) => {
  const res = await apiClient(endpoint, { method: "GET" });
  return res.json();
};

export const apiPost = async (endpoint, body) => {
  const res = await apiClient(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json();
};

export const apiPut = async (endpoint, body) => {
  const res = await apiClient(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return res.json();
};

export const apiDelete = async (endpoint) => {
  const res = await apiClient(endpoint, { method: "DELETE" });
  return res.json();
};
