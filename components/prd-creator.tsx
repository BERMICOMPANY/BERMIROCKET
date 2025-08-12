"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Lightbulb, Users, Save, Download } from "lucide-react"

interface PRDStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
}

const prdSteps: PRDStep[] = [
  {
    id: "overview",
    title: "Product Overview",
    description: "Define your product vision and goals",
    completed: true,
    required: true,
  },
  {
    id: "features",
    title: "Key Features",
    description: "List and prioritize core features",
    completed: true,
    required: true,
  },
  { id: "users", title: "Target Users", description: "Identify your user personas", completed: false, required: true },
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
  const [currentStep, setCurrentStep] = useState("users")
  const [productName, setProductName] = useState("My Awesome App")
  const [productDescription, setProductDescription] = useState("")

  const completedSteps = prdSteps.filter((step) => step.completed).length
  const totalSteps = prdSteps.length
  const progress = (completedSteps / totalSteps) * 100

  const getCurrentStepData = () => {
    return prdSteps.find((step) => step.id === currentStep)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "users":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Primary User Persona</label>
              <Input placeholder="e.g., Young entrepreneurs aged 18-25" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">User Pain Points</label>
              <Textarea placeholder="What problems does your product solve for users?" className="mt-1" rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium">User Goals</label>
              <Textarea placeholder="What do users want to achieve with your product?" className="mt-1" rows={3} />
            </div>
          </div>
        )
      case "requirements":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Platform Requirements</label>
              <Input placeholder="e.g., Mobile app (iOS/Android), Web app" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Technical Stack</label>
              <Textarea
                placeholder="What technologies will you use? (React, Node.js, etc.)"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Third-party Integrations</label>
              <Textarea placeholder="Payment systems, APIs, databases, etc." className="mt-1" rows={3} />
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
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save Draft
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="text-lg font-semibold"
                placeholder="Product Name"
              />
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
            {prdSteps.map((step) => (
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
            <Button className="flex-1">Save & Continue</Button>
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
