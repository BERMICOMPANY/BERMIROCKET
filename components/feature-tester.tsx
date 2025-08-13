"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Play } from "lucide-react"

interface TestResult {
  feature: string
  status: "pending" | "running" | "success" | "error"
  message?: string
  details?: any
}

const FEATURES_TO_TEST = [
  { id: "auth", name: "Authentication System", endpoint: "/api/auth/test" },
  { id: "profile", name: "Profile Management", endpoint: "/api/profile/test" },
  { id: "courses", name: "Course Management", endpoint: "/api/courses" },
  { id: "opportunities", name: "Opportunities System", endpoint: "/api/opportunities" },
  { id: "businesses", name: "Business Management", endpoint: "/api/businesses" },
  { id: "transactions", name: "Financial Tracking", endpoint: "/api/transactions" },
  { id: "goals", name: "Goal Management", endpoint: "/api/goals" },
  { id: "chat", name: "AI Chat System", endpoint: "/api/chat" },
  { id: "applications", name: "Application System", endpoint: "/api/applications" },
  { id: "storage", name: "File Storage", endpoint: "/api/storage/test" },
]

export default function FeatureTester() {
  const [testResults, setTestResults] = useState<TestResult[]>(
    FEATURES_TO_TEST.map((f) => ({ feature: f.name, status: "pending" })),
  )
  const [isRunning, setIsRunning] = useState(false)

  const updateTestResult = (index: number, result: Partial<TestResult>) => {
    setTestResults((prev) => prev.map((item, i) => (i === index ? { ...item, ...result } : item)))
  }

  const testFeature = async (feature: (typeof FEATURES_TO_TEST)[0], index: number) => {
    updateTestResult(index, { status: "running" })

    try {
      const response = await fetch(feature.endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const data = await response.json()
        updateTestResult(index, {
          status: "success",
          message: "Feature working correctly",
          details: data,
        })
      } else {
        updateTestResult(index, {
          status: "error",
          message: `HTTP ${response.status}: ${response.statusText}`,
        })
      }
    } catch (error) {
      updateTestResult(index, {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)

    for (let i = 0; i < FEATURES_TO_TEST.length; i++) {
      await testFeature(FEATURES_TO_TEST[i], i)
      // Add small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "running":
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            Passed
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Failed</Badge>
      case "running":
        return <Badge variant="secondary">Running</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const successCount = testResults.filter((r) => r.status === "success").length
  const errorCount = testResults.filter((r) => r.status === "error").length
  const totalTests = testResults.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Bermi Rocket Feature Testing Dashboard
          </CardTitle>
          <CardDescription>Test all platform features to ensure they're working correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={runAllTests} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600">✓ {successCount} Passed</span>
              <span className="text-red-600">✗ {errorCount} Failed</span>
              <span className="text-gray-600">Total: {totalTests}</span>
            </div>
          </div>

          <div className="grid gap-4">
            {testResults.map((result, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h4 className="font-medium">{result.feature}</h4>
                        {result.message && <p className="text-sm text-gray-600 mt-1">{result.message}</p>}
                      </div>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>

                  {result.details && result.status === "success" && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <pre className="text-xs text-gray-700 overflow-x-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
