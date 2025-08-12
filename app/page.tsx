"use client"

import { useState, useEffect } from "react"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { RocketLogo } from "@/components/rocket-logo"
import { AITutorChat } from "@/components/ai-tutor-chat"
import { LearningModules } from "@/components/learning-modules"
import { PRDCreator } from "@/components/prd-creator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PESACoachDashboard } from "@/components/pesa-coach-dashboard"
import { OpportunityDesk } from "@/components/opportunity-desk"
import { BusinessStorefronts } from "@/components/business-storefronts"
import { CrewHub } from "@/components/crew-hub"
import { ProfileSettings } from "@/components/profile-settings"
import { AIInsightsCard } from "@/components/ai-insights-card"
import AdminDashboard from "@/components/admin-dashboard"
import SplashScreen from "@/components/splash-screen"
import { createClient } from "@/lib/supabase/client"
import { getProfile } from "@/lib/profile-actions"
import { RealtimeNotifications } from "@/components/realtime-notifications"
import {
  Target,
  Users,
  BookOpen,
  DollarSign,
  Briefcase,
  Award,
  Bot,
  FileText,
  GraduationCap,
  TrendingUp,
  Calendar,
  MessageSquare,
} from "lucide-react"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("launchpad")
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = "/auth/login"
        return
      }

      setUser(session.user)

      try {
        const profileData = await getProfile()
        setProfile(profileData)
        setIsAdmin(profileData?.role === "admin")
      } catch (error) {
        console.error("Error loading profile:", error)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} />
  }

  const renderLaunchpad = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {profile?.full_name || "Astronaut"}! 🚀
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to launch your next mission? Your entrepreneurial journey continues here.
            </p>
          </div>
          <RocketLogo size="lg" animated />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Progress</p>
                <p className="text-2xl font-bold">75%</p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4">
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Savings Goal</p>
                <p className="text-2xl font-bold">{profile?.currency || "USD"} 1,250</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Progress value={62} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <Badge variant="secondary">2 In Progress</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <Badge variant="outline">+5 This Week</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIInsightsCard type="financial" userData={profile} className="border-green-200 dark:border-green-800" />
        <AIInsightsCard type="learning" userData={profile} className="border-blue-200 dark:border-blue-800" />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setActiveSection("learning")}
        >
          <CardContent className="p-6 text-center">
            <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">AI Tutor Session</h3>
            <p className="text-muted-foreground mb-4">Continue your personalized learning journey</p>
            <Badge variant="secondary">3 New Lessons</Badge>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setActiveSection("pesa")}
        >
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Financial Dashboard</h3>
            <p className="text-muted-foreground mb-4">Track your savings and expenses</p>
            <Badge variant="secondary">Goal: 62%</Badge>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setActiveSection("business")}
        >
          <CardContent className="p-6 text-center">
            <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Business Tools</h3>
            <p className="text-muted-foreground mb-4">Manage your ventures and products</p>
            <Badge variant="secondary">2 Active</Badge>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setActiveSection("opportunities")}
        >
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">New Opportunities</h3>
            <p className="text-muted-foreground mb-4">Discover jobs, grants, scholarships, and competitions</p>
            <Badge variant="secondary">12 New</Badge>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setActiveSection("community")}
        >
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Crew Network</h3>
            <p className="text-muted-foreground mb-4">Connect with fellow entrepreneurs</p>
            <Badge variant="secondary">5 Messages</Badge>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => setActiveSection("profile")}
        >
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Mission Planner</h3>
            <p className="text-muted-foreground mb-4">Set goals and track progress</p>
            <Badge variant="secondary">3 Goals</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Recent Achievements & Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <Badge variant="default" className="bg-green-600">
              New
            </Badge>
            <div className="flex-1">
              <p className="font-medium">Completed "Business Fundamentals" Course</p>
              <p className="text-sm text-muted-foreground">Earned 50 XP • 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Badge variant="outline">Progress</Badge>
            <div className="flex-1">
              <p className="font-medium">Saved {profile?.currency || "USD"} 150 towards business goal</p>
              <p className="text-sm text-muted-foreground">Monthly target: 75% complete • 1 day ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <Badge variant="secondary">Social</Badge>
            <div className="flex-1">
              <p className="font-medium">Connected with 3 new entrepreneurs</p>
              <p className="text-sm text-muted-foreground">Network growing • 3 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLearning = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">AI Academy</h1>
        <p className="text-muted-foreground">Accelerate your learning with AI-powered education</p>
      </div>
      <Tabs defaultValue="tutor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tutor" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Tutor
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="prd" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            PRD Creator
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tutor" className="mt-6">
          <AITutorChat />
        </TabsContent>
        <TabsContent value="modules" className="mt-6">
          <LearningModules />
        </TabsContent>
        <TabsContent value="prd" className="mt-6">
          <PRDCreator />
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderPesa = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">PESA Coach</h1>
        <p className="text-muted-foreground">Master your finances with AI-powered coaching</p>
      </div>
      <PESACoachDashboard />
    </div>
  )

  const renderBusiness = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Business Hub</h1>
        <p className="text-muted-foreground">Build and manage your entrepreneurial ventures</p>
      </div>
      <BusinessStorefronts />
    </div>
  )

  const renderOpportunities = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Opportunities</h1>
        <p className="text-muted-foreground">Discover jobs, grants, scholarships, and competitions</p>
      </div>
      <OpportunityDesk />
    </div>
  )

  const renderCommunity = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Crew Network</h1>
        <p className="text-muted-foreground">Connect, collaborate, and learn from fellow entrepreneurs</p>
      </div>
      <CrewHub />
    </div>
  )

  const renderProfile = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Mission Settings</h1>
        <p className="text-muted-foreground">Customize your profile and preferences</p>
      </div>
      <ProfileSettings initialProfile={profile} />
    </div>
  )

  const renderAdmin = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Admin Control Center</h1>
        <p className="text-muted-foreground">Manage the Bermi Rocket platform</p>
      </div>
      <AdminDashboard />
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "launchpad":
        return renderLaunchpad()
      case "learning":
        return renderLearning()
      case "pesa":
        return renderPesa()
      case "business":
        return renderBusiness()
      case "opportunities":
        return renderOpportunities()
      case "community":
        return renderCommunity()
      case "profile":
        return renderProfile()
      case "admin":
        return isAdmin ? renderAdmin() : renderLaunchpad()
      default:
        return renderLaunchpad()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <RealtimeNotifications />
      <DesktopSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        showAdmin={isAdmin}
        user={user}
        profile={profile}
      />
      <main className="ml-64 transition-all duration-300">
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  )
}
