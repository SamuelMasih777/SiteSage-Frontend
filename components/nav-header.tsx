"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { clearAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export function NavHeader() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    clearAuth()
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    })
    router.push("/")
  }

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Search className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">SiteSage</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout} className="cursor-pointer" >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
