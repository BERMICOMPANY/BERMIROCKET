"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Rocket, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { signIn } from "@/lib/actions"

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
          Initiating Launch...
        </>
      ) : (
        <>
          <Rocket className="mr-2 h-5 w-5" />
          Launch Mission
        </>
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)

  useEffect(() => {
    if (state?.success) {
      router.push("/")
    }
  }, [state, router])

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
          <h1 className="text-4xl font-bold text-white">Mission Control</h1>
          <p className="text-lg text-slate-300">Access your command center</p>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            🚨 {state.error}
          </div>
        )}

        <div className="space-y-4">
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
          New to the mission?{" "}
          <Link href="/auth/sign-up" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Join the crew
          </Link>
        </div>
      </form>
    </div>
  )
}
