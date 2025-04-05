"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, ShoppingCart, Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { GoogleMap } from "@/components/google-map"

export default function Dashboard() {
  const [userType, setUserType] = useState("farmer") // or "store"
  const [listings, setListings] = useState([])
  const [distance, setDistance] = useState([25])
  const [showMap, setShowMap] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockListings = [
      {
        id: 1,
        storeName: "Fresh Market",
        address: "123 Main St, Anytown, USA",
        distance: 2.3,
        wasteType: "Produce",
        quantity: "50 lbs",
        expiry: "Today",
        lat: 40.7128,
        lng: -74.006,
      },
      {
        id: 2,
        storeName: "Super Foods",
        address: "456 Oak Ave, Somewhere, USA",
        distance: 5.7,
        wasteType: "Bakery",
        quantity: "30 lbs",
        expiry: "Tomorrow",
        lat: 40.7228,
        lng: -74.016,
      },
      {
        id: 3,
        storeName: "Value Grocery",
        address: "789 Pine Rd, Elsewhere, USA",
        distance: 8.2,
        wasteType: "Mixed",
        quantity: "75 lbs",
        expiry: "2 days",
        lat: 40.7328,
        lng: -73.996,
      },
      {
        id: 4,
        storeName: "City Market",
        address: "101 Elm St, Nowhere, USA",
        distance: 12.5,
        wasteType: "Dairy",
        quantity: "25 lbs",
        expiry: "Today",
        lat: 40.7028,
        lng: -74.026,
      },
      {
        id: 5,
        storeName: "Family Grocer",
        address: "202 Maple Dr, Anyplace, USA",
        distance: 15.8,
        wasteType: "Produce",
        quantity: "40 lbs",
        expiry: "Tomorrow",
        lat: 40.7428,
        lng: -74.036,
      },
    ]

    setListings(mockListings)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">FarmConnect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/messages" className="text-sm font-medium">
              Messages
            </Link>
            <Link href="/dashboard/profile" className="text-sm font-medium">
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
      <main className="flex-1">
        <div className="container px-4 py-6 md:py-8">
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Filters</h2>
                <p className="text-sm text-muted-foreground">Narrow down listings based on your preferences.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="waste-type">Waste Type</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="waste-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="produce">Produce</SelectItem>
                      <SelectItem value="bakery">Bakery</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="distance">Distance (miles)</Label>
                    <span className="text-sm text-muted-foreground">{distance}mi</span>
                  </div>
                  <Slider id="distance" max={50} step={1} value={distance} onValueChange={setDistance} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Select defaultValue="any">
                    <SelectTrigger id="expiry">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="available-now" />
                  <Label htmlFor="available-now">Available for pickup now</Label>
                </div>
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">Nearby Grocery Stores</h2>
                  <p className="text-sm text-muted-foreground">
                    Showing {listings.length} stores within {distance} miles of your location
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
                    {showMap ? "Hide Map" : "Show Map"}
                  </Button>
                  <Select defaultValue="distance">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance: Nearest</SelectItem>
                      <SelectItem value="quantity">Quantity: Highest</SelectItem>
                      <SelectItem value="expiry">Expiry: Soonest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showMap && (
                <div className="w-full h-[300px] rounded-lg overflow-hidden border">
                  <GoogleMap listings={listings} />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => (
                  <Card key={listing.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{listing.storeName}</CardTitle>
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <MapPin className="h-3 w-3" />
                          {listing.distance} mi
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {listing.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{listing.wasteType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                          <span>{listing.quantity}</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Expires: {listing.expiry}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Contact Store</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

