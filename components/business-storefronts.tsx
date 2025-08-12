"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Store,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  DollarSign,
  Star,
  MessageCircle,
  BarChart3,
  Camera,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

export function BusinessStorefronts() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const businessStats = {
    totalRevenue: 2450,
    totalOrders: 23,
    activeProducts: 8,
    customerRating: 4.8,
  }

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Sarah M.",
      product: "Custom Logo Design",
      amount: 150,
      status: "completed",
      date: "Oct 20, 2024",
    },
    {
      id: "ORD-002",
      customer: "John K.",
      product: "Website Development",
      amount: 800,
      status: "in-progress",
      date: "Oct 18, 2024",
    },
    {
      id: "ORD-003",
      customer: "Mary L.",
      product: "Social Media Package",
      amount: 200,
      status: "pending",
      date: "Oct 17, 2024",
    },
  ]

  const products = [
    {
      id: 1,
      name: "Custom Logo Design",
      price: 150,
      category: "Design",
      status: "active",
      orders: 12,
      rating: 4.9,
      image: "/generic-logo-design.png",
    },
    {
      id: 2,
      name: "Website Development",
      price: 800,
      category: "Development",
      status: "active",
      orders: 5,
      rating: 5.0,
      image: "/website-development.png",
    },
    {
      id: 3,
      name: "Social Media Package",
      price: 200,
      category: "Marketing",
      status: "active",
      orders: 8,
      rating: 4.7,
      image: "/social-media-marketing.png",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Business Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-green-600">${businessStats.totalRevenue}</p>
            <p className="text-xs text-muted-foreground">+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Orders</span>
            </div>
            <p className="text-2xl font-bold text-primary">{businessStats.totalOrders}</p>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Active Products</span>
            </div>
            <p className="text-2xl font-bold text-accent">{businessStats.activeProducts}</p>
            <p className="text-xs text-muted-foreground">2 pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Rating</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{businessStats.customerRating}</p>
            <p className="text-xs text-muted-foreground">From 23 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-medium">{order.product}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer} • {order.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.amount}</p>
                <Badge className={getStatusColor(order.status)} variant="secondary">
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full bg-transparent">
            View All Orders
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="h-16 flex-col gap-2">
          <Plus className="h-5 w-5" />
          Add Product
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2 bg-transparent">
          <Eye className="h-5 w-5" />
          View Storefront
        </Button>
      </div>
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Products & Services</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-semibold text-green-600">${product.price}</span>
                      <span className="text-muted-foreground">{product.orders} orders</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{product.status}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Product Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Product/Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product-name">Product Name</Label>
              <Input id="product-name" placeholder="Enter product name" />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" placeholder="0.00" />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your product or service" />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="e.g., Design, Development, Marketing" />
          </div>
          <Button className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Add Photos & Create Product
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Order Management</h3>
        <Badge variant="secondary">{recentOrders.length} Active Orders</Badge>
      </div>

      <div className="space-y-4">
        {recentOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="font-medium">{order.id}</span>
                </div>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{order.product}</h4>
                <p className="text-sm text-muted-foreground">Customer: {order.customer}</p>
                <p className="text-sm text-muted-foreground">Order Date: {order.date}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-green-600">${order.amount}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm">Update Status</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Business Analytics</h3>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Revenue chart visualization</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">$850</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">$1,200</p>
              <p className="text-sm text-muted-foreground">Last Month</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">+18%</p>
              <p className="text-sm text-muted-foreground">Growth</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Top Performing Products
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {products.slice(0, 3).map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.orders} orders</p>
                </div>
              </div>
              <span className="font-semibold text-green-600">${product.price * product.orders}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Customer Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Customer Satisfaction</span>
              <span className="text-sm font-medium">96%</span>
            </div>
            <Progress value={96} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Repeat Customers</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Response Time</span>
              <span className="text-sm font-medium">2.3 hours avg</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Store className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Business Storefronts</h1>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="text-xs">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="text-xs">
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs">
              Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-4">
            {renderDashboard()}
          </TabsContent>
          <TabsContent value="products" className="mt-4">
            {renderProducts()}
          </TabsContent>
          <TabsContent value="orders" className="mt-4">
            {renderOrders()}
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            {renderAnalytics()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
