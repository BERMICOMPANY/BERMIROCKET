"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Target, Lightbulb, RefreshCw } from "lucide-react"
import { generateFinancialInsights, generateLearningPath } from "@/lib/groq-ai"

interface AIInsightsCardProps {
  type: "financial" | "learning" | "business"
  userData?: any
  className?: string
}

export function AIInsightsCard({ type, userData, className }: AIInsightsCardProps) {
  const [insights, setInsights] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const generateInsights = async () => {
    setIsLoading(true)
    try {
      let result = ""

      switch (type) {
        case "financial":
          result = await generateFinancialInsights(userData)
          break
        case "learning":
          result = await generateLearningPath(
            userData?.goals || "Become a successful entrepreneur",
            userData?.skills || [],
            userData?.interests || [],
          )
          break
        case "business":
          result = "Business insights coming soon..."
          break
      }

      setInsights(result)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error generating insights:", error)
      setInsights("Unable to generate insights at the moment. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userData && !insights) {
      generateInsights()
    }
  }, [userData, type])

  const getCardConfig = () => {
    switch (type) {
      case "financial":
        return {
          title: "AI Financial Insights",
          description: "Personalized financial guidance from PESA Coach",
          icon: TrendingUp,
          color: "text-green-500",
        }
      case "learning":
        return {
          title: "AI Learning Path",
          description: "Customized learning recommendations",
          icon: Target,
          color: "text-blue-500",
        }
      case "business":
        return {
          title: "AI Business Advisor",
          description: "Strategic business insights",
          icon: Lightbulb,
          color: "text-purple-500",
        }
    }
  }

  const config = getCardConfig()
  const Icon = config.icon

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <CardTitle className="text-sm">{config.title}</CardTitle>
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </div>
          <Button variant="ghost" size="sm" onClick={generateInsights} disabled={isLoading} className="h-8 w-8 p-0">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription className="text-xs">{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        ) : insights ? (
          <div className="space-y-3">
            <div className="text-sm text-foreground whitespace-pre-wrap">{insights}</div>
            {lastUpdated && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Updated {lastUpdated.toLocaleTimeString()}
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">Click refresh to generate AI insights</div>
        )}
      </CardContent>
    </Card>
  )
}
