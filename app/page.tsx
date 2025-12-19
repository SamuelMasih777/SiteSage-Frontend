"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getStoredToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Search, Zap, BarChart, Brain } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Search className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">SiteSage</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-block">
            <div className="text-sm font-medium text-primary mb-4 tracking-wide">AUTOMATED SEO ANALYZER</div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            Ship better SEO. <span className="text-primary">Faster.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Analyze website performance with AI-powered insights. Get actionable recommendations to optimize your site's
            search engine visibility.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="h-12 px-8 cursor-pointer">
              <Link href="/signup">Start Analyzing</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 bg-transparent cursor-pointer">
              <Link href="/signin">Sign in</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20">
            <div className="cursor-pointer p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Analyze multiple URLs simultaneously with asynchronous processing
              </p>
            </div>

            <div className="cursor-pointer p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get intelligent recommendations powered by advanced language models
              </p>
            </div>

            <div className="cursor-pointer p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Comprehensive Reports</h3>
              <p className="text-sm text-muted-foreground">
                Detailed SEO scores with actionable optimization strategies
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
