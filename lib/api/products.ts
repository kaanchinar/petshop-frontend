import axios from "axios";
import type { Product } from "../types";
import { env } from "../env";

const API_BASE = `${env.NEXT_PUBLIC_API_URL}/api/Products`;

export async function getAllProducts(): Promise<Product[]> {
  const res = await axios.get<Product[]>(API_BASE);
  return res.data;
}

export async function getProductById(id: string): Promise<Product> {
  const res = await axios.get<Product>(`${API_BASE}/${id}`);
  return res.data;
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const res = await axios.get<Product[]>(`${API_BASE}/category/${category}`);
  return res.data;
}


