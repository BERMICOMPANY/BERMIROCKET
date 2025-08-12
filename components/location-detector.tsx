"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { detectLocationAndCurrency, type LocationData } from "@/lib/location-service"

interface LocationDetectorProps {
  onLocationDetected: (location: LocationData) => void
  currentLocation?: string
  currentCurrency?: string
}

export function LocationDetector({ onLocationDetected, currentLocation, currentCurrency }: LocationDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasAutoDetected, setHasAutoDetected] = useState(false)

  // Auto-detect location on component mount if no location is set
  useEffect(() => {
    if (!currentLocation && !hasAutoDetected) {
      handleDetectLocation(true)
      setHasAutoDetected(true)
    }
  }, [currentLocation, hasAutoDetected])

  const handleDetectLocation = async (isAutomatic = false) => {
    setIsDetecting(true)
    setError(null)

    try {
      const locationData = await detectLocationAndCurrency()
      setDetectedLocation(locationData)
      onLocationDetected(locationData)

      if (!isAutomatic) {
        // Show success message for manual detection
        setTimeout(() => setDetectedLocation(null), 3000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to detect location"
      setError(errorMessage)
      console.error("Location detection error:", err)
    } finally {
      setIsDetecting(false)
    }
  }

  return (
    <Card className="border-dashed border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Navigation className="h-4 w-4 text-primary" />
          Smart Location Detection
        </CardTitle>
        <CardDescription className="text-xs">
          Automatically detect your location to set the appropriate currency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Status */}
        {currentLocation && currentCurrency && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">
              {currentLocation} • {currentCurrency}
            </span>
          </div>
        )}

        {/* Detection Results */}
        {detectedLocation && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Location Detected!</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Location:</span>
                <br />
                <span className="font-medium">
                  {detectedLocation.city}, {detectedLocation.country}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Currency:</span>
                <br />
                <Badge variant="secondary" className="text-xs">
                  {detectedLocation.currency}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Detection Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleDetectLocation(false)}
          disabled={isDetecting}
          className="w-full"
        >
          {isDetecting ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Detecting Location...
            </>
          ) : (
            <>
              <Navigation className="mr-2 h-3 w-3" />
              Detect My Location
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          We use your location to suggest the most appropriate currency for your region.
        </p>
      </CardContent>
    </Card>
  )
}
