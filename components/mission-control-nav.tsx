"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Home, GraduationCap, DollarSign, Briefcase, Users, Target } from "lucide-react"

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const navItems: NavItem[] = [
  { id: "launchpad", label: "Launchpad", icon: Home, description: "Mission Control" },
  { id: "learning", label: "Learning", icon: GraduationCap, description: "AI Tutor & Courses" },
  { id: "pesa", label: "PESA Coach", icon: DollarSign, description: "Financial Dashboard" },
  { id: "business", label: "Business", icon: Briefcase, description: "Tools & Storefronts" },
  { id: "opportunities", label: "Opportunities", icon: Target, description: "Jobs & Grants" },
  { id: "community", label: "Crew Hub", icon: Users, description: "Connect & Collaborate" },
]

interface MissionControlNavProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function MissionControlNav({ activeSection, onSectionChange }: MissionControlNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "rocket-launch" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
