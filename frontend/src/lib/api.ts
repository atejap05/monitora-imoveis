import type { Property } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const PROPERTIES_ENDPOINT = "/api/properties";

export type GetTokenFn = () => Promise<string | null>;

function parseErrorDetail(payload: unknown): string {
  if (typeof payload !== "object" || payload === null || !("detail" in payload)) {
    return "Erro na requisição";
  }
  const detail = (payload as { detail: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) =>
        typeof item === "object" && item !== null && "msg" in item
          ? String((item as { msg: unknown }).msg)
          : JSON.stringify(item),
      )
      .join(", ");
  }
  return "Erro na requisição";
}

async function authHeader(getToken: GetTokenFn): Promise<HeadersInit> {
  const token = await getToken();
  if (!token) {
    throw new Error("Sessão expirada ou indisponível. Faça login novamente.");
  }
  return { Authorization: `Bearer ${token}` };
}

export async function fetcher<T>(
  url: string,
  getToken: GetTokenFn,
): Promise<T> {
  const headers = await authHeader(getToken);
  const res = await fetch(`${API_BASE}${url}`, { headers });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Não autorizado. Faça login novamente.");
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(parseErrorDetail(err));
  }
  return res.json() as Promise<T>;
}

export async function fetchProperties(getToken: GetTokenFn): Promise<Property[]> {
  return fetcher<Property[]>(PROPERTIES_ENDPOINT, getToken);
}

export async function addProperty(
  url: string,
  getToken: GetTokenFn,
): Promise<Property> {
  const headers = {
    "Content-Type": "application/json",
    ...(await authHeader(getToken)),
  };
  const res = await fetch(`${API_BASE}/api/properties`, {
    method: "POST",
    headers,
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Não autorizado. Faça login novamente.");
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(parseErrorDetail(err));
  }
  return res.json() as Promise<Property>;
}

export async function deleteProperty(
  id: number,
  getToken: GetTokenFn,
): Promise<void> {
  const headers = await authHeader(getToken);
  const res = await fetch(`${API_BASE}/api/properties/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Não autorizado. Faça login novamente.");
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(parseErrorDetail(err));
  }
}
