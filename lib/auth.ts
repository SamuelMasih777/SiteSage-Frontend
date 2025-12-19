"use client"

export interface User {
  id: string
  email: string
}

export const AUTH_TOKEN_KEY = "sitesage_token"
export const USER_KEY = "sitesage_user"

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function storeAuth(user: User, token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
