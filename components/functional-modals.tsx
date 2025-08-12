"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { Target, TrendingUp, Plus, BookOpen, Calendar } from "lucide-react"
import { toast } from "sonner"

interface FunctionalModalsProps {
  user?: any
  profile?: any
  onDataUpdate?: () => void
}

export function FunctionalModals({ user, profile, onDataUpdate }: FunctionalModalsProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [isAddingIncome, setIsAddingIncome] = useState(false)
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isStudying, setIsStudying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const handleAddGoal = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("financial_goals").insert({
        user_id: user?.id,
        title: formData.get("title"),
        description: formData.get("description"),
        target_amount: Number.parseFloat(formData.get("amount") as string),
        target_date: formData.get("target_date"),
        category: formData.get("category"),
        status: "active",
        current_amount: 0,
        created_at: new Date().toISOString(),
      })

      if (error) throw error
      toast.success("Financial goal added successfully!")
      setIsAddingGoal(false)
      onDataUpdate?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to add goal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddIncome = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user?.id,
        type: "income",
        amount: Number.parseFloat(formData.get("amount") as string),
        description: formData.get("description"),
        category: formData.get("category"),
        date: formData.get("date"),
        created_at: new Date().toISOString(),
      })

      if (error) throw error
      toast.success("Income added successfully!")
      setIsAddingIncome(false)
      onDataUpdate?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to add income")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddExpense = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user?.id,
        type: "expense",
        amount: Number.parseFloat(formData.get("amount") as string),
        description: formData.get("description"),
        category: formData.get("category"),
        date: formData.get("date"),
        created_at: new Date().toISOString(),
      })

      if (error) throw error
      toast.success("Expense added successfully!")
      setIsAddingExpense(false)
      onDataUpdate?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to add expense")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnrollCourse = async (formData: FormData) => {
    setIsLoading(true)
    try {
      // First check if course exists, if not create it
      const courseTitle = formData.get("course_title") as string
      let courseId = formData.get("course_id") as string

      if (!courseId && courseTitle) {
        const { data: newCourse, error: courseError } = await supabase
          .from("courses")
          .insert({
            title: courseTitle,
            description: `Self-enrolled course: ${courseTitle}`,
            category: formData.get("category") || "general",
            difficulty: "beginner",
            duration_hours: 10,
            is_active: true,
          })
          .select()
          .single()

        if (courseError) throw courseError
        courseId = newCourse.id
      }

      const { error } = await supabase.from("user_courses").insert({
        user_id: user?.id,
        course_id: courseId,
        status: "enrolled",
        progress: 0,
        enrolled_at: new Date().toISOString(),
      })

      if (error) throw error
      toast.success("Course enrolled successfully!")
      setIsAddingCourse(false)
      onDataUpdate?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll in course")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyOpportunity = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("opportunity_applications").insert({
        user_id: user?.id,
        opportunity_title: formData.get("opportunity_title"),
        opportunity_type: formData.get("opportunity_type"),
        application_text: formData.get("application_text"),
        status: "submitted",
        applied_at: new Date().toISOString(),
      })

      if (error) throw error
      toast.success("Application submitted successfully!")
      setIsApplying(false)
      onDataUpdate?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Add Goal Modal */}
      <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Add Financial Goal
            </DialogTitle>
          </DialogHeader>
          <form action={handleAddGoal} className="space-y-4">
            <div>
              <Label htmlFor="title">Goal Title</Label>
              <Input id="title" name="title" placeholder="Emergency Fund" required />
            </div>
            <div>
              <Label htmlFor="amount">Target Amount ({profile?.currency || "USD"})</Label>
              <Input id="amount" name="amount" type="number" placeholder="5000" required />
            </div>
            <div>
              <Label htmlFor="target_date">Target Date</Label>
              <Input id="target_date" name="target_date" type="date" required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency Fund</SelectItem>
                  <SelectItem value="business">Business Investment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Goal details..." />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Goal"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingGoal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Income Modal */}
      <Dialog open={isAddingIncome} onOpenChange={setIsAddingIncome}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Add Income
            </DialogTitle>
          </DialogHeader>
          <form action={handleAddIncome} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ({profile?.currency || "USD"})</Label>
              <Input id="amount" name="amount" type="number" placeholder="1000" required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Freelance work" required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Income"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingIncome(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Expense Modal */}
      <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-red-600" />
              Add Expense
            </DialogTitle>
          </DialogHeader>
          <form action={handleAddExpense} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ({profile?.currency || "USD"})</Label>
              <Input id="amount" name="amount" type="number" placeholder="50" required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Lunch" required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="transport">Transportation</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Expense"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingExpense(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Course Modal */}
      <Dialog open={isAddingCourse} onOpenChange={setIsAddingCourse}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Enroll in Course
            </DialogTitle>
          </DialogHeader>
          <form action={handleEnrollCourse} className="space-y-4">
            <div>
              <Label htmlFor="course_title">Course Title</Label>
              <Input id="course_title" name="course_title" placeholder="Business Fundamentals" required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Enrolling..." : "Enroll"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingCourse(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Apply for Opportunity Modal */}
      <Dialog open={isApplying} onOpenChange={setIsApplying}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Apply for Opportunity
            </DialogTitle>
          </DialogHeader>
          <form action={handleApplyOpportunity} className="space-y-4">
            <div>
              <Label htmlFor="opportunity_title">Opportunity Title</Label>
              <Input
                id="opportunity_title"
                name="opportunity_title"
                placeholder="Software Developer Internship"
                required
              />
            </div>
            <div>
              <Label htmlFor="opportunity_type">Type</Label>
              <Select name="opportunity_type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="grant">Grant</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="application_text">Application/Cover Letter</Label>
              <Textarea
                id="application_text"
                name="application_text"
                placeholder="Why are you interested in this opportunity?"
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsApplying(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Study Session Modal */}
      <Dialog open={isStudying} onOpenChange={setIsStudying}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Start Study Session
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Ready to start your learning mission?</p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  setIsStudying(false)
                  // This would typically navigate to a study session
                  toast.success("Study session started! 🚀")
                }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
              <Button variant="outline" onClick={() => setIsStudying(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden trigger buttons for sidebar to use */}
      <div className="hidden">
        <Button onClick={() => setIsAddingGoal(true)} id="add-goal-trigger" />
        <Button onClick={() => setIsAddingIncome(true)} id="add-income-trigger" />
        <Button onClick={() => setIsAddingExpense(true)} id="add-expense-trigger" />
        <Button onClick={() => setIsAddingCourse(true)} id="add-course-trigger" />
        <Button onClick={() => setIsApplying(true)} id="apply-trigger" />
        <Button onClick={() => setIsStudying(true)} id="study-trigger" />
      </div>
    </>
  )
}
