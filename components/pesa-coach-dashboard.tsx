"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import {
  DollarSign,
  TrendingUp,
  Target,
  PlusCircle,
  Wallet,
  BookOpen,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export function PESACoachDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [financialData, setFinancialData] = useState({
    totalSavings: 0,
    monthlyIncome: 0,
    currency: "USD",
    goals: [],
    transactions: [],
    savingsGroups: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFinancialData()
  }, [])

  const loadFinancialData = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    try {
      // Get user profile for currency
      const { data: profile } = await supabase.from("profiles").select("currency").eq("id", user.id).single()

      // Get transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      // Get financial goals
      const { data: goals } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")

      // Get savings groups
      const { data: savingsGroups } = await supabase
        .from("savings_groups")
        .select("*, user_savings_groups!inner(*)")
        .eq("user_savings_groups.user_id", user.id)

      // Calculate totals
      const income = transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0) || 0
      const expenses = transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0) || 0
      const savings = income - expenses

      setFinancialData({
        totalSavings: savings,
        monthlyIncome: income,
        currency: profile?.currency || "USD",
        goals: goals || [],
        transactions: transactions || [],
        savingsGroups: savingsGroups || [],
      })
    } catch (error) {
      console.error("Error loading financial data:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Savings</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {financialData.currency} {financialData.totalSavings}
            </p>
            <p className="text-xs text-muted-foreground">
              {financialData.totalSavings > 0 ? "Growing steadily" : "Start saving today"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Monthly Income</span>
            </div>
            <p className="text-2xl font-bold text-accent">
              {financialData.currency} {financialData.monthlyIncome}
            </p>
            <p className="text-xs text-muted-foreground">
              From {financialData.transactions.filter((t) => t.type === "income").length} sources
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Savings Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {financialData.goals.length > 0 ? (
            financialData.goals.map((goal: any) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {financialData.currency} {goal.current_amount || 0} / {goal.target_amount}
                  </span>
                </div>
                <Progress value={((goal.current_amount || 0) / goal.target_amount) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {financialData.currency} {goal.target_amount - (goal.current_amount || 0)} to go • Target:{" "}
                  {new Date(goal.target_date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No active goals. Set your first savings goal to get started!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {financialData.transactions.length > 0 ? (
            financialData.transactions.slice(0, 5).map((transaction: any) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                  </div>
                </div>
                <span className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {financialData.currency} {transaction.amount}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No transactions yet. Start tracking your income and expenses!
            </p>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">
            {financialData.totalSavings > 0
              ? `Great progress! You're building your savings. Consider setting up automatic transfers to reach your goals faster.`
              : `Ready to start your financial journey? Begin by tracking your income and setting your first savings goal.`}
          </p>
          <Button size="sm" variant="outline">
            Get Personalized Advice
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderSavingsGroups = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Savings Groups</h3>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Join Group
        </Button>
      </div>

      {financialData.savingsGroups.length > 0 ? (
        financialData.savingsGroups.map((group: any) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{group.name}</span>
                <Badge variant="secondary">{group.status}</Badge>
              </CardTitle>
              <CardDescription>
                {group.member_count} members • {group.contribution_frequency} contributions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">My Contribution</p>
                  <p className="font-semibold">
                    {financialData.currency} {group.contribution_amount}/{group.contribution_frequency}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Pool</p>
                  <p className="font-semibold">
                    {financialData.currency} {group.total_pool || 0}
                  </p>
                </div>
              </div>
              <Button size="sm" className="w-full">
                Make Contribution
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't joined any savings groups yet.</p>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Find Groups to Join
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderExpenseTracker = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Expense Tracking</h3>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Quick Add Expense */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Add Expense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount ({financialData.currency})</Label>
              <Input id="amount" placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="Business" />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="What was this for?" />
          </div>
          <Button className="w-full">Add Expense</Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderFinancialLiteracy = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Financial Literacy Modules</h3>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Current Module: Budgeting Basics
          </CardTitle>
          <CardDescription>Learn to create and stick to a budget</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={60} className="h-2" />
          <p className="text-sm text-muted-foreground">3 of 5 lessons completed</p>
          <Button>Continue Learning</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Saving Strategies</h4>
                <p className="text-sm text-muted-foreground">Build your emergency fund</p>
              </div>
              <Badge variant="outline">Next</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Investment Basics</h4>
                <p className="text-sm text-muted-foreground">Grow your money wisely</p>
              </div>
              <Badge variant="secondary">Locked</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Business Finance</h4>
                <p className="text-sm text-muted-foreground">Manage business cash flow</p>
              </div>
              <Badge variant="secondary">Locked</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-bold">PESA Coach</h1>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">
              Groups
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="learn" className="text-xs">
              Learn
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            {renderOverview()}
          </TabsContent>
          <TabsContent value="groups" className="mt-4">
            {renderSavingsGroups()}
          </TabsContent>
          <TabsContent value="expenses" className="mt-4">
            {renderExpenseTracker()}
          </TabsContent>
          <TabsContent value="learn" className="mt-4">
            {renderFinancialLiteracy()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
