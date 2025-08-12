"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  GraduationCap,
  DollarSign,
  Briefcase,
  Users,
  Target,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus,
  BookOpen,
  TrendingUp,
  Calendar,
  MessageSquare,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  badge?: string
  actions?: Array<{
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick: () => void
  }>
}

const navItems: NavItem[] = [
  { id: "launchpad", label: "Mission Control", icon: Home, description: "Dashboard & Overview" },
  {
    id: "learning",
    label: "AI Academy",
    icon: GraduationCap,
    description: "Learn & Grow",
    badge: "3",
    actions: [
      { id: "add-course", label: "Add Course", icon: Plus, onClick: () => {} },
      { id: "start-study", label: "Start Studying", icon: BookOpen, onClick: () => {} },
    ],
  },
  {
    id: "pesa",
    label: "PESA Coach",
    icon: DollarSign,
    description: "Financial Management",
    actions: [
      { id: "add-income", label: "Add Income", icon: TrendingUp, onClick: () => {} },
      { id: "add-expense", label: "Add Expense", icon: Plus, onClick: () => {} },
      { id: "add-goal", label: "Add Goal", icon: Target, onClick: () => {} },
    ],
  },
  { id: "business", label: "Business Hub", icon: Briefcase, description: "Tools & Storefronts" },
  {
    id: "opportunities",
    label: "Opportunities",
    icon: Target,
    description: "Jobs & Grants",
    badge: "12",
    actions: [{ id: "apply", label: "Apply Now", icon: Calendar, onClick: () => {} }],
  },
  {
    id: "community",
    label: "Crew Network",
    icon: Users,
    description: "Connect & Collaborate",
    actions: [{ id: "message", label: "Send Message", icon: MessageSquare, onClick: () => {} }],
  },
]

const bottomNavItems: NavItem[] = [
  { id: "profile", label: "Profile Settings", icon: Settings, description: "Account & Preferences" },
  { id: "admin", label: "Admin Panel", icon: Shield, description: "System Control" },
]

interface DesktopSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  showAdmin?: boolean
  user?: any
  profile?: any
  onAddGoal?: () => void
  onAddCourse?: () => void
  onAddIncome?: () => void
  onAddExpense?: () => void
  onApplyOpportunity?: () => void
  onStartStudying?: () => void
}

export function DesktopSidebar({
  activeSection,
  onSectionChange,
  showAdmin = false,
  user,
  profile,
  onAddGoal,
  onAddCourse,
  onAddIncome,
  onAddExpense,
  onApplyOpportunity,
  onStartStudying,
}: DesktopSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  const displayBottomItems = showAdmin ? bottomNavItems : bottomNavItems.filter((item) => item.id !== "admin")

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-card border-r border-border z-50 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-72"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* User Profile Header */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base truncate">{profile?.full_name || "New Astronaut"}</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" className="text-xs">
                      Level 2 Explorer
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {profile?.currency || "USD"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-3 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={onAddGoal} className="h-8 text-xs bg-transparent">
                <Target className="h-3 w-3 mr-1" />
                Add Goal
              </Button>
              <Button size="sm" variant="outline" onClick={onAddIncome} className="h-8 text-xs bg-transparent">
                <TrendingUp className="h-3 w-3 mr-1" />
                Add Income
              </Button>
              <Button size="sm" variant="outline" onClick={onStartStudying} className="h-8 text-xs bg-transparent">
                <BookOpen className="h-3 w-3 mr-1" />
                Study
              </Button>
              <Button size="sm" variant="outline" onClick={onApplyOpportunity} className="h-8 text-xs bg-transparent">
                <Calendar className="h-3 w-3 mr-1" />
                Apply
              </Button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <div key={item.id} className="space-y-1">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full justify-start h-12 ${isCollapsed ? "px-2" : "px-3"} ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
                    {!isCollapsed && (
                      <>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>

                  {!isCollapsed && isActive && item.actions && (
                    <div className="ml-8 space-y-1">
                      {item.actions.map((action) => {
                        const ActionIcon = action.icon
                        return (
                          <Button
                            key={action.id}
                            variant="ghost"
                            size="sm"
                            onClick={action.onClick}
                            className="w-full justify-start h-8 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <ActionIcon className="h-3 w-3 mr-2" />
                            {action.label}
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-border p-2">
          <nav className="space-y-1">
            {displayBottomItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full justify-start h-12 ${isCollapsed ? "px-2" : "px-3"} ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  )}
                </Button>
              )
            })}

            <Separator className="my-2" />

            <Button
              variant="ghost"
              onClick={handleSignOut}
              className={`w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 ${
                isCollapsed ? "px-2" : "px-3"
              }`}
            >
              <LogOut className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">Sign Out</div>
                  <div className="text-xs opacity-70">End Mission</div>
                </div>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}
