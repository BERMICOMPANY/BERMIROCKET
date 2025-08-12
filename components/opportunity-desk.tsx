"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Search,
  Briefcase,
  GraduationCap,
  Trophy,
  DollarSign,
  MapPin,
  Clock,
  Star,
  Filter,
  BookmarkPlus,
  ExternalLink,
  Calendar,
  Target,
} from "lucide-react"

export function OpportunityDesk() {
  const [activeTab, setActiveTab] = useState("discover")
  const [searchQuery, setSearchQuery] = useState("")

  const opportunities = [
    {
      id: 1,
      type: "job",
      title: "Junior Software Developer",
      company: "TechStart Kenya",
      location: "Nairobi, Kenya",
      salary: "$800-1200/month",
      deadline: "Nov 15, 2024",
      description: "Join our growing team building fintech solutions for East Africa",
      tags: ["Remote OK", "Entry Level", "Tech"],
      featured: true,
    },
    {
      id: 2,
      type: "scholarship",
      title: "Young Entrepreneurs Scholarship",
      company: "African Development Bank",
      location: "Pan-African",
      amount: "$5,000",
      deadline: "Dec 1, 2024",
      description: "Supporting young entrepreneurs across Africa with education funding",
      tags: ["Business", "Education", "Pan-African"],
      featured: false,
    },
    {
      id: 3,
      type: "internship",
      title: "Marketing Intern",
      company: "Safaricom",
      location: "Nairobi, Kenya",
      duration: "3 months",
      deadline: "Nov 30, 2024",
      description: "Gain hands-on experience in digital marketing and brand management",
      tags: ["Marketing", "Telecom", "Paid"],
      featured: false,
    },
    {
      id: 4,
      type: "competition",
      title: "Africa Innovation Challenge",
      company: "Innovation Hub",
      location: "Virtual",
      prize: "$10,000",
      deadline: "Jan 15, 2025",
      description: "Pitch your innovative solution to Africa's biggest challenges",
      tags: ["Innovation", "Pitch", "Virtual"],
      featured: true,
    },
  ]

  const applications = [
    {
      id: 1,
      title: "Junior Software Developer",
      company: "TechStart Kenya",
      status: "Under Review",
      appliedDate: "Oct 15, 2024",
      type: "job",
    },
    {
      id: 2,
      title: "Marketing Intern",
      company: "Safaricom",
      status: "Interview Scheduled",
      appliedDate: "Oct 10, 2024",
      type: "internship",
    },
    {
      id: 3,
      title: "Young Entrepreneurs Scholarship",
      company: "African Development Bank",
      status: "Application Submitted",
      appliedDate: "Oct 5, 2024",
      type: "scholarship",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job":
        return <Briefcase className="h-4 w-4" />
      case "scholarship":
        return <GraduationCap className="h-4 w-4" />
      case "internship":
        return <Target className="h-4 w-4" />
      case "competition":
        return <Trophy className="h-4 w-4" />
      default:
        return <Briefcase className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Application Submitted":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderDiscover = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            All Types
          </Button>
          <Button size="sm" variant="outline">
            Jobs
          </Button>
          <Button size="sm" variant="outline">
            Internships
          </Button>
          <Button size="sm" variant="outline">
            Scholarships
          </Button>
          <Button size="sm" variant="outline">
            Competitions
          </Button>
        </div>
      </div>

      {/* Featured Opportunities */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Featured Opportunities</h3>
        <div className="space-y-4">
          {opportunities
            .filter((opp) => opp.featured)
            .map((opportunity) => (
              <Card key={opportunity.id} className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(opportunity.type)}
                      <Badge variant="secondary" className="capitalize">
                        {opportunity.type}
                      </Badge>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                    <Button size="sm" variant="ghost">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="font-medium">{opportunity.company}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {opportunity.location}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      {opportunity.salary && (
                        <span className="flex items-center gap-1 text-green-600">
                          <DollarSign className="h-3 w-3" />
                          {opportunity.salary}
                        </span>
                      )}
                      {opportunity.amount && (
                        <span className="flex items-center gap-1 text-green-600">
                          <DollarSign className="h-3 w-3" />
                          {opportunity.amount}
                        </span>
                      )}
                      {opportunity.prize && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Trophy className="h-3 w-3" />
                          {opportunity.prize}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Due {opportunity.deadline}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* All Opportunities */}
      <div>
        <h3 className="text-lg font-semibold mb-4">All Opportunities</h3>
        <div className="space-y-4">
          {opportunities
            .filter((opp) => !opp.featured)
            .map((opportunity) => (
              <Card key={opportunity.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(opportunity.type)}
                      <Badge variant="outline" className="capitalize">
                        {opportunity.type}
                      </Badge>
                    </div>
                    <Button size="sm" variant="ghost">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-base">{opportunity.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="font-medium">{opportunity.company}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {opportunity.location}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{opportunity.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      {opportunity.salary && (
                        <span className="flex items-center gap-1 text-green-600">
                          <DollarSign className="h-3 w-3" />
                          {opportunity.salary}
                        </span>
                      )}
                      {opportunity.duration && <span className="text-muted-foreground">{opportunity.duration}</span>}
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Due {opportunity.deadline}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Applications</h3>
        <Badge variant="secondary">{applications.length} Active</Badge>
      </div>

      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(application.type)}
                  <Badge variant="outline" className="capitalize">
                    {application.type}
                  </Badge>
                </div>
                <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
              </div>
              <CardTitle className="text-base">{application.title}</CardTitle>
              <CardDescription>{application.company}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Applied {application.appliedDate}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  View Application
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Tips */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Application Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• Follow up on applications after 1-2 weeks</li>
            <li>• Customize your application for each opportunity</li>
            <li>• Keep track of deadlines and requirements</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )

  const renderRecommendations = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Recommended for You</h3>
      <p className="text-sm text-muted-foreground">Based on your profile and interests</p>

      <div className="space-y-4">
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-accent fill-current" />
              <Badge variant="secondary">Perfect Match</Badge>
            </div>
            <CardTitle className="text-base">Tech4Good Hackathon</CardTitle>
            <CardDescription>Innovation for Social Impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Build technology solutions for social challenges. Perfect for your AI and business interests.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-green-600">
                <Trophy className="h-3 w-3" />
                $15,000 prize
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                Due Dec 20, 2024
              </span>
            </div>
            <Button size="sm" className="w-full">
              Apply Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Good Match</Badge>
            </div>
            <CardTitle className="text-base">Digital Marketing Specialist</CardTitle>
            <CardDescription>Growing Startup • Remote</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Join a fast-growing fintech startup. Your business knowledge would be valuable here.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-green-600">
                <DollarSign className="h-3 w-3" />
                $600-900/month
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                Due Nov 25, 2024
              </span>
            </div>
            <Button size="sm" variant="outline" className="w-full bg-transparent">
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Opportunity Desk</h1>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover" className="text-xs">
              Discover
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-xs">
              Applications
            </TabsTrigger>
            <TabsTrigger value="recommended" className="text-xs">
              For You
            </TabsTrigger>
          </TabsList>
          <TabsContent value="discover" className="mt-4">
            {renderDiscover()}
          </TabsContent>
          <TabsContent value="applications" className="mt-4">
            {renderApplications()}
          </TabsContent>
          <TabsContent value="recommended" className="mt-4">
            {renderRecommendations()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
