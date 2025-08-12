"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface UseRealtimeOptions {
  table: string
  filter?: string
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
}

export function useRealtime({ table, filter, onInsert, onUpdate, onDelete }: UseRealtimeOptions) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const channelName = `realtime-${table}-${filter || "all"}`
    const realtimeChannel = supabase.channel(channelName)

    // Set up table listeners
    const subscription = realtimeChannel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: table,
        filter: filter,
      },
      (payload) => {
        switch (payload.eventType) {
          case "INSERT":
            onInsert?.(payload.new)
            break
          case "UPDATE":
            onUpdate?.(payload.new)
            break
          case "DELETE":
            onDelete?.(payload.old)
            break
        }
      },
    )

    realtimeChannel.subscribe()
    setChannel(realtimeChannel)

    return () => {
      realtimeChannel.unsubscribe()
    }
  }, [table, filter, onInsert, onUpdate, onDelete])

  return channel
}

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev.slice(0, 9)]) // Keep last 10
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const markAsRead = async (notificationId: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", notificationId)
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  return { notifications, markAsRead }
}
