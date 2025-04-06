"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, ShoppingCart, Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { GoogleMap } from "@/components/google-map"
import { FarmerSidebar } from "@/components/farmer-sidebar"
import { LivestockInventory } from "@/components/livestock-inventory"
import { FeedRecommendations } from "@/components/feed-recommendations"
import { supabase } from "@/lib/supabase"
import { geocodeAddress } from "@/lib/geocoding"
import { toast } from "sonner"

interface Store {
  id: string
  name: string
  address: string
  phone: string
  email: string
  rating: number
  lat?: number
  lng?: number
}

interface Feed {
  id: string
  store_id: string
  feed_type: string
  amount: number
  ingredients: string
  price: number
}

interface Listing extends Store {
  feed: Feed[]
  distance: number
}

interface Livestock {
  cattle: number
  pigs: number
  chickens: number
}

// Haversine formula to calculate distance between two points
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function FarmerDashboard() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [distance, setDistance] = useState([25])
  const [feedType, setFeedType] = useState("all")
  const [maxPrice, setMaxPrice] = useState<number | "any">("any")
  const [showMap, setShowMap] = useState(false)
  const [farmLocation, setFarmLocation] = useState<{lat: number, lng: number} | null>(null)
  const [livestock, setLivestock] = useState<Livestock>({
    cattle: 50,
    pigs: 30,
    chickens: 100
  })

  // Get current farm's location
  const getCurrentFarmLocation = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        console.log('No user found');
        toast.error("Please log in to view listings")
        router.push('/login')
        return null
      }

      console.log('Fetching farm data for user:', user.id);

      const { data: farmData, error: farmError } = await supabase
        .from('Farms')
        .select('*')  // Select all columns to see the address
        .eq('id', user.id)
        .single()

      if (farmError) {
        console.error('Farm fetch error:', farmError);
        if (farmError.code === 'PGRST116') {
          toast.error("Access denied. This account is not registered as a farm")
          router.push('/login')
          return null
        }
        throw farmError
      }

      console.log('Farm data:', farmData);

      // If we don't have coordinates but have an address, get coordinates
      if ((!farmData.lat || !farmData.lng) && farmData.address) {
        console.log('No coordinates found, geocoding address:', farmData.address);
        const coords = await geocodeAddress(farmData.address);
        console.log('Geocoding result:', coords);

        if (coords) {
          // Update the farm with new coordinates
          const { error: updateError } = await supabase
            .from('Farms')
            .update({ lat: coords.lat, lng: coords.lng })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating farm coordinates:', updateError);
          } else {
            console.log('Updated farm coordinates:', coords);
            return coords;
          }
        }
      }

      // Return existing coordinates if we have them
      if (farmData.lat && farmData.lng) {
        console.log('Returning existing coordinates:', { lat: farmData.lat, lng: farmData.lng });
        return { lat: farmData.lat, lng: farmData.lng };
      }

      console.log('No coordinates available for farm');
      return null;
    } catch (error) {
      console.error('Error getting farm location:', error)
      toast.error('Failed to get farm location')
      return null
    }
  }

  // Fetch stores and their feed listings
  const fetchListings = async () => {
    try {
      setLoading(true)

      // First get all stores
      const { data: stores, error: storesError } = await supabase
        .from('Stores')
        .select('*')

      if (storesError) {
        console.error('Store fetch error:', storesError);
        throw storesError;
      }

      console.log('Fetched stores:', stores);

      // Then get all feed listings
      const { data: feedListings, error: feedError } = await supabase
        .from('Feed')
        .select('*')

      if (feedError) {
        console.error('Feed fetch error:', feedError);
        throw feedError;
      }

      console.log('Fetched feed listings:', feedListings);

      // Get the farm's location
      const farmLoc = await getCurrentFarmLocation()
      if (!farmLoc) {
        console.log('No farm location available');
        return;
      }
      setFarmLocation(farmLoc)

      // For stores without coordinates, geocode their addresses
      const storesWithCoords = await Promise.all(stores.map(async (store) => {
        if ((!store.lat || !store.lng) && store.address) {
          console.log('Geocoding store address:', store.address);
          const coords = await geocodeAddress(store.address);
          if (coords) {
            // Update store coordinates in database
            const { error: updateError } = await supabase
              .from('Stores')
              .update({ lat: coords.lat, lng: coords.lng })
              .eq('id', store.id);

            if (updateError) {
              console.error('Error updating store coordinates:', updateError);
            } else {
              console.log('Updated store coordinates:', coords);
              return { ...store, ...coords };
            }
          }
        }
        return store;
      }));

      // Calculate distances and combine data
      const listingsWithDistance = storesWithCoords.map((store) => {
        const distance = store.lat && store.lng ? 
          calculateHaversineDistance(farmLoc.lat, farmLoc.lng, store.lat, store.lng) : 
          Number.MAX_VALUE;
        
        const storeFeed = feedListings.filter(feed => feed.store_id === store.id)
        
        return {
          ...store,
          feed: storeFeed,
          distance
        }
      })

      console.log('Listings with distances:', listingsWithDistance);

      // Sort by distance and filter by max distance
      const filteredListings = listingsWithDistance
        .filter(listing => listing.distance <= distance[0])
        .sort((a, b) => a.distance - b.distance)

      console.log('Filtered listings:', filteredListings);
      setListings(filteredListings)
    } catch (error) {
      console.error('Error fetching listings:', error)
      toast.error('Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  // Initialize data
  useEffect(() => {
    fetchListings()
  }, [distance])

  // Filter listings based on feed type and price
  const filteredListings = listings.map(listing => ({
    ...listing,
    feed: listing.feed.filter(feed => {
      const matchesType = feedType === "all" || feed.feed_type.toLowerCase() === feedType.toLowerCase();
      const matchesPrice = maxPrice === "any" || (typeof feed.price === 'number' && feed.price <= Number(maxPrice));
      return matchesType && matchesPrice;
    })
  })).filter(listing => {
    // Only include listings that have at least one matching feed after filtering
    return listing.feed.length > 0 && listing.distance <= distance[0];
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/dashboard/farmer" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">FarmConnect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard/farmer" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/dashboard/farmer/messages" className="text-sm font-medium">
              Messages
            </Link>
            <Link href="/dashboard/farmer/profile" className="text-sm font-medium">
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
        <FarmerSidebar />
        <main className="flex-1 p-4 md:p-6">
          <Tabs defaultValue="search">
            <TabsList className="mb-4">
              <TabsTrigger value="search">Search Listings</TabsTrigger>
              <TabsTrigger value="inventory">Livestock Inventory</TabsTrigger>
              <TabsTrigger value="orders">My Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <div className="space-y-6">
                  <FeedRecommendations livestock={livestock} />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="feed-type">Feed Type</Label>
                      <Select value={feedType} onValueChange={setFeedType}>
                        <SelectTrigger id="feed-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="chicken">Chicken Feed</SelectItem>
                          <SelectItem value="pig">Pig Feed</SelectItem>
                          <SelectItem value="cattle">Cattle Feed</SelectItem>
                          <SelectItem value="goat">Goat Feed</SelectItem>
                          <SelectItem value="sheep">Sheep Feed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="distance">Distance (miles)</Label>
                        <span className="text-sm text-muted-foreground">{distance}mi</span>
                      </div>
                      <Slider id="distance" max={5000} step={1} value={distance} onValueChange={setDistance} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Max Price</Label>
                      <Select value={maxPrice.toString()} onValueChange={(value) => setMaxPrice(value === "any" ? "any" : Number(value))}>
                        <SelectTrigger id="price">
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Price</SelectItem>
                          <SelectItem value="5">Under $5</SelectItem>
                          <SelectItem value="10">Under $10</SelectItem>
                          <SelectItem value="30">Under $30</SelectItem>
                          <SelectItem value="50">Under $50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold tracking-tight">Available Feed Listings</h2>
                      <p className="text-sm text-muted-foreground">
                        {loading ? (
                          "Loading listings..."
                        ) : (
                          `Showing ${filteredListings.length} listings within ${distance} miles of your location`
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-map"
                        checked={showMap}
                        onCheckedChange={setShowMap}
                      />
                      <Label htmlFor="show-map">Show Map</Label>
                    </div>
                  </div>

                  {showMap && farmLocation && (
                    <div className="h-[400px] rounded-lg border">
                      <GoogleMap
                        center={farmLocation}
                        locations={[
                          { ...farmLocation, title: "Your Farm" },
                          ...filteredListings.map(store => ({
                            lat: store.lat!,
                            lng: store.lng!,
                            title: store.name,
                            address: store.address
                          }))
                        ]}
                      />
                    </div>
                  )}

                  {loading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : filteredListings.length === 0 ? (
                    <div className="text-center py-8">No listings found within the selected distance.</div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredListings.map((listing) => (
                        <Card key={listing.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle>{listing.name}</CardTitle>
                              <Badge variant="outline" className="flex gap-1 items-center">
                                <MapPin className="h-3 w-3" />
                                {listing.distance.toFixed(1)} mi
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {listing.address}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            {listing.feed.length > 0 ? (
                              <div className="space-y-2">
                                {listing.feed.map((feed, index) => (
                                  <div key={feed.id} className={`grid grid-cols-2 gap-2 text-sm ${index > 0 ? 'pt-2 border-t' : ''}`}>
                                    <div className="flex items-center gap-1">
                                      <Package className="h-4 w-4 text-muted-foreground" />
                                      <span className="capitalize">{feed.feed_type || 'Unknown'} Feed</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                      <span>{feed.amount ? `${feed.amount} lbs` : 'Amount not specified'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span>Available Now</span>
                                    </div>
                                    <div className="flex items-center gap-1 font-medium">
                                      <span>Price: ${typeof feed.price === 'number' ? feed.price.toFixed(2) : 'Contact store'}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                No feed listings available
                              </div>
                            )}
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" disabled={listing.feed.length === 0}>
                              {listing.feed.length > 0 ? "View Details" : "No Feed Available"}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inventory">
              <LivestockInventory />
            </TabsContent>

            <TabsContent value="orders">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">My Orders</h2>
                  <p className="text-muted-foreground">Track your purchases and scheduled pickups</p>
                </div>

                <div className="rounded-md border">
                  <div className="p-4 text-center text-muted-foreground">
                    You don't have any orders yet. Start by purchasing feed from available listings.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

