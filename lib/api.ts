const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface SignupRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

export type AuthResponse = ApiResponse<{
  user: {
    id: string
    email: string
  }
  token: string
}>

export interface AuditRequest {
  urls: string[]
  crawlerMode: "standard" | "js"
  customPrompt?: string
  generatePdf?: boolean
}

export interface Audit {
  id: string
  url: string
  status: "pending" | "completed" | "failed"
  created_at: string
  completed_at?: string
  errorMessage?: string

  // New SEO Fields
  seoScore?: number
  title?: string
  metaDescription?: string
  h1Tags?: string[]
  h2Tags?: string[]
  imagesTotal?: number
  imagesWithoutAlt?: number
  internalLinks?: number
  externalLinks?: number
  pageLoadTimeMs?: number
  issues?: string[]
  suggestions?: string[]
  summary?: string
  pdfUrl?: string | null

  // Legacy fields (for backward compatibility if needed)
  seo_score?: number
  metrics?: {
    title?: string
    meta_description?: string
    h1_count?: number
    images_without_alt?: number
    broken_links?: number
    load_time?: number
    accessibility_score?: number
  }
  insights?: {
    summary?: string
    recommendations?: string[]
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit, token?: string): Promise<T> {
  const headers = new Headers(options?.headers)

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(response.status, errorText || "An error occurred")
  }

  return response.json()
}

export const api = {
  auth: {
    signup: (data: SignupRequest) =>
      fetchApi<AuthResponse>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data: LoginRequest) =>
      fetchApi<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  audits: {
    create: (data: AuditRequest, token: string) =>
      fetchApi<ApiResponse<Audit[]>>(
        "/api/audits",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        token,
      ),
    list: (token: string) => fetchApi<ApiResponse<Audit[]>>("/api/audits", {}, token),
    get: (id: string, token: string) => fetchApi<ApiResponse<Audit>>(`/api/audits/${id}`, {}, token),
  },
}
