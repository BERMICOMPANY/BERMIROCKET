"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
            <p className="text-2xl font-bold text-primary">$1,250</p>
            <p className="text-xs text-muted-foreground">+$150 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Monthly Income</span>
            </div>
            <p className="text-2xl font-bold text-accent">$800</p>
            <p className="text-xs text-muted-foreground">From 3 sources</p>
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
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Business Launch Fund</span>
              <span className="text-sm text-muted-foreground">$1,250 / $2,000</span>
            </div>
            <Progress value={62.5} className="h-2" />
            <p className="text-xs text-muted-foreground">$750 to go • Target: Dec 2024</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Emergency Fund</span>
              <span className="text-sm text-muted-foreground">$300 / $500</span>
            </div>
            <Progress value={60} className="h-2" />
            <p className="text-xs text-muted-foreground">$200 to go • Target: Nov 2024</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Savings Group Deposit</p>
                <p className="text-sm text-muted-foreground">Tech Entrepreneurs Circle</p>
              </div>
            </div>
            <span className="font-medium text-green-600">+$50</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Business Supplies</p>
                <p className="text-sm text-muted-foreground">Office materials</p>
              </div>
            </div>
            <span className="font-medium text-red-600">-$25</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Freelance Payment</p>
                <p className="text-sm text-muted-foreground">Web design project</p>
              </div>
            </div>
            <span className="font-medium text-green-600">+$200</span>
          </div>
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
            Great progress! You're saving 18% of your income. Consider increasing your emergency fund contribution by
            $25/month to reach your goal faster.
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tech Entrepreneurs Circle</span>
            <Badge variant="secondary">Active</Badge>
          </CardTitle>
          <CardDescription>12 members • Weekly contributions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">My Contribution</p>
              <p className="font-semibold">$50/week</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Pool</p>
              <p className="font-semibold">$2,400</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Next Payout</span>
              <span>Week 8 of 12</span>
            </div>
            <Progress value={67} className="h-2" />
          </div>
          <Button size="sm" className="w-full">
            Make This Week's Contribution
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Young Innovators Fund</span>
            <Badge variant="outline">Pending</Badge>
          </CardTitle>
          <CardDescription>8 members • Monthly contributions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">My Contribution</p>
              <p className="font-semibold">$100/month</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Pool</p>
              <p className="font-semibold">$800</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Waiting for 4 more members to start the cycle</p>
          <Button size="sm" variant="outline" className="w-full bg-transparent">
            Invite Friends
          </Button>
        </CardContent>
      </Card>
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

      {/* Monthly Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>October Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Business Expenses</span>
              <div className="text-right">
                <p className="text-sm font-medium">$150 / $200</p>
                <Progress value={75} className="h-1 w-16" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Personal</span>
              <div className="text-right">
                <p className="text-sm font-medium">$300 / $400</p>
                <Progress value={75} className="h-1 w-16" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Savings</span>
              <div className="text-right">
                <p className="text-sm font-medium">$200 / $200</p>
                <Progress value={100} className="h-1 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Expense */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Add Expense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="$0.00" />
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
