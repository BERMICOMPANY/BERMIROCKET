"use client"

import { X, Rocket, DollarSign, Users, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRealtimeNotifications } from "@/hooks/use-realtime"

export function RealtimeNotifications() {
  const { notifications, markAsRead } = useRealtimeNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Briefcase className="h-4 w-4" />
      case "financial":
        return <DollarSign className="h-4 w-4" />
      case "community":
        return <Users className="h-4 w-4" />
      default:
        return <Rocket className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "financial":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "community":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.slice(0, 3).map((notification) => (
        <Card key={notification.id} className={`border ${getNotificationColor(notification.type)}`}>
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs opacity-80 mt-1">{notification.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs">
                    {notification.type}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => markAsRead(notification.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {notifications.length > 3 && (
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            +{notifications.length - 3} more notifications
          </Badge>
        </div>
      )}
    </div>
  )
}
