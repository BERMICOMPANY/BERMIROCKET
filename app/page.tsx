"use client"

import { useState, useEffect } from "react"
import { MissionControlNav } from "@/components/mission-control-nav"
import { RocketLogo } from "@/components/rocket-logo"
import { AITutorChat } from "@/components/ai-tutor-chat"
import { LearningModules } from "@/components/learning-modules"
import { PRDCreator } from "@/components/prd-creator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PESACoachDashboard } from "@/components/pesa-coach-dashboard"
import { OpportunityDesk } from "@/components/opportunity-desk"
import { BusinessStorefronts } from "@/components/business-storefronts"
import { CrewHub } from "@/components/crew-hub"
import { ProfileSettings } from "@/components/profile-settings"
import { AIInsightsCard } from "@/components/ai-insights-card"
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
  Sparkles,
} from "lucide-react"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("launchpad")
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

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
    <div className="space-y-6 pb-20">
      <div className="text-center py-8 bg-gradient-to-b from-primary/5 to-transparent">
        <RocketLogo size="lg" animated className="justify-center mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Ready for your next mission?</h1>
        <p className="text-muted-foreground">Your launchpad to entrepreneurial success</p>
      </div>

      {/* AI Insights Section */}
      <div className="mx-4 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">AI Mission Insights</h2>
        </div>
        <div className="grid gap-4">
          <AIInsightsCard type="financial" userData={profile} className="border-green-200 dark:border-green-800" />
          <AIInsightsCard type="learning" userData={profile} className="border-blue-200 dark:border-blue-800" />
        </div>
      </div>

      {/* Mission Progress */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Current Mission Progress
          </CardTitle>
          <CardDescription>You're in orbit level 2 - keep pushing!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Business Plan Creation</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Financial Literacy</span>
              <span>45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mx-4 space-y-4">
        <h2 className="text-lg font-semibold">Mission Control</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveSection("learning")}
          >
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium">AI Tutor</h3>
              <p className="text-sm text-muted-foreground">Continue learning</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSection("pesa")}>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-medium">PESA Coach</h3>
              <p className="text-sm text-muted-foreground">Track finances</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveSection("business")}
          >
            <CardContent className="p-4 text-center">
              <Briefcase className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium">Business Tools</h3>
              <p className="text-sm text-muted-foreground">Build & manage</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveSection("community")}
          >
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-medium">Crew Hub</h3>
              <p className="text-sm text-muted-foreground">Connect & learn</p>
            </CardContent>
          </Card>

          {/* Added Profile Settings card */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveSection("profile")}
          >
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium">Profile Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your profile</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Achievements */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">New</Badge>
            <span className="text-sm">Completed "Business Basics" module</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">Progress</Badge>
            <span className="text-sm">Saved $50 towards business goal</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLearning = () => (
    <div className="pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Learning Mission Control</h1>
        </div>
        <Tabs defaultValue="tutor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tutor" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Tutor
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="prd" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PRD Creator
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tutor" className="mt-4">
            <AITutorChat />
          </TabsContent>
          <TabsContent value="modules" className="mt-4">
            <LearningModules />
          </TabsContent>
          <TabsContent value="prd" className="mt-4">
            <PRDCreator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "launchpad":
        return renderLaunchpad()
      case "learning":
        return renderLearning()
      case "pesa":
        return <PESACoachDashboard />
      case "business":
        return <BusinessStorefronts />
      case "opportunities":
        return <OpportunityDesk />
      case "community":
        return <CrewHub />
      case "profile":
        return <ProfileSettings initialProfile={profile} />
      default:
        return renderLaunchpad()
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <RealtimeNotifications />
      {renderContent()}
      <MissionControlNav activeSection={activeSection} onSectionChange={setActiveSection} />
    </main>
  )
}
