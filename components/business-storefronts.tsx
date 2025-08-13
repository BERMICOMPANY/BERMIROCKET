"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import {
  Store,
  Package,
  ShoppingCart,
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
  const [businessData, setBusinessData] = useState({
    businesses: [],
    products: [],
    orders: [],
    currency: "USD",
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      activeProducts: 0,
      customerRating: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBusinessData()
  }, [])

  const loadBusinessData = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    try {
      // Get user profile for currency
      const { data: profile } = await supabase.from("profiles").select("currency").eq("id", user.id).single()

      // Get user businesses
      const { data: businesses } = await supabase.from("businesses").select("*").eq("user_id", user.id)

      // Get products
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      // Get orders
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })

      // Calculate stats
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0
      const totalOrders = orders?.length || 0
      const activeProducts = products?.filter((p) => p.status === "active").length || 0
      const avgRating = products?.reduce((sum, p) => sum + (p.rating || 0), 0) / (products?.length || 1) || 0

      setBusinessData({
        businesses: businesses || [],
        products: products || [],
        orders: orders || [],
        currency: profile?.currency || "USD",
        stats: {
          totalRevenue,
          totalOrders,
          activeProducts,
          customerRating: Math.round(avgRating * 10) / 10,
        },
      })
    } catch (error) {
      console.error("Error loading business data:", error)
    } finally {
      setLoading(false)
    }
  }

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
            <p className="text-2xl font-bold text-green-600">
              {businessData.currency} {businessData.stats.totalRevenue}
            </p>
            <p className="text-xs text-muted-foreground">
              {businessData.stats.totalRevenue > 0 ? "Growing business" : "Start selling"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Orders</span>
            </div>
            <p className="text-2xl font-bold text-primary">{businessData.stats.totalOrders}</p>
            <p className="text-xs text-muted-foreground">
              {businessData.stats.totalOrders > 0 ? "Orders received" : "First order coming"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Active Products</span>
            </div>
            <p className="text-2xl font-bold text-accent">{businessData.stats.activeProducts}</p>
            <p className="text-xs text-muted-foreground">
              {businessData.products.length - businessData.stats.activeProducts} pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Rating</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{businessData.stats.customerRating || "N/A"}</p>
            <p className="text-xs text-muted-foreground">From {businessData.stats.totalOrders} reviews</p>
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
          {businessData.orders.length > 0 ? (
            businessData.orders.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-medium">{order.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Order #{order.id.slice(0, 8)} • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {businessData.currency} {order.total_amount}
                  </p>
                  <Badge className={getStatusColor(order.status)} variant="secondary">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No orders yet. Start by adding products to your storefront!
            </p>
          )}
          {businessData.orders.length > 5 && (
            <Button variant="outline" className="w-full bg-transparent">
              View All Orders
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="h-16 flex-col gap-2" onClick={() => setActiveTab("products")}>
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
        {businessData.products.length > 0 ? (
          businessData.products.map((product: any) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={product.image_url || "/placeholder.svg"}
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
                        <span className="font-semibold text-green-600">
                          {businessData.currency} {product.price}
                        </span>
                        <span className="text-muted-foreground">{product.orders_count || 0} orders</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{product.rating || "N/A"}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">{product.status}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You haven't added any products yet.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        )}
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
              <Label htmlFor="price">Price ({businessData.currency})</Label>
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
        <Badge variant="secondary">{businessData.orders.length} Total Orders</Badge>
      </div>

      <div className="space-y-4">
        {businessData.orders.length > 0 ? (
          businessData.orders.map((order: any) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-medium">#{order.id.slice(0, 8)}</span>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium">{order.product_name}</h4>
                  <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
                  <p className="text-sm text-muted-foreground">
                    Order Date: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-green-600">
                    {businessData.currency} {order.total_amount}
                  </span>
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
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No orders yet.</p>
              <p className="text-sm text-muted-foreground">
                Orders will appear here once customers start purchasing your products.
              </p>
            </CardContent>
          </Card>
        )}
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
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Revenue visualization coming soon</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {businessData.currency} {businessData.stats.totalRevenue}
              </p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{businessData.stats.totalOrders}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {businessData.stats.totalOrders > 0
                  ? `${businessData.currency} ${Math.round(businessData.stats.totalRevenue / businessData.stats.totalOrders)}`
                  : "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
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
          {businessData.products.length > 0 ? (
            businessData.products.slice(0, 3).map((product: any, index: number) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.orders_count || 0} orders</p>
                  </div>
                </div>
                <span className="font-semibold text-green-600">
                  {businessData.currency} {(product.orders_count || 0) * product.price}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">Add products to see performance analytics</p>
          )}
        </CardContent>
      </Card>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your business data...</p>
        </div>
      </div>
    )
  }

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
