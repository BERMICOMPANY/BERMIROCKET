"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, CheckCircle, Lock, Play, FileText, Users, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Module {
  id: string
  title: string
  description: string
  duration: string
  progress: number
  status: "locked" | "available" | "in-progress" | "completed"
  type: "course" | "quiz" | "project"
  difficulty: "beginner" | "intermediate" | "advanced"
  content?: string
  prerequisites?: string[]
}

export function LearningModules() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Get all courses
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: true })

      if (coursesError) throw coursesError

      // Get user's course progress
      const { data: userCourses, error: userCoursesError } = await supabase
        .from("user_courses")
        .select("*")
        .eq("user_id", user.id)

      if (userCoursesError) throw userCoursesError

      // Combine course data with user progress
      const modulesWithProgress =
        courses?.map((course) => {
          const userCourse = userCourses?.find((uc) => uc.course_id === course.id)
          const progress = userCourse?.progress || 0

          let status: Module["status"] = "available"
          if (progress === 100) status = "completed"
          else if (progress > 0) status = "in-progress"

          return {
            id: course.id,
            title: course.title,
            description: course.description,
            duration: course.duration || "1 hour",
            progress,
            status,
            type: course.type || "course",
            difficulty: course.difficulty || "beginner",
            content: course.content,
            prerequisites: course.prerequisites || [],
          }
        }) || []

      setModules(modulesWithProgress)
    } catch (error) {
      console.error("Error loading modules:", error)
      toast.error("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const enrollInCourse = async (courseId: string) => {
    try {
      setEnrolling(courseId)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase.from("user_courses").upsert({
        user_id: user.id,
        course_id: courseId,
        progress: 0,
        status: "enrolled",
        enrolled_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success("Successfully enrolled in course!")
      loadModules() // Refresh the modules
    } catch (error) {
      console.error("Error enrolling in course:", error)
      toast.error("Failed to enroll in course")
    } finally {
      setEnrolling(null)
    }
  }

  const updateProgress = async (courseId: string, newProgress: number) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase
        .from("user_courses")
        .update({
          progress: newProgress,
          completed_at: newProgress === 100 ? new Date().toISOString() : null,
        })
        .eq("user_id", user.id)
        .eq("course_id", courseId)

      if (error) throw error

      loadModules() // Refresh the modules
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Learning Modules</h2>
        <Badge variant="outline">{modules.length} modules available</Badge>
      </div>

      {modules.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No courses available yet. Check back soon!</p>
          </CardContent>
        </Card>
      ) : (
        modules.map((module) => (
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
                  disabled={module.status === "locked" || enrolling === module.id}
                  className="flex-1"
                  onClick={() => {
                    if (module.status === "available") {
                      enrollInCourse(module.id)
                    } else if (module.status === "in-progress") {
                      // Simulate progress update
                      updateProgress(module.id, Math.min(module.progress + 25, 100))
                    }
                  }}
                >
                  {enrolling === module.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enrolling...
                    </>
                  ) : module.status === "completed" ? (
                    "Review"
                  ) : module.status === "in-progress" ? (
                    "Continue"
                  ) : module.status === "locked" ? (
                    "Locked"
                  ) : (
                    "Start Course"
                  )}
                </Button>
                {module.status !== "locked" && (
                  <Button variant="ghost" size="sm">
                    Preview
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
