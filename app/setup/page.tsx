import { AdminSignupHelper } from "@/components/admin-signup-helper"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bermi Rocket Setup</h1>
          <p className="text-gray-600">Create the admin user to get started</p>
        </div>

        <AdminSignupHelper />

        <div className="mt-6 text-center">
          <a href="/auth/login" className="text-blue-600 hover:text-blue-800 text-sm">
            Go to Login →
          </a>
        </div>
      </div>
    </div>
  )
}
