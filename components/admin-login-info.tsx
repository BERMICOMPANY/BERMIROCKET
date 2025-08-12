"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Key } from "lucide-react"

export function AdminLoginInfo() {
  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Shield className="h-5 w-5" />
          Admin Access Credentials
        </CardTitle>
        <CardDescription>Use these credentials to access the admin dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-gray-600 font-mono">admin@bermirocket.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Key className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm font-medium">Password</p>
            <p className="text-sm text-gray-600 font-mono">BermiAdmin2024!</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Admin Role Enabled
        </Badge>
      </CardContent>
    </Card>
  )
}
