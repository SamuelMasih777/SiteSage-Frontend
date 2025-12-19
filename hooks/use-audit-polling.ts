"use client"

import { useEffect, useRef } from "react"
import type { Audit } from "@/lib/api"

interface UseAuditPollingOptions {
  audits: Audit[]
  onUpdate: () => void
  interval?: number
}

export function useAuditPolling({ audits, onUpdate, interval = 5000 }: UseAuditPollingOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Check if there are any pending audits
    const hasPendingAudits = audits.some((audit) => audit.status === "pending")

    if (hasPendingAudits) {
      timeoutRef.current = setTimeout(() => {
        onUpdate()
      }, interval)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [audits, onUpdate, interval])
}
