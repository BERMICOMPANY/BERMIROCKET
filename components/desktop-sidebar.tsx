"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RocketLogo } from "@/components/rocket-logo"
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
  Bell,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  badge?: string
}

const navItems: NavItem[] = [
  { id: "launchpad", label: "Mission Control", icon: Home, description: "Dashboard & Overview" },
  { id: "learning", label: "AI Academy", icon: GraduationCap, description: "Learn & Grow", badge: "3" },
  { id: "pesa", label: "PESA Coach", icon: DollarSign, description: "Financial Management" },
  { id: "business", label: "Business Hub", icon: Briefcase, description: "Tools & Storefronts" },
  { id: "opportunities", label: "Opportunities", icon: Target, description: "Jobs & Grants", badge: "12" },
  { id: "community", label: "Crew Network", icon: Users, description: "Connect & Collaborate" },
]

const bottomNavItems: NavItem[] = [
  { id: "profile", label: "Profile", icon: Settings, description: "Account Settings" },
  { id: "admin", label: "Admin Panel", icon: Shield, description: "System Control" },
]

interface DesktopSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  showAdmin?: boolean
  user?: any
  profile?: any
}

export function DesktopSidebar({
  activeSection,
  onSectionChange,
  showAdmin = false,
  user,
  profile,
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
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <RocketLogo size="sm" />
                <div>
                  <h1 className="font-bold text-lg text-primary">Bermi Rocket</h1>
                  <p className="text-xs text-muted-foreground">Mission Control</p>
                </div>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{profile?.full_name || "Astronaut"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Level 2
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {profile?.currency || "USD"}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="h-4 w-4" />
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
