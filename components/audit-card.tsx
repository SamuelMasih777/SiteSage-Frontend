"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Audit } from "@/lib/api"
import {
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  ImageIcon,
  Link2,
  Zap,
  Eye,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AuditCardProps {
  audit: Audit
  onViewDetails?: (audit: Audit) => void
}

export function AuditCard({ audit, onViewDetails }: AuditCardProps) {
  const getStatusIcon = () => {
    switch (audit.status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-accent" />
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />
    }
  }

  const getStatusBadge = () => {
    switch (audit.status) {
      case "completed":
        return <Badge className="bg-accent/10 text-accent border-accent/20">Completed</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        )
    }
  }

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

  const displayScore = audit.seoScore ?? audit.seo_score

  return (
    <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden group">
      <div className="flex items-start justify-between p-6 pb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-1">{getStatusIcon()}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                {audit.url}
              </h3>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatDistanceToNow(new Date(audit.created_at), { addSuffix: true })}</span>
              {audit.pageLoadTimeMs && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-chart-3" />
                    {audit.pageLoadTimeMs}ms
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="space-y-4">
        {audit.status === "completed" && displayScore !== undefined && (
          <>
            <div className={`rounded-xl bg-gradient-to-br ${getScoreGradient(displayScore)} p-6 border border-border/50`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">SEO Health Score</span>
                <span className={`text-4xl font-bold ${getScoreColor(displayScore)}`}>{displayScore}</span>
              </div>
              <Progress value={displayScore} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(audit.pageLoadTimeMs || audit.metrics?.load_time) && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <Zap className="h-4 w-4 text-chart-3" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Speed
                    </div>
                    <div className="text-sm font-medium truncate">
                      {audit.pageLoadTimeMs || audit.metrics?.load_time}ms
                    </div>
                  </div>
                </div>
              )}
              {(audit.imagesWithoutAlt !== undefined || audit.metrics?.images_without_alt !== undefined) && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Alt Tags
                    </div>
                    <div className="text-sm font-medium">
                      {(audit.imagesWithoutAlt ?? audit.metrics?.images_without_alt)} missing
                    </div>
                  </div>
                </div>
              )}
              {audit.internalLinks !== undefined && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <Link2 className="h-4 w-4 text-accent" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Internal Links
                    </div>
                    <div className="text-sm font-medium">{audit.internalLinks}</div>
                  </div>
                </div>
              )}
              {audit.externalLinks !== undefined && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <ExternalLink className="h-4 w-4 text-chart-4" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      External Links
                    </div>
                    <div className="text-sm font-medium">{audit.externalLinks}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent hover:bg-muted/50"
                onClick={() => window.open(audit.url, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit
              </Button>
              {onViewDetails && (
                <Button size="sm" className="flex-1 shadow-sm" onClick={() => onViewDetails(audit)}>
                  View Details
                </Button>
              )}
            </div>
          </>
        )}

        {audit.status === "failed" && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-destructive mb-1">Analysis Failed</p>
              <p className="text-sm text-muted-foreground">
                {audit.errorMessage || "An error occurred during analysis"}
              </p>
            </div>
          </div>
        )}

        {audit.status === "pending" && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <Clock className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              Your audit is being processed. This may take a few minutes...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
