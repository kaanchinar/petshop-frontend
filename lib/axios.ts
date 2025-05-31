import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL:  "http://localhost:8080",
  withCredentials: true, // Include HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor - no need to add Authorization header since we use HTTP-only cookies
api.interceptors.request.use(
  (config) => {
    // HTTP-only cookies are automatically included with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login for protected routes that require authentication
      // Don't redirect if we're already on auth pages or for optional auth checks
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const protectedPaths = ['/admin', '/profile', '/orders', '/checkout'];
        const isAuthPage = ['/sign-in', '/sign-up'].includes(currentPath);
        const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path));
        
        // Only redirect if we're on a protected path and not already on an auth page
        if (isProtectedPath && !isAuthPage) {
          window.location.href = "/sign-in";
        }
      }
    }
    return Promise.reject(error);
  }
);

// Custom mutator function for orval
export const customAxios = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return api(config).then((response: AxiosResponse<T>) => response.data);
};

export default customAxios; // /api/auth/me route gives 401 error when trying to get request.