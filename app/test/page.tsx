import { Suspense } from "react"
import FeatureTester from "@/components/feature-tester"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bermi Rocket System Testing</h1>
          <p className="text-gray-600">Comprehensive testing dashboard for all platform features and functionality</p>
        </div>

        <Suspense
          fallback={
            <Card>
              <CardHeader>
                <CardTitle>Loading Test Dashboard...</CardTitle>
                <CardDescription>Preparing feature tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          }
        >
          <FeatureTester />
        </Suspense>
      </div>
    </div>
  )
}
