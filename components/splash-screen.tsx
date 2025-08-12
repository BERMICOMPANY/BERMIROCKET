"use client"

import { useEffect, useState } from "react"
import { Rocket } from "lucide-react"

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-50">
      <div className="text-center space-y-8">
        {/* Animated Rocket */}
        <div className="relative">
          <div className="animate-bounce">
            <Rocket className="w-24 h-24 text-blue-400 mx-auto" />
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-8 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Bermi Rocket Logo */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Bermi</h1>
          <p className="text-xl text-blue-300 font-medium tracking-wider">ROCKET</p>
        </div>

        {/* Loading Progress */}
        <div className="w-64 mx-auto space-y-2">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-blue-300 text-sm">Initializing Mission Control... {progress}%</p>
        </div>

        {/* Mission Status */}
        <div className="text-blue-200 text-sm space-y-1">
          <p>🚀 Preparing launch sequence</p>
          <p>🌟 Loading youth empowerment systems</p>
          <p>💫 Connecting to mission control</p>
        </div>
      </div>
    </div>
  )
}
