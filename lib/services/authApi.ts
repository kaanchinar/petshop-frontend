"use client";

import { api } from "../axios";
import type { LoginRequest } from "../types"; // Assuming LoginRequest will be in lib/types

const API_URL = "/api/Auth";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<string> => { // Assuming the API returns a string token
    const response = await api.post(`${API_URL}/login`, credentials);
    // The OpenAPI spec indicates application/octet-stream, which might be a direct string (e.g., JWT)
    // If it's JSON, this needs to be response.data.token or similar.
    // For now, assuming response.data is the token string itself based on other octet-stream responses.
    return response.data as string;
  },
  // TODO: Add register function if needed
  // register: async (userData: RegisterRequest): Promise<any> => {
  //   const response = await axiosInstance.post(`${API_URL}/register`, userData);
  //   return response.data;
  // },
};
