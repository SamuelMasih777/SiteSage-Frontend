"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Audit } from "@/lib/api"
import {
  CheckCircle2,
  Lightbulb,
  ExternalLink,
  AlertTriangle,
  Zap,
  ImageIcon,
  Link2,
  FileText,
  BarChart3,
  Search,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuditDetailsModalProps {
  audit: Audit | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuditDetailsModal({ audit, open, onOpenChange }: AuditDetailsModalProps) {
  if (!audit) return null

  const displayScore = audit.seoScore ?? audit.seo_score ?? 0

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent"
    if (score >= 60) return "text-chart-3"
    return "text-destructive"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-accent/20 to-accent/5"
    if (score >= 60) return "from-chart-3/20 to-chart-3/5"
    return "from-destructive/20 to-destructive/5"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-2xl border-border shadow-2xl">
        <DialogHeader className="p-4 sm:p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <DialogTitle className="text-xl sm:text-2xl font-bold truncate">
                {audit.url}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-xs sm:text-sm">
                Audit Report • {new Date(audit.created_at).toLocaleDateString()}
              </DialogDescription>
            </div>
            <div className={`text-2xl sm:text-4xl font-black ${getScoreColor(displayScore)} px-3 py-1 sm:px-4 sm:py-2 rounded-xl bg-muted/50 border border-border/50 shrink-0`}>
              {displayScore}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 sm:px-6 border-b shrink-0 overflow-x-auto no-scrollbar">
            <TabsList className="flex w-max justify-start bg-transparent h-12 gap-4 sm:gap-6 p-0">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 sm:px-2 h-12 shadow-none text-xs sm:text-sm whitespace-nowrap">Overview</TabsTrigger>
              <TabsTrigger value="insights" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 sm:px-2 h-12 shadow-none text-xs sm:text-sm whitespace-nowrap">AI Insights</TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 sm:px-2 h-12 shadow-none text-xs sm:text-sm whitespace-nowrap">Content & Tags</TabsTrigger>
              <TabsTrigger value="links" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 sm:px-2 h-12 shadow-none text-xs sm:text-sm whitespace-nowrap">Links & Images</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="flex-1 flex flex-col overflow-y-auto m-0 data-[state=active]:flex group/tab">
            <ScrollArea className="flex-1">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Score Section */}
                <div className={`rounded-2xl bg-gradient-to-br ${getScoreGradient(displayScore)} p-6 sm:p-8 border border-border/50 shadow-sm`}>
                  <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center text-center md:text-left">
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex items-center justify-center">
                      <svg className="h-full w-full -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="44%"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-muted/20"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="44%"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray={364}
                          strokeDashoffset={364 - (364 * displayScore) / 100}
                          className={`${getScoreColor(displayScore)} transition-all duration-1000 ease-out`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className={`absolute text-2xl sm:text-4xl font-black ${getScoreColor(displayScore)}`}>
                        {displayScore}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold">SEO Health Score</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {audit.summary || (displayScore >= 80
                          ? "Excellent! Website is well optimized for search engines."
                          : displayScore >= 60
                            ? "Website has good SEO foundations, but there's room for improvement."
                            : "Website needs significant optimization to rank better.")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-xl border border-border/50 bg-card/50 space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Speed</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold">{audit.pageLoadTimeMs || audit.metrics?.load_time || 0}ms</div>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl border border-border/50 bg-card/50 space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Images</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold">{audit.imagesTotal || 0}</div>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl border border-border/50 bg-card/50 space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Link2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Links</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold">{(audit.internalLinks || 0) + (audit.externalLinks || 0)}</div>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl border border-border/50 bg-card/50 space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Alt Tags</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-destructive">{audit.imagesWithoutAlt || 0}</div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="insights" className="flex-1 flex flex-col overflow-y-auto m-0 data-[state=active]:flex group/tab">
            <ScrollArea className="flex-1">
              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Issues Section */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                      Technical Issues
                    </h4>
                    <div className="space-y-2">
                      {audit.issues && audit.issues.length > 0 ? (
                        audit.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive mt-0.5 shrink-0" />
                            <p className="text-xs sm:text-sm text-destructive-foreground font-medium text-pretty">{issue}</p>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-3 p-4 sm:p-6 rounded-xl border border-accent/20 bg-accent/5">
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-accent shrink-0" />
                          <p className="text-xs sm:text-sm text-accent font-medium">No major issues detected!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggestions Section */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-chart-3" />
                      Optimization Tips
                    </h4>
                    <div className="space-y-2">
                      {(audit.suggestions || audit.insights?.recommendations)?.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-border/50 bg-card/50">
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-chart-3 mt-1 shrink-0" />
                          <p className="text-xs sm:text-sm text-muted-foreground text-pretty">{tip}</p>
                        </div>
                      )) || (
                          <p className="text-xs sm:text-sm text-muted-foreground italic">No suggestions available.</p>
                        )}
                    </div>
                  </div>
                </div>

                {/* AI Summary Section moved into AI Insights */}
                {audit.summary && (
                  <div className="space-y-3 border-t pt-6">
                    <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-chart-3" />
                      AI Summary
                    </h4>
                    <div className="p-4 sm:p-5 rounded-xl border border-border/50 bg-muted/30 leading-relaxed text-xs sm:text-sm text-pretty">
                      {audit.summary}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="content" className="flex-1 flex flex-col overflow-y-auto m-0 data-[state=active]:flex group/tab">
            <ScrollArea className="flex-1">
              <div className="p-4 sm:p-6 space-y-6">
                <div className="space-y-4">
                  <div className="p-4 sm:p-6 rounded-xl border border-border/50 bg-card space-y-3 sm:space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-[10px] sm:text-sm uppercase tracking-wider text-muted-foreground">Page Title</h4>
                      <p className="text-base sm:text-lg font-medium text-pretty">{audit.title || audit.metrics?.title || "Not found"}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[10px] sm:text-sm uppercase tracking-wider text-muted-foreground">Meta Description</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                        {audit.metaDescription || audit.metrics?.meta_description || "Not found"}
                      </p>
                    </div>
                  </div>

                  {/* Header Tags */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      Header Tags
                    </h4>

                    <Accordion type="single" collapsible className="w-full space-y-2">
                      <AccordionItem value="h1" className="border rounded-xl px-3 sm:px-4 bg-muted/20">
                        <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[10px] sm:text-xs">H1</Badge>
                            <span className="text-xs sm:text-sm font-medium">Main Headings ({audit.h1Tags?.length || 0})</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-4 space-y-2">
                          {audit.h1Tags && audit.h1Tags.length > 0 ? (
                            audit.h1Tags.map((tag, i) => (
                              <div key={i} className="text-xs sm:text-sm p-2 sm:p-3 rounded-lg bg-background border border-border/50 text-pretty">
                                {tag.trim()}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground italic">No H1 tags found.</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="h2" className="border rounded-xl px-3 sm:px-4 bg-muted/20">
                        <AccordionTrigger className="hover:no-underline py-3 sm:py-4">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[10px] sm:text-xs">H2</Badge>
                            <span className="text-xs sm:text-sm font-medium">Subheadings ({audit.h2Tags?.length || 0})</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-4 space-y-2">
                          {audit.h2Tags && audit.h2Tags.length > 0 ? (
                            audit.h2Tags.map((tag, i) => (
                              <div key={i} className="text-xs sm:text-sm p-2 sm:p-3 rounded-lg bg-background border border-border/50 text-pretty">
                                {tag.trim()}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground italic">No H2 tags found.</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="links" className="flex-1 flex flex-col overflow-y-auto m-0 data-[state=active]:flex group/tab">
            <ScrollArea className="flex-1">
              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Links Section */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                      Link Structure
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border/50 bg-card">
                        <span className="text-xs sm:text-sm font-medium">Internal Links</span>
                        <span className="text-lg sm:text-xl font-bold text-accent">{audit.internalLinks || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border/50 bg-card">
                        <span className="text-xs sm:text-sm font-medium">External Links</span>
                        <span className="text-lg sm:text-xl font-bold text-chart-4">{audit.externalLinks || 0}</span>
                      </div>
                      {audit.metrics?.broken_links !== undefined && (
                        <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border/50 bg-card">
                          <span className="text-xs sm:text-sm font-medium">Broken Links</span>
                          <span className={`text-lg sm:text-xl font-bold ${audit.metrics.broken_links > 0 ? "text-destructive" : "text-accent"}`}>
                            {audit.metrics.broken_links}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Images Section */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      Image Optimization
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border/50 bg-card">
                        <span className="text-xs sm:text-sm font-medium">Total Images</span>
                        <span className="text-lg sm:text-xl font-bold">{audit.imagesTotal || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border/50 bg-card">
                        <span className="text-xs sm:text-sm font-medium">Missing Alt Text</span>
                        <span className={`text-lg sm:text-xl font-bold ${audit.imagesWithoutAlt && audit.imagesWithoutAlt > 0 ? "text-destructive" : "text-accent"}`}>
                          {audit.imagesWithoutAlt || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="p-4 sm:p-6 border-t bg-muted/20 shrink-0">
          <div className="flex w-full gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-background text-xs sm:text-sm h-9 sm:h-10 px-2 sm:px-4"
              onClick={() => window.open(audit.url, "_blank")}
            >
              <ExternalLink className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Visit Site
            </Button>
            {audit.pdfUrl && (
              <Button
                className="flex-1 text-xs sm:text-sm h-9 sm:h-10 px-2 sm:px-4"
                onClick={() => window.open(audit.pdfUrl!, "_blank")}
              >
                <FileText className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Download PDF
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
