"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminSignupHelper() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const createAdminUser = async () => {
    setLoading(true)
    setMessage("")

    try {
      const supabase = createClient()

      // Create the admin user
      const { data, error } = await supabase.auth.signUp({
        email: "admin@bermirocket.com",
        password: "BermiAdmin2024!",
        options: {
          data: {
            full_name: "Bermi Rocket Admin",
            role: "admin",
          },
        },
      })

      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage("Admin user created successfully! You can now login with admin@bermirocket.com / BermiAdmin2024!")

        // Update the profile to admin role
        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            email: "admin@bermirocket.com",
            full_name: "Bermi Rocket Admin",
            role: "admin",
            currency: "TZS",
            location: "Tanzania",
          })

          if (profileError) {
            setMessage((prev) => prev + ` Profile update error: ${profileError.message}`)
          }
        }
      }
    } catch (error) {
      setMessage(`Unexpected error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Admin User</CardTitle>
        <CardDescription>Create the admin user for Bermi Rocket platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Email: admin@bermirocket.com</p>
          <p className="text-sm text-muted-foreground">Password: BermiAdmin2024!</p>
        </div>

        <Button onClick={createAdminUser} disabled={loading} className="w-full">
          {loading ? "Creating Admin User..." : "Create Admin User"}
        </Button>

        {message && (
          <div
            className={`p-3 rounded text-sm ${
              message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
