"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Lightbulb, Users, Save, Download, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface PRDStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

interface PRDData {
  id?: string
  product_name: string
  product_description: string
  target_users: string
  pain_points: string
  user_goals: string
  platform_requirements: string
  technical_stack: string
  integrations: string
  timeline: string
  success_metrics: string
}

const prdSteps: PRDStep[] = [
  {
    id: "overview",
    title: "Product Overview",
    description: "Define your product vision and goals",
    completed: false,
    required: true,
  },
  {
    id: "features",
    title: "Key Features",
    description: "List and prioritize core features",
    completed: false,
    required: true,
  },
  {
    id: "users",
    title: "Target Users",
    description: "Identify your user personas",
    completed: false,
    required: true,
  },
  {
    id: "requirements",
    title: "Technical Requirements",
    description: "Define technical specifications",
    completed: false,
    required: true,
  },
  {
    id: "timeline",
    title: "Timeline & Milestones",
    description: "Set development phases",
    completed: false,
    required: false,
  },
  {
    id: "metrics",
    title: "Success Metrics",
    description: "Define how you'll measure success",
    completed: false,
    required: false,
  },
]

export function PRDCreator() {
  const [currentStep, setCurrentStep] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [prdData, setPrdData] = useState<PRDData>({
    product_name: "",
    product_description: "",
    target_users: "",
    pain_points: "",
    user_goals: "",
    platform_requirements: "",
    technical_stack: "",
    integrations: "",
    timeline: "",
    success_metrics: "",
  })
  const [steps, setSteps] = useState(prdSteps)

  useEffect(() => {
    loadExistingPRD()
  }, [])

  const loadExistingPRD = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: existingPRD } = await supabase
        .from("prds")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single()

      if (existingPRD) {
        setPrdData(existingPRD)
        // Update step completion based on filled data
        updateStepCompletion(existingPRD)
      }
    } catch (error) {
      console.error("Error loading PRD:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStepCompletion = (data: PRDData) => {
    const updatedSteps = steps.map((step) => {
      let completed = false
      switch (step.id) {
        case "overview":
          completed = !!(data.product_name && data.product_description)
          break
        case "users":
          completed = !!(data.target_users && data.pain_points && data.user_goals)
          break
        case "requirements":
          completed = !!(data.platform_requirements && data.technical_stack)
          break
        case "timeline":
          completed = !!data.timeline
          break
        case "metrics":
          completed = !!data.success_metrics
          break
        default:
          completed = step.completed
      }
      return { ...step, completed }
    })
    setSteps(updatedSteps)
  }

  const savePRD = async () => {
    try {
      setSaving(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const prdToSave = {
        ...prdData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      }

      if (prdData.id) {
        // Update existing PRD
        const { error } = await supabase.from("prds").update(prdToSave).eq("id", prdData.id)
      } else {
        // Create new PRD
        const { data, error } = await supabase
          .from("prds")
          .insert([{ ...prdToSave, created_at: new Date().toISOString() }])
          .select()
          .single()

        if (data) {
          setPrdData((prev) => ({ ...prev, id: data.id }))
        }
      }

      updateStepCompletion(prdData)
      toast.success("PRD saved successfully!")
    } catch (error) {
      console.error("Error saving PRD:", error)
      toast.error("Failed to save PRD")
    } finally {
      setSaving(false)
    }
  }

  const exportPRD = async () => {
    try {
      setExporting(true)

      // Create PDF content
      const pdfContent = `
# ${prdData.product_name || "Product Requirements Document"}

## Product Overview
${prdData.product_description || "No description provided"}

## Target Users
${prdData.target_users || "No target users defined"}

## Pain Points
${prdData.pain_points || "No pain points identified"}

## User Goals
${prdData.user_goals || "No user goals defined"}

## Technical Requirements
**Platform:** ${prdData.platform_requirements || "Not specified"}
**Tech Stack:** ${prdData.technical_stack || "Not specified"}
**Integrations:** ${prdData.integrations || "Not specified"}

## Timeline
${prdData.timeline || "No timeline defined"}

## Success Metrics
${prdData.success_metrics || "No metrics defined"}

---
Generated by Bermi Rocket PRD Creator
      `

      // Create and download file
      const blob = new Blob([pdfContent], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${prdData.product_name || "PRD"}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("PRD exported successfully!")
    } catch (error) {
      console.error("Error exporting PRD:", error)
      toast.error("Failed to export PRD")
    } finally {
      setExporting(false)
    }
  }

  const completedSteps = steps.filter((step) => step.completed).length
  const totalSteps = steps.length
  const progress = (completedSteps / totalSteps) * 100

  const getCurrentStepData = () => {
    return steps.find((step) => step.id === currentStep)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "overview":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <Input
                value={prdData.product_name}
                onChange={(e) => setPrdData((prev) => ({ ...prev, product_name: e.target.value }))}
                placeholder="e.g., My Awesome App"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Product Description</label>
              <Textarea
                value={prdData.product_description}
                onChange={(e) => setPrdData((prev) => ({ ...prev, product_description: e.target.value }))}
                placeholder="Describe your product vision and main goals..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        )
      case "users":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Primary User Persona</label>
              <Input
                value={prdData.target_users}
                onChange={(e) => setPrdData((prev) => ({ ...prev, target_users: e.target.value }))}
                placeholder="e.g., Young entrepreneurs aged 18-25"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">User Pain Points</label>
              <Textarea
                value={prdData.pain_points}
                onChange={(e) => setPrdData((prev) => ({ ...prev, pain_points: e.target.value }))}
                placeholder="What problems does your product solve for users?"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">User Goals</label>
              <Textarea
                value={prdData.user_goals}
                onChange={(e) => setPrdData((prev) => ({ ...prev, user_goals: e.target.value }))}
                placeholder="What do users want to achieve with your product?"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        )
      case "requirements":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Platform Requirements</label>
              <Input
                value={prdData.platform_requirements}
                onChange={(e) => setPrdData((prev) => ({ ...prev, platform_requirements: e.target.value }))}
                placeholder="e.g., Mobile app (iOS/Android), Web app"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Technical Stack</label>
              <Textarea
                value={prdData.technical_stack}
                onChange={(e) => setPrdData((prev) => ({ ...prev, technical_stack: e.target.value }))}
                placeholder="What technologies will you use? (React, Node.js, etc.)"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Third-party Integrations</label>
              <Textarea
                value={prdData.integrations}
                onChange={(e) => setPrdData((prev) => ({ ...prev, integrations: e.target.value }))}
                placeholder="Payment systems, APIs, databases, etc."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        )
      case "timeline":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Development Timeline</label>
              <Textarea
                value={prdData.timeline}
                onChange={(e) => setPrdData((prev) => ({ ...prev, timeline: e.target.value }))}
                placeholder="Phase 1: Research (2 weeks)&#10;Phase 2: Design (3 weeks)&#10;Phase 3: Development (8 weeks)..."
                className="mt-1"
                rows={6}
              />
            </div>
          </div>
        )
      case "metrics":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Success Metrics</label>
              <Textarea
                value={prdData.success_metrics}
                onChange={(e) => setPrdData((prev) => ({ ...prev, success_metrics: e.target.value }))}
                placeholder="How will you measure success?&#10;- User acquisition: 1000 users in 3 months&#10;- Engagement: 70% daily active users&#10;- Revenue: $10k MRR by month 6"
                className="mt-1"
                rows={6}
              />
            </div>
          </div>
        )
      default:
        return (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a step to continue building your PRD</p>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                PRD Creator
              </CardTitle>
              <CardDescription>Build your Product Requirements Document step by step</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={savePRD} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save Draft
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={exportPRD} disabled={exporting || !prdData.product_name}>
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{prdData.product_name || "Untitled Product"}</h3>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>
                Progress: {completedSteps}/{totalSteps} steps completed
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Steps Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">PRD Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {steps.map((step) => (
              <Button
                key={step.id}
                variant={currentStep === step.id ? "default" : step.completed ? "secondary" : "outline"}
                className="justify-start h-auto p-3"
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center gap-2">
                    {step.completed ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    ) : (
                      <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    )}
                    <span className="font-medium">{step.title}</span>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getCurrentStepData()?.title}
            <Lightbulb className="h-4 w-4 text-accent" />
          </CardTitle>
          <CardDescription>{getCurrentStepData()?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          <div className="flex gap-2 mt-6">
            <Button className="flex-1" onClick={savePRD} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Continue"
              )}
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-1" />
              Get Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
