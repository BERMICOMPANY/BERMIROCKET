"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, Mail, Phone, MapPin, Calendar, Briefcase, Heart, Camera, Save } from "lucide-react"
import { updateProfile } from "@/lib/profile-actions"
import { LocationDetector } from "@/components/location-detector"
import { type LocationData, getCurrencySymbol } from "@/lib/location-service"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating Mission Profile...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </>
      )}
    </Button>
  )
}

interface ProfileSettingsProps {
  initialProfile?: any
  onProfileUpdate?: () => void // Added callback for profile updates
}

export function ProfileSettings({ initialProfile, onProfileUpdate }: ProfileSettingsProps) {
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await updateProfile(prevState, formData)
    if (result?.success && onProfileUpdate) {
      onProfileUpdate()
    }
    return result
  }, null)

  const [skillInput, setSkillInput] = useState("")
  const [interestInput, setInterestInput] = useState("")
  const [skills, setSkills] = useState<string[]>(initialProfile?.skills || [])
  const [interests, setInterests] = useState<string[]>(initialProfile?.interests || [])
  const [selectedLocation, setSelectedLocation] = useState(initialProfile?.location || "")
  const [selectedCurrency, setSelectedCurrency] = useState(initialProfile?.currency || "USD")

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()])
      setInterestInput("")
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", region: "North America" },
    { code: "EUR", name: "Euro", symbol: "€", region: "Europe" },
    { code: "GBP", name: "British Pound", symbol: "£", region: "Europe" },
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh", region: "Africa" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦", region: "Africa" },
    { code: "ZAR", name: "South African Rand", symbol: "R", region: "Africa" },
    { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", region: "Africa" },
    { code: "UGX", name: "Ugandan Shilling", symbol: "USh", region: "Africa" },
    { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", region: "Africa" },
    { code: "RWF", name: "Rwandan Franc", symbol: "RF", region: "Africa" },
    { code: "ETB", name: "Ethiopian Birr", symbol: "Br", region: "Africa" },
    { code: "EGP", name: "Egyptian Pound", symbol: "£E", region: "Africa" },
    { code: "MAD", name: "Moroccan Dirham", symbol: "DH", region: "Africa" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", region: "North America" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "Oceania" },
    { code: "INR", name: "Indian Rupee", symbol: "₹", region: "Asia" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", region: "Asia" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", region: "Asia" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$", region: "South America" },
  ]

  const handleLocationDetected = (locationData: LocationData) => {
    setSelectedLocation(`${locationData.city}, ${locationData.country}`)
    setSelectedCurrency(locationData.currency)
  }

  const currenciesByRegion = currencies.reduce(
    (acc, currency) => {
      if (!acc[currency.region]) {
        acc[currency.region] = []
      }
      acc[currency.region].push(currency)
      return acc
    },
    {} as Record<string, typeof currencies>,
  )

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <Avatar className="w-24 h-24">
            <AvatarImage src={initialProfile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-500 text-white text-2xl">
              {initialProfile?.full_name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0" variant="secondary">
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mission Profile</h1>
          <p className="text-muted-foreground">Customize your astronaut profile</p>
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

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic astronaut details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={initialProfile?.full_name || ""}
                placeholder="Your full name"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email (Mission ID)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="email" value={initialProfile?.email || ""} disabled className="pl-10 bg-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={initialProfile?.phone || ""}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  defaultValue={initialProfile?.date_of_birth || ""}
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={initialProfile?.bio || ""}
                placeholder="Tell us about your entrepreneurial journey..."
                className="bg-background min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location & Currency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location & Currency
            </CardTitle>
            <CardDescription>Your mission base and preferred currency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocationDetector
              onLocationDetected={handleLocationDetected}
              currentLocation={selectedLocation}
              currentCurrency={selectedCurrency}
            />

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                name="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="City, Country"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium">
                Preferred Currency
                {selectedCurrency && (
                  <Badge variant="outline" className="ml-2">
                    {getCurrencySymbol(selectedCurrency)} {selectedCurrency}
                  </Badge>
                )}
              </label>
              <Select name="currency" value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currenciesByRegion).map(([region, regionCurrencies]) => (
                    <div key={region}>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted/50">{region}</div>
                      {regionCurrencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name} ({currency.code})
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Skills & Expertise
            </CardTitle>
            <CardDescription>What are you good at?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill..."
                className="bg-background"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeSkill(skill)}
                >
                  {skill} ×
                </Badge>
              ))}
            </div>
            <input type="hidden" name="skills" value={skills.join(",")} />
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Interests & Passions
            </CardTitle>
            <CardDescription>What drives your entrepreneurial spirit?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="Add an interest..."
                className="bg-background"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
              />
              <Button type="button" onClick={addInterest} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeInterest(interest)}
                >
                  {interest} ×
                </Badge>
              ))}
            </div>
            <input type="hidden" name="interests" value={interests.join(",")} />
          </CardContent>
        </Card>

        <SubmitButton />
      </form>
    </div>
  )
}
