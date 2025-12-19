"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getStoredToken } from "@/lib/auth"
import { NavHeader } from "@/components/nav-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      router.push("/signin")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <NavHeader />
      {children}
    </div>
  )
}
