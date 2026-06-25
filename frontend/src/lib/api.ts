import type { Dashboard, SignupResult, Teacher, TeacherSort, Token, UserAccount } from "./types";

// Browser code talks to the public URL; server-side rendering can use an internal URL.
const BROWSER_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const SERVER_BASE = process.env.INTERNAL_API_URL ?? BROWSER_BASE;

function baseUrl(): string {
  return typeof window === "undefined" ? SERVER_BASE : BROWSER_BASE;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
  /** Next.js fetch cache hint for server components. */
  cache?: RequestCache;
}

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, cache } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache,
  });

  if (!res.ok) {
    let detail = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") detail = data.detail;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  signup: (input: { email: string; password: string; full_name: string; role?: string }) =>
    apiFetch<SignupResult>("/auth/signup", { method: "POST", body: input }),

  login: (input: { email: string; password: string }) =>
    apiFetch<Token>("/auth/login", { method: "POST", body: input }),

  verifyEmail: (token: string) =>
    apiFetch<UserAccount>("/auth/verify-email", { method: "POST", body: { token } }),

  me: (token: string) => apiFetch<UserAccount>("/auth/me", { token }),

  dashboard: (token: string) => apiFetch<Dashboard>("/me/dashboard", { token }),

  listTeachers: (params: { language?: string; sort?: TeacherSort; q?: string } = {}) => {
    const search = new URLSearchParams();
    if (params.language) search.set("language", params.language);
    if (params.sort) search.set("sort", params.sort);
    if (params.q) search.set("q", params.q);
    const qs = search.toString();
    return apiFetch<Teacher[]>(`/teachers${qs ? `?${qs}` : ""}`, { cache: "no-store" });
  },
};
