"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, CheckCircle, Lock, Play, FileText, Users } from "lucide-react"

interface Module {
  id: string
  title: string
  description: string
  duration: string
  progress: number
  status: "locked" | "available" | "in-progress" | "completed"
  type: "course" | "quiz" | "project"
  difficulty: "beginner" | "intermediate" | "advanced"
}

const modules: Module[] = [
  {
    id: "1",
    title: "Business Fundamentals",
    description: "Learn the basics of entrepreneurship and business planning",
    duration: "2 hours",
    progress: 100,
    status: "completed",
    type: "course",
    difficulty: "beginner",
  },
  {
    id: "2",
    title: "AI Basics for Entrepreneurs",
    description: "Understanding AI and how to leverage it in your business",
    duration: "1.5 hours",
    progress: 75,
    status: "in-progress",
    type: "course",
    difficulty: "beginner",
  },
  {
    id: "3",
    title: "Product Development Quiz",
    description: "Test your knowledge on product creation and development",
    duration: "30 mins",
    progress: 0,
    status: "available",
    type: "quiz",
    difficulty: "intermediate",
  },
  {
    id: "4",
    title: "Create Your First PRD",
    description: "Guided project to build a Product Requirements Document",
    duration: "3 hours",
    progress: 0,
    status: "available",
    type: "project",
    difficulty: "intermediate",
  },
  {
    id: "5",
    title: "Advanced Marketing Strategies",
    description: "Deep dive into digital marketing and growth hacking",
    duration: "2.5 hours",
    progress: 0,
    status: "locked",
    type: "course",
    difficulty: "advanced",
  },
]

export function LearningModules() {
  const getStatusIcon = (status: Module["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Play className="h-4 w-4 text-primary" />
      case "locked":
        return <Lock className="h-4 w-4 text-muted-foreground" />
      default:
        return <BookOpen className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTypeIcon = (type: Module["type"]) => {
    switch (type) {
      case "quiz":
        return <FileText className="h-4 w-4" />
      case "project":
        return <Users className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: Module["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Learning Modules</h2>
        <Badge variant="outline">5 modules available</Badge>
      </div>

      {modules.map((module) => (
        <Card
          key={module.id}
          className={`transition-all duration-200 ${module.status === "locked" ? "opacity-60" : "hover:shadow-md"}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getTypeIcon(module.type)}
                <CardTitle className="text-base">{module.title}</CardTitle>
                {getStatusIcon(module.status)}
              </div>
              <Badge className={getDifficultyColor(module.difficulty)} variant="secondary">
                {module.difficulty}
              </Badge>
            </div>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {module.duration}
              </div>
              <div className="flex items-center gap-1">
                <span>{module.progress}% complete</span>
              </div>
            </div>

            {module.progress > 0 && <Progress value={module.progress} className="h-2" />}

            <div className="flex gap-2">
              <Button
                variant={module.status === "in-progress" ? "default" : "outline"}
                size="sm"
                disabled={module.status === "locked"}
                className="flex-1"
              >
                {module.status === "completed"
                  ? "Review"
                  : module.status === "in-progress"
                    ? "Continue"
                    : module.status === "locked"
                      ? "Locked"
                      : "Start"}
              </Button>
              {module.status !== "locked" && (
                <Button variant="ghost" size="sm">
                  Preview
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
