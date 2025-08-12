"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, Rocket, Zap } from "lucide-react"
import { useChat } from "ai/react"
import { createClient } from "@/lib/supabase/client"

interface ChatSession {
  id: string
  session_name: string
  created_at: string
}

export function AITutorChat() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    body: { sessionId },
    onFinish: () => {
      // Scroll to bottom after AI response
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
      }, 100)
    },
  })

  // Create new chat session
  const createNewSession = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("ai_chat_sessions")
        .insert({
          user_id: user.id,
          session_name: `Chat ${new Date().toLocaleDateString()}`,
        })
        .select()
        .single()

      if (error) throw error

      setSessionId(data.id)
      loadSessions()
    } catch (error) {
      console.error("Error creating session:", error)
    }
  }

  // Load user's chat sessions
  const loadSessions = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("ai_chat_sessions")
        .select("id, session_name, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error("Error loading sessions:", error)
    }
  }

  // Initialize session on component mount
  useEffect(() => {
    loadSessions()
    if (!sessionId) {
      createNewSession()
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const quickPrompts = [
    "How do I validate my business idea?",
    "Explain AI basics for entrepreneurs",
    "Help me create a business plan",
    "What are the best funding options?",
    "How to build a minimum viable product?",
  ]

  return (
    <div className="space-y-4">
      {/* Session Management */}
      <div className="flex gap-2 items-center">
        <Button
          onClick={createNewSession}
          size="sm"
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <Rocket className="h-4 w-4" />
          New Mission
        </Button>
        {sessions.length > 0 && (
          <div className="flex gap-1 overflow-x-auto">
            {sessions.map((session) => (
              <Badge
                key={session.id}
                variant={sessionId === session.id ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSessionId(session.id)}
              >
                {session.session_name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Mission Commander
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            {isLoading && <Zap className="h-4 w-4 text-yellow-500 animate-bounce" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 p-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center space-y-4 py-8">
                  <div className="flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Bot className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Welcome to Mission Control!</h3>
                    <p className="text-muted-foreground text-sm">
                      I'm your AI tutor ready to guide you through entrepreneurship, AI basics, and business creation.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Quick start prompts:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickPrompts.slice(0, 3).map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => handleSubmit(new Event("submit") as any, { data: new FormData() })}
                          onMouseDown={() => handleInputChange({ target: { value: prompt } } as any)}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.createdAt || Date.now()).toLocaleTimeString()}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted text-muted-foreground rounded-lg p-3 border">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                  <p className="text-sm">Connection error. Please try again.</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Prompts */}
          {messages.length > 0 && (
            <div className="flex gap-1 overflow-x-auto pb-2">
              {quickPrompts.slice(0, 3).map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-xs whitespace-nowrap"
                  onClick={() => {
                    handleInputChange({ target: { value: prompt } } as any)
                  }}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about business, AI, or entrepreneurship..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
