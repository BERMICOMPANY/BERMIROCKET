"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { Target, TrendingUp, Plus } from "lucide-react"
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

  const supabase = createClient()

  const handleAddGoal = async (formData: FormData) => {
    try {
      const { error } = await supabase.from("financial_goals").insert({
        user_id: user?.id,
        title: formData.get("title"),
        description: formData.get("description"),
        target_amount: Number.parseFloat(formData.get("amount") as string),
        target_date: formData.get("target_date"),
        category: formData.get("category"),
        status: "active",
      })

      if (error) throw error
      toast.success("Financial goal added successfully!")
      setIsAddingGoal(false)
      onDataUpdate?.()
    } catch (error) {
      toast.error("Failed to add goal")
    }
  }

  const handleAddIncome = async (formData: FormData) => {
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user?.id,
        type: "income",
        amount: Number.parseFloat(formData.get("amount") as string),
        description: formData.get("description"),
        category: formData.get("category"),
        date: formData.get("date"),
      })

      if (error) throw error
      toast.success("Income added successfully!")
      setIsAddingIncome(false)
      onDataUpdate?.()
    } catch (error) {
      toast.error("Failed to add income")
    }
  }

  const handleAddExpense = async (formData: FormData) => {
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user?.id,
        type: "expense",
        amount: Number.parseFloat(formData.get("amount") as string),
        description: formData.get("description"),
        category: formData.get("category"),
        date: formData.get("date"),
      })

      if (error) throw error
      toast.success("Expense added successfully!")
      setIsAddingExpense(false)
      onDataUpdate?.()
    } catch (error) {
      toast.error("Failed to add expense")
    }
  }

  const handleAddCourse = async (formData: FormData) => {
    try {
      const { error } = await supabase.from("user_courses").insert({
        user_id: user?.id,
        course_id: formData.get("course_id"),
        status: "enrolled",
        enrolled_at: new Date().toISOString(),
      })

      if (error) throw error
      toast.success("Course enrolled successfully!")
      setIsAddingCourse(false)
      onDataUpdate?.()
    } catch (error) {
      toast.error("Failed to enroll in course")
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
              <Label htmlFor="amount">Target Amount</Label>
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
              <Button type="submit" className="flex-1">
                Add Goal
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
              <Label htmlFor="amount">Amount</Label>
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
              <Button type="submit" className="flex-1">
                Add Income
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
              <Label htmlFor="amount">Amount</Label>
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
              <Button type="submit" className="flex-1">
                Add Expense
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingExpense(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Expose functions for sidebar to use */}
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

// Export functions for sidebar to use
export const triggerAddGoal = () => document.getElementById("add-goal-trigger")?.click()
export const triggerAddIncome = () => document.getElementById("add-income-trigger")?.click()
export const triggerAddExpense = () => document.getElementById("add-expense-trigger")?.click()
export const triggerAddCourse = () => document.getElementById("add-course-trigger")?.click()
export const triggerApply = () => document.getElementById("apply-trigger")?.click()
export const triggerStudy = () => document.getElementById("study-trigger")?.click()
