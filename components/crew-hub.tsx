"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  MessageCircle,
  UserPlus,
  Star,
  BookOpen,
  Handshake,
  Trophy,
  Heart,
  MessageSquare,
  Search,
  Filter,
  Plus,
  MapPin,
  Zap,
  Rocket,
} from "lucide-react"

export function CrewHub() {
  const [activeTab, setActiveTab] = useState("community")

  const forumPosts = [
    {
      id: 1,
      title: "How to validate your business idea before investing?",
      author: "Sarah K.",
      avatar: "/placeholder.svg?height=32&width=32",
      category: "Business Strategy",
      replies: 12,
      likes: 24,
      timeAgo: "2 hours ago",
      excerpt: "I have this great idea for a fintech app but I'm not sure how to validate it properly...",
      featured: true,
    },
    {
      id: 2,
      title: "Looking for a co-founder with tech background",
      author: "Michael R.",
      avatar: "/placeholder.svg?height=32&width=32",
      category: "Partnerships",
      replies: 8,
      likes: 15,
      timeAgo: "4 hours ago",
      excerpt: "Building an e-commerce platform for local artisans. Need someone with React/Node.js skills...",
      featured: false,
    },
    {
      id: 3,
      title: "Success Story: From $0 to $10K MRR in 6 months",
      author: "Grace M.",
      avatar: "/placeholder.svg?height=32&width=32",
      category: "Success Stories",
      replies: 28,
      likes: 67,
      timeAgo: "1 day ago",
      excerpt: "Want to share my journey building a social media management tool...",
      featured: true,
    },
  ]

  const peerTeachers = [
    {
      id: 1,
      name: "David Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      expertise: "Web Development",
      rating: 4.9,
      students: 45,
      price: 25,
      location: "Nairobi, Kenya",
      skills: ["React", "Node.js", "MongoDB"],
      verified: true,
    },
    {
      id: 2,
      name: "Amara Okafor",
      avatar: "/placeholder.svg?height=40&width=40",
      expertise: "Digital Marketing",
      rating: 4.8,
      students: 32,
      price: 20,
      location: "Lagos, Nigeria",
      skills: ["SEO", "Social Media", "Content Strategy"],
      verified: true,
    },
    {
      id: 3,
      name: "James Mwangi",
      avatar: "/placeholder.svg?height=40&width=40",
      expertise: "Business Strategy",
      rating: 5.0,
      students: 28,
      price: 30,
      location: "Kampala, Uganda",
      skills: ["Business Planning", "Market Research", "Fundraising"],
      verified: true,
    },
  ]

  const mentors = [
    {
      id: 1,
      name: "Dr. Fatima Al-Rashid",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Serial Entrepreneur & Investor",
      company: "TechStars Africa",
      expertise: "Fintech, Scaling Startups",
      experience: "15+ years",
      mentees: 12,
      location: "Cairo, Egypt",
      available: true,
    },
    {
      id: 2,
      name: "Robert Kimani",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Product Manager",
      company: "Safaricom",
      expertise: "Product Development, Mobile Tech",
      experience: "8+ years",
      mentees: 8,
      location: "Nairobi, Kenya",
      available: false,
    },
  ]

  const collaborationProjects = [
    {
      id: 1,
      title: "EcoTrack - Sustainability App",
      description: "Building an app to help users track their carbon footprint and find eco-friendly alternatives",
      leader: "Emma Thompson",
      members: 4,
      maxMembers: 6,
      skills: ["React Native", "UI/UX", "Environmental Science"],
      status: "recruiting",
      category: "Mobile App",
    },
    {
      id: 2,
      title: "AgriConnect - Farmer Marketplace",
      description: "Connecting smallholder farmers directly with buyers to eliminate middlemen",
      leader: "Joseph Mutua",
      members: 3,
      maxMembers: 5,
      skills: ["Backend Development", "Market Research", "Agriculture"],
      status: "in-progress",
      category: "Web Platform",
    },
  ]

  const renderCommunity = () => (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">1,247</p>
            <p className="text-xs text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-accent">89</p>
            <p className="text-xs text-muted-foreground">Discussions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Handshake className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">156</p>
            <p className="text-xs text-muted-foreground">Connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search discussions..." className="pl-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            All Topics
          </Button>
          <Button size="sm" variant="outline">
            Business Strategy
          </Button>
          <Button size="sm" variant="outline">
            Tech Help
          </Button>
          <Button size="sm" variant="outline">
            Partnerships
          </Button>
          <Button size="sm" variant="outline">
            Success Stories
          </Button>
        </div>
      </div>

      {/* Featured Discussions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Featured Discussions</h3>
        <div className="space-y-4">
          {forumPosts
            .filter((post) => post.featured)
            .map((post) => (
              <Card key={post.id} className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.author}</p>
                        <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-base">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {post.replies} replies
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likes} likes
                      </span>
                    </div>
                    <Button size="sm">Join Discussion</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Recent Discussions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Discussions</h3>
        <div className="space-y-4">
          {forumPosts
            .filter((post) => !post.featured)
            .map((post) => (
              <Card key={post.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {post.author} • {post.timeAgo}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Start New Discussion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Start New Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="What's on your mind?" />
          <Button className="w-full">Create Discussion</Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderPeerTeaching = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Peer Teachers</h3>
        <Button size="sm">
          <BookOpen className="h-4 w-4 mr-2" />
          Become a Teacher
        </Button>
      </div>

      <div className="space-y-4">
        {peerTeachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{teacher.name}</h4>
                        {teacher.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{teacher.expertise}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {teacher.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${teacher.price}/hour</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{teacher.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teacher.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{teacher.students} students taught</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm">Book Session</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Teaching Stats */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Your Teaching Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-accent">12</p>
              <p className="text-sm text-muted-foreground">Students Taught</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">$480</p>
              <p className="text-sm text-muted-foreground">Earnings</p>
            </div>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            View Teaching Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderMentorship = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Find a Mentor</h3>
        <Button size="sm" variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Become a Mentor
        </Button>
      </div>

      <div className="space-y-4">
        {mentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mentor.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{mentor.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {mentor.title} at {mentor.company}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {mentor.location}
                      </p>
                    </div>
                    <Badge variant={mentor.available ? "secondary" : "outline"}>
                      {mentor.available ? "Available" : "Busy"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Expertise:</span> {mentor.expertise}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Experience:</span> {mentor.experience}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Current Mentees:</span> {mentor.mentees}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Profile
                    </Button>
                    <Button size="sm" disabled={!mentor.available} className="flex-1">
                      {mentor.available ? "Request Mentorship" : "Join Waitlist"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mentorship Program Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Mentorship Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• 1-on-1 guidance from experienced entrepreneurs</li>
            <li>• Monthly video calls and ongoing chat support</li>
            <li>• Access to mentor's network and resources</li>
            <li>• Goal setting and progress tracking</li>
          </ul>
          <Button className="w-full">Learn More</Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderCollaboration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Collaboration Projects</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Start Project
        </Button>
      </div>

      <div className="space-y-4">
        {collaborationProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  <CardDescription>Led by {project.leader}</CardDescription>
                </div>
                <Badge variant={project.status === "recruiting" ? "secondary" : "outline"}>
                  {project.status === "recruiting" ? "Recruiting" : "In Progress"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {project.members}/{project.maxMembers} members
                </span>
                <Badge variant="outline">{project.category}</Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Learn More
                </Button>
                <Button size="sm" disabled={project.status !== "recruiting"} className="flex-1">
                  {project.status === "recruiting" ? "Join Project" : "View Progress"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Creation */}
      <Card>
        <CardHeader>
          <CardTitle>Start Your Own Project</CardTitle>
          <CardDescription>Collaborate with fellow entrepreneurs on your next big idea</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="project-title">Project Title</Label>
            <Input id="project-title" placeholder="What are you building?" />
          </div>
          <div>
            <Label htmlFor="project-description">Description</Label>
            <Textarea id="project-description" placeholder="Describe your project and what help you need" />
          </div>
          <div>
            <Label htmlFor="skills-needed">Skills Needed</Label>
            <Input id="skills-needed" placeholder="e.g., React, UI/UX, Marketing" />
          </div>
          <Button className="w-full">
            <Rocket className="h-4 w-4 mr-2" />
            Launch Project
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-bold">Crew Hub</h1>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="community" className="text-xs">
              Community
            </TabsTrigger>
            <TabsTrigger value="teaching" className="text-xs">
              Teaching
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="text-xs">
              Mentors
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs">
              Projects
            </TabsTrigger>
          </TabsList>
          <TabsContent value="community" className="mt-4">
            {renderCommunity()}
          </TabsContent>
          <TabsContent value="teaching" className="mt-4">
            {renderPeerTeaching()}
          </TabsContent>
          <TabsContent value="mentorship" className="mt-4">
            {renderMentorship()}
          </TabsContent>
          <TabsContent value="projects" className="mt-4">
            {renderCollaboration()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
