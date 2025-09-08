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

// PUBLIC_INTERFACE
export const api = {
  /** Auth endpoints */
  // PUBLIC_INTERFACE
  login: async (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  // PUBLIC_INTERFACE
  signup: async (name, email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  // PUBLIC_INTERFACE
  me: async () => request("/users/me", { method: "GET" }),

  /** Product endpoints */
  // PUBLIC_INTERFACE
  getProducts: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products${q ? `?${q}` : ""}`, { method: "GET" });
  },
  // PUBLIC_INTERFACE
  getProduct: async (id) => request(`/products/${id}`, { method: "GET" }),

  /** Orders */
  // PUBLIC_INTERFACE
  createOrder: async (payload) =>
    request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  // PUBLIC_INTERFACE
  getMyOrders: async () => request("/orders/my", { method: "GET" }),
};
