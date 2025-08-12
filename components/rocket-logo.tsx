import { Rocket } from "lucide-react"

interface RocketLogoProps {
  size?: "sm" | "md" | "lg"
  animated?: boolean
  className?: string
}

export function RocketLogo({ size = "md", animated = false, className = "" }: RocketLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Rocket className={`${sizeClasses[size]} text-primary ${animated ? "rocket-launch" : ""}`} />
      <span className={`font-bold text-primary ${size === "lg" ? "text-2xl" : size === "md" ? "text-xl" : "text-lg"}`}>
        Bermi Rocket
      </span>
    </div>
  )
}
