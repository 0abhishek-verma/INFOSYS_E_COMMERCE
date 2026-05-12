import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8080";
const TOKEN_KEY = "token";
const USER_KEY = "authUser";

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    if (isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      clearAuth();
      delete config.headers.Authorization;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
    }

    return Promise.reject(error);
  },
);

function mapDecodedToken(decodedToken) {
  if (!decodedToken) {
    return null;
  }

  return {
    email: decodedToken.email ?? decodedToken.sub ?? "",
    name: decodedToken.name ?? "",
    role: decodedToken.role ?? "",
    exp: decodedToken.exp ?? 0,
  };
}

export function decodeToken(token) {
  try {
    return mapDecodedToken(jwtDecode(token));
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function storeAuthToken(token) {
  const user = decodeToken(token);

  if (!user?.email || !user?.role) {
    clearAuth();
    throw new Error("Unable to read login token.");
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
}

export function getStoredUser() {
  const savedUser = localStorage.getItem(USER_KEY);

  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem(USER_KEY);
    }
  }

  const token = getToken();

  if (!token) {
    return null;
  }

  const decodedUser = decodeToken(token);

  if (decodedUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(decodedUser));
  }

  return decodedUser;
}

export function isTokenValid(token = getToken()) {
  const decodedUser = decodeToken(token);

  if (!decodedUser?.exp) {
    return false;
  }

  return decodedUser.exp * 1000 > Date.now();
}

export function getHomeRouteForRole(role) {
  return role === "ADMIN" ? "/admin/products" : "/dashboard";
}

export function getErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (typeof error?.response?.data === "string" && error.response.data.trim()) {
    return error.response.data;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (Array.isArray(error?.response?.data?.errors)) {
    return error.response.data.errors.join(", ");
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export function registerUser(payload) {
  return api.post("/api/users/register", payload);
}

export function verifyRegistrationOtp(payload) {
  return api.post("/api/users/verify-otp", payload);
}

export function loginUser(payload) {
  return api.post("/api/users/login", payload);
}

export function getProducts() {
  return api.get("/api/products");
}

export function searchProducts(filters = {}) {
  const params = {};

  if (filters.name?.trim()) {
    params.name = filters.name.trim();
  }

  if (filters.category?.trim()) {
    params.category = filters.category.trim();
  }

  if (filters.minPrice !== "" && filters.minPrice !== undefined) {
    params.minPrice = Number(filters.minPrice);
  }

  if (filters.maxPrice !== "" && filters.maxPrice !== undefined) {
    params.maxPrice = Number(filters.maxPrice);
  }

  return api.get("/api/products/search", { params });
}

export function getProductById(productId) {
  return api.get(`/api/products/${productId}`);
}

export function addProduct(payload) {
  return api.post("/api/products/add", payload);
}

export function removeProduct(productId) {
  return api.delete(`/api/products/${productId}`);
}

export function getCart() {
  return api.get("/api/cart");
}

export function addCartItem(productId, quantity = 1) {
  return api.post("/api/cart/add", null, {
    params: {
      productId,
      quantity,
    },
  });
}

export function updateCartItem(productId, quantity) {
  return api.put("/api/cart/update", null, {
    params: {
      productId,
      quantity,
    },
  });
}

export function removeCartItem(cartItemId) {
  return api.delete(`/api/cart/${cartItemId}`);
}

export function placeOrder(payload) {
  return api.post("/api/orders/place", payload);
}

export function getMyOrders() {
  return api.get("/api/orders/my");
}
