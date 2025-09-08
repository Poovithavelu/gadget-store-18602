//
// API client for communicating with FastAPI backend.
// Uses environment variable REACT_APP_API_BASE_URL to build base URL.
//
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

function getAuthToken() {
  try {
    return localStorage.getItem("authToken");
  } catch (e) {
    return null;
  }
}

async function request(path, options = {}) {
  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const resp = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Attempt to parse JSON body when applicable
  let data = null;
  const contentType = resp.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await resp.json().catch(() => null);
  }

  if (!resp.ok) {
    const message = (data && (data.detail || data.message)) || resp.statusText;
    const error = new Error(message || "Request failed");
    error.status = resp.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  /** Auth endpoints */
  // PUBLIC_INTERFACE
  login: async (email, password) => {
    // Try JSON login at /auth/login first
    try {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return data;
    } catch (e) {
      // Fallback to OAuth2 token at /auth/token with form data
      if (e?.status === 404) {
        const form = new URLSearchParams();
        form.set("username", email);
        form.set("password", password);
        return request("/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: form.toString(),
        });
      }
      throw e;
    }
  },
  // PUBLIC_INTERFACE
  signup: async (name, email, password) => {
    // Prefer /auth/register; fallback to /auth/signup if needed
    try {
      return await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, full_name: name }),
      });
    } catch (e) {
      if (e?.status === 404) {
        return request("/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email, password, full_name: name }),
        });
      }
      throw e;
    }
  },
  // PUBLIC_INTERFACE
  me: async () => {
    try {
      return await request("/users/me", { method: "GET" });
    } catch (e) {
      if (e?.status === 404) {
        return request("/auth/me", { method: "GET" });
      }
      throw e;
    }
  },

  /** Product endpoints */
  // PUBLIC_INTERFACE
  getProducts: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const data = await request(`/products${q ? `?${q}` : ""}`, {
      method: "GET",
    });
    // Normalize to array if backend returns {items:[...]} wrapper
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  },
  // PUBLIC_INTERFACE
  getProduct: async (id) => request(`/products/${id}`, { method: "GET" }),

  /** Orders */
  // PUBLIC_INTERFACE
  createOrder: async (payload) =>
    request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  // PUBLIC_INTERFACE
  getMyOrders: async () => {
    // Prefer /orders/my; fall back to /orders if backend doesn't support the first
    try {
      return await request("/orders/my", { method: "GET" });
    } catch (e) {
      if (e?.status === 404) {
        return request("/orders", { method: "GET" });
      }
      throw e;
    }
  },
};
