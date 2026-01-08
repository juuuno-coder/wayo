import { API_BASE_URL } from "@/config";

const BASE_URL = API_BASE_URL;

const getHeaders = () => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token"); // Assuming token is stored as 'token'
    if (token) {
      headers["Authorization"] = `Bearer ${token}`; // Adjust if needed (e.g., just token)
    }
  }
  return headers;
};

export const api = {
  get: async <T = unknown>(endpoint: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `GET request failed: ${res.status}`);
    }
    return res.json();
  },

  post: async <T = unknown, U = unknown>(
    endpoint: string,
    body: U
  ): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `POST request failed: ${res.status}`);
    }
    return res.json();
  },

  put: async <T = unknown, U = unknown>(
    endpoint: string,
    body: U
  ): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `PUT request failed: ${res.status}`);
    }
    return res.json();
  },

  delete: async <T = unknown>(endpoint: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `DELETE request failed: ${res.status}`
      );
    }
    return res.json();
  },
};
