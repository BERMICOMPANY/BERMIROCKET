"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Rocket, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-6 text-lg font-medium rounded-lg h-[60px] transition-all duration-300"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Registering Astronaut...
        </>
      ) : (
        <>
          <Rocket className="mr-2 h-5 w-5" />
          Join the Mission
        </>
      )}
    </Button>
  )
}

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, null)

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-500/10 rounded-full">
            <Rocket className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Join the Crew</h1>
          <p className="text-lg text-slate-300">Begin your entrepreneurial journey</p>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            🚨 {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
            🚀 {state.success}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300">
              Astronaut Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Your full name"
                required
                className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Mission ID (Email)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="astronaut@bermi.space"
                required
                className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Access Code (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="pl-10 bg-slate-800/50 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        <SubmitButton />

        <div className="text-center text-slate-400">
          Already part of the crew?{" "}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Access mission control
          </Link>
        </div>
      </form>
    </div>
  )
}
