"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { api, type Audit } from "@/lib/api"
import { getStoredToken } from "@/lib/auth"
import { Loader2, Plus, X, Globe, Sparkles, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AuditCard } from "@/components/audit-card"
import { AuditDetailsModal } from "@/components/audit-details-modal"
import { useAuditPolling } from "@/hooks/use-audit-polling"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DashboardPage() {
  const { toast } = useToast()
  const [urls, setUrls] = useState<string[]>([""])
  const [enableJs, setEnableJs] = useState<"standard" | "with-js">("standard")
  const [analysisType, setAnalysisType] = useState<"standard" | "custom">("standard")
  const [customPrompt, setCustomPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [audits, setAudits] = useState<Audit[]>([])
  const [loadingAudits, setLoadingAudits] = useState(false)
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchAudits = useCallback(async () => {
    setLoadingAudits(true)
    try {
      const token = getStoredToken()
      if (!token) return

      const response = await api.audits.list(token)
      console.log("Audit Response:", response)
      setAudits(response.data)
    } catch (error) {
      console.error("Failed to fetch audits:", error)
    } finally {
      setLoadingAudits(false)
    }
  }, [])

  useAuditPolling({ audits, onUpdate: fetchAudits, interval: 5000 })

  useEffect(() => {
    fetchAudits()
  }, [fetchAudits])

  const addUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, ""])
    }
  }

  const removeUrl = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index))
    }
  }

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const handleViewDetails = (audit: Audit) => {
    setSelectedAudit(audit)
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validUrls = urls.filter((url) => url.trim() !== "")

    if (validUrls.length === 0) {
      toast({
        variant: "destructive",
        title: "No URLs provided",
        description: "Please enter at least one URL to analyze.",
      })
      return
    }

    // Basic URL validation
    const invalidUrls = validUrls.filter((url) => {
      try {
        new URL(url)
        return false
      } catch {
        return true
      }
    })

    if (invalidUrls.length > 0) {
      toast({
        variant: "destructive",
        title: "Invalid URLs",
        description: "Please enter valid URLs (e.g., https://example.com)",
      })
      return
    }

    if (analysisType === "custom" && !customPrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Custom prompt required",
        description: "Please provide a custom AI prompt for analysis.",
      })
      return
    }

    setLoading(true)

    try {
      const token = getStoredToken()
      if (!token) throw new Error("Not authenticated")

      const response = await api.audits.create(
        {
          urls: validUrls,
          crawlerMode: enableJs === "with-js" ? "js" : "standard",
          customPrompt: analysisType === "custom" ? customPrompt : undefined,
          generatePdf: false,
        },
        token,
      )

      toast({
        title: "Analysis started!",
        description: `Processing ${validUrls.length} URL${validUrls.length > 1 ? "s" : ""}. Results will appear below.`,
      })

      fetchAudits()

      // Reset form
      setUrls([""])
      setCustomPrompt("")
      setAnalysisType("standard")
      setEnableJs("standard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Could not start analysis",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">SEO Analysis</h1>
          <p className="text-muted-foreground text-lg">
            Analyze up to 5 URLs and get AI-powered insights to improve your site&apos;s performance
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>New Analysis</CardTitle>
            <CardDescription>Enter the URLs you want to analyze and configure your analysis options</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">URLs to Analyze</Label>
                  <Badge variant="secondary">{urls.length} / 5</Badge>
                </div>

                {urls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => updateUrl(index, e.target.value)}
                        disabled={loading}
                        className="pl-10"
                      />
                    </div>
                    {urls.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUrl(index)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {urls.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addUrl}
                    disabled={loading}
                    className="w-full bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">JavaScript Rendering</Label>
                <TooltipProvider>
                  <RadioGroup value={enableJs} onValueChange={(v) => setEnableJs(v as "standard" | "with-js")}>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer font-normal">
                        <div className="font-medium">Standard</div>
                        <div className="text-sm text-muted-foreground">Analyze static HTML content</div>
                      </Label>
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/10 bg-muted/20 opacity-60 cursor-not-allowed">
                          <RadioGroupItem value="with-js" id="with-js" disabled />
                          <Label htmlFor="with-js" className="flex-1 cursor-not-allowed font-normal">
                            <div className="font-medium flex items-center gap-2">
                              With JavaScript
                              <Badge variant="secondary" className="text-[10px] h-4 px-1">Coming Soon</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">Analyze fully rendered page with JS execution</div>
                          </Label>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>JS Rendering is coming soon!</p>
                      </TooltipContent>
                    </Tooltip>
                  </RadioGroup>
                </TooltipProvider>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Analysis Type</Label>
                <RadioGroup value={analysisType} onValueChange={(v) => setAnalysisType(v as "standard" | "custom")}>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="standard" id="analysis-standard" />
                    <Label htmlFor="analysis-standard" className="flex-1 cursor-pointer font-normal">
                      <div className="font-medium">Standard Analysis</div>
                      <div className="text-sm text-muted-foreground">Comprehensive SEO audit with default metrics</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="custom" id="analysis-custom" />
                    <Label htmlFor="analysis-custom" className="flex-1 cursor-pointer font-normal">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Custom Analysis</span>
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground">Define your own AI analysis criteria</div>
                    </Label>
                  </div>
                </RadioGroup>

                {analysisType === "custom" && (
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="custom-prompt">Custom AI Prompt</Label>
                    <Textarea
                      id="custom-prompt"
                      placeholder="E.g., Focus on e-commerce best practices, analyze product page optimization, check for conversion optimization..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      disabled={loading}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Describe what aspects you want the AI to focus on during analysis
                    </p>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Analysis
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Audits</CardTitle>
                <CardDescription>Your analysis history and results</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={fetchAudits} disabled={loadingAudits}>
                <RefreshCw className={`h-4 w-4 ${loadingAudits ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingAudits ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading audits...</p>
              </div>
            ) : audits.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No audits yet. Start your first analysis above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {audits.map((audit) => (
                  <AuditCard key={audit.id} audit={audit} onViewDetails={handleViewDetails} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AuditDetailsModal audit={selectedAudit} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
