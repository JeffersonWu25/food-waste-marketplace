"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash, DollarSign, Tag, BarChart3, Truck } from "lucide-react"
import { StoreSidebar } from "@/components/store-sidebar"
import { GroceryInventory } from "@/components/grocery-inventory"
import { FeedCalculator } from "@/components/feed-calculator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function StoreDashboard() {
  const [activeListings, setActiveListings] = useState([])
  const [pendingPickups, setPendingPickups] = useState([])

  // Mock data for demonstration
  useEffect(() => {
    const mockListings = [
      {
        id: 1,
        feedType: "chicken",
        quantity: "50 lbs",
        price: "$15.00",
        expiry: "Today",
        created: "2 days ago",
        views: 12,
        interested: 3,
      },
      {
        id: 2,
        feedType: "pig",
        quantity: "30 lbs",
        price: "$12.00",
        expiry: "Tomorrow",
        created: "1 day ago",
        views: 8,
        interested: 1,
      },
      {
        id: 3,
        feedType: "cattle",
        quantity: "75 lbs",
        price: "$25.00",
        expiry: "2 days",
        created: "3 hours ago",
        views: 4,
        interested: 0,
      },
    ]

    const mockPickups = [
      {
        id: 1,
        farmerName: "Green Acres Farm",
        feedType: "chicken",
        quantity: "50 lbs",
        price: "$15.00",
        scheduledDate: "Today, 3:00 PM",
        status: "Confirmed",
      },
      {
        id: 2,
        farmerName: "Happy Hills Ranch",
        feedType: "pig",
        quantity: "30 lbs",
        price: "$12.00",
        scheduledDate: "Tomorrow, 10:00 AM",
        status: "Pending",
      },
    ]

    setActiveListings(mockListings)
    setPendingPickups(mockPickups)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/dashboard/store" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">FarmConnect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard/store" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/store/messages" className="text-sm font-medium">
              Messages
            </Link>
            <Link href="/dashboard/store/profile" className="text-sm font-medium">
              Profile
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
              </svg>
              <span className="sr-only">Account</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <StoreSidebar />
        <main className="flex-1 p-4 md:p-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Grocery Inventory</TabsTrigger>
              <TabsTrigger value="calculator">Feed Calculator</TabsTrigger>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="pickups">Scheduled Pickups</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeListings.length}</div>
                    <p className="text-xs text-muted-foreground">+2 from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingPickups.length}</div>
                    <p className="text-xs text-muted-foreground">+1 from yesterday</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$142.00</div>
                    <p className="text-xs text-muted-foreground">+$38.00 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Waste Recycled</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">320 lbs</div>
                    <p className="text-xs text-muted-foreground">+120 lbs from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Recent Listings</CardTitle>
                    <CardDescription>Your most recently created listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeListings.slice(0, 3).map((listing) => (
                        <div
                          key={listing.id}
                          className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                        >
                          <div className="space-y-1">
                            <p className="font-medium capitalize">
                              {listing.feedType} Feed - {listing.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">Listed {listing.created}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{listing.price}</p>
                            <p className="text-sm text-muted-foreground">{listing.views} views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/store?tab=listings">View All Listings</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Upcoming Pickups</CardTitle>
                    <CardDescription>Scheduled pickups from farmers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingPickups.map((pickup) => (
                        <div
                          key={pickup.id}
                          className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">{pickup.farmerName}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {pickup.feedType} Feed - {pickup.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{pickup.scheduledDate}</p>
                            <Badge variant={pickup.status === "Confirmed" ? "default" : "outline"}>
                              {pickup.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/store?tab=pickups">View All Pickups</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventory">
              <GroceryInventory />
            </TabsContent>

            <TabsContent value="calculator">
              <FeedCalculator />
            </TabsContent>

            <TabsContent value="listings">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">My Listings</h2>
                    <p className="text-muted-foreground">Manage your active food waste listings</p>
                  </div>
                  <Button asChild>
                    <Link href="/listings/create">
                      <Plus className="mr-2 h-4 w-4" /> Create New Listing
                    </Link>
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feed Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeListings.map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell className="font-medium capitalize">{listing.feedType} Feed</TableCell>
                          <TableCell>{listing.quantity}</TableCell>
                          <TableCell>{listing.price}</TableCell>
                          <TableCell>{listing.expiry}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Active</Badge>
                          </TableCell>
                          <TableCell>{listing.interested} farmers</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                              </svg>
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pickups">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">Scheduled Pickups</h2>
                  <p className="text-muted-foreground">Manage pickup requests from farmers</p>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Farmer</TableHead>
                        <TableHead>Feed Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Scheduled Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingPickups.map((pickup) => (
                        <TableRow key={pickup.id}>
                          <TableCell className="font-medium">{pickup.farmerName}</TableCell>
                          <TableCell className="capitalize">{pickup.feedType} Feed</TableCell>
                          <TableCell>{pickup.quantity}</TableCell>
                          <TableCell>{pickup.price}</TableCell>
                          <TableCell>{pickup.scheduledDate}</TableCell>
                          <TableCell>
                            <Badge variant={pickup.status === "Confirmed" ? "default" : "outline"}>
                              {pickup.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M5 12h14"></path>
                                <path d="M12 5v14"></path>
                              </svg>
                              <span className="sr-only">Confirm</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                              </svg>
                              <span className="sr-only">Cancel</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

