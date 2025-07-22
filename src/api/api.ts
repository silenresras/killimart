// src/api/api.ts
import axios from "axios";

// ✅ Use process.env instead of import.meta.env in Next.js
const BASE_API_URL = "https://killimart-online-backend.onrender.com/api";;

if (!BASE_API_URL) {
  throw new Error(" NEXT_PUBLIC_API_URL is not defined in your environment variables.");
}

const AUTH_URL = `${BASE_API_URL}/auth`;
const PRODUCT_URL = BASE_API_URL;
const ORDER_URL = `${BASE_API_URL}/orders`;

const auth_api = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true,
});

const product_api = axios.create({
  baseURL: PRODUCT_URL,
  withCredentials: true,
});

const order_api = axios.create({
  baseURL: ORDER_URL,
  withCredentials: true,
});

// src/api/api.ts  (add to each axios instance)
[auth_api, product_api, order_api].forEach((api) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

export { auth_api, product_api, order_api};
