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
import { FeedDetailsModal } from "@/components/feed-details-modal"

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
  const [showMap, setShowMap] = useState(true)
  const [farmLocation, setFarmLocation] = useState<{lat: number, lng: number} | null>(null)
  const [livestock, setLivestock] = useState<Livestock>({
    cattle: 0,
    pigs: 0,
    chickens: 0
  })
  const [selectedFeed, setSelectedFeed] = useState<{
    feed: Feed;
    storeName: string;
    storeAddress: string;
  } | null>(null);
  const [orders, setOrders] = useState<{
    id: string;
    store_name: string;
    feed_type: string;
    amount: number;
    total_price: number;
    status: string;
    purchase_date: string;
    ingredients: string;
  }[]>([])
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [expandedFeed, setExpandedFeed] = useState<string | null>(null);

  // Fetch livestock data
  const fetchLivestock = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      if (!user) {
        toast.error('Please log in to view livestock')
        router.push('/login')
        return
      }

      const { data: livestockData, error: livestockError } = await supabase
        .from('Livestock')
        .select('animal_type, count')
        .eq('farm_id', user.id)

      if (livestockError) {
        console.error('Livestock fetch error:', livestockError)
        throw livestockError
      }

      // Convert the database format to our Livestock interface format
      const formattedLivestock = livestockData.reduce((acc, curr) => {
        const animalType = curr.animal_type.toLowerCase()
        if (animalType in acc) {
          acc[animalType as keyof Livestock] = curr.count
        }
        return acc
      }, {
        cattle: 0,
        pigs: 0,
        chickens: 0
      } as Livestock)

      console.log('Fetched livestock:', formattedLivestock)
      setLivestock(formattedLivestock)
    } catch (error) {
      console.error('Error fetching livestock:', error)
      toast.error('Failed to load livestock data')
    }
  }

  // Add useEffect to fetch livestock data
  useEffect(() => {
    fetchLivestock()
  }, [])

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
        .select('*')
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

      // Always re-geocode the address to ensure accuracy
      if (farmData.address) {
        console.log('Geocoding farm address:', farmData.address);
        const coords = await geocodeAddress(farmData.address);
        console.log('Farm geocoding result:', coords);

        if (coords) {
          // Update the farm with new coordinates
          const { error: updateError } = await supabase
            .from('Farms')
            .update({ 
              lat: coords.lat, 
              lng: coords.lng 
            })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating farm coordinates:', updateError);
          } else {
            console.log('Updated farm coordinates:', coords);
            return coords;
          }
        }
      }

      // Return existing coordinates if geocoding failed
      if (farmData.lat && farmData.lng) {
        const coords = {
          lat: typeof farmData.lat === 'string' ? parseFloat(farmData.lat) : farmData.lat,
          lng: typeof farmData.lng === 'string' ? parseFloat(farmData.lng) : farmData.lng
        };
        console.log('Using existing farm coordinates:', coords);
        return coords;
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

      // Get the farm's location first
      const farmLoc = await getCurrentFarmLocation()
      if (!farmLoc) {
        console.log('No farm location available');
        return;
      }
      
      // Ensure coordinates are numbers
      farmLoc.lat = typeof farmLoc.lat === 'string' ? parseFloat(farmLoc.lat) : farmLoc.lat;
      farmLoc.lng = typeof farmLoc.lng === 'string' ? parseFloat(farmLoc.lng) : farmLoc.lng;
      
      console.log('Farm location:', farmLoc);
      setFarmLocation(farmLoc)

      // Then get all stores
      const { data: stores, error: storesError } = await supabase
        .from('Stores')
        .select('*')

      if (storesError) {
        console.error('Store fetch error:', storesError);
        throw storesError;
      }

      console.log('Fetched stores:', stores);

      // Always re-geocode store addresses to ensure accuracy
      const storesWithCoords = await Promise.all(stores.map(async (store) => {
        if (store.address) {
          console.log('Geocoding store address:', store.address);
          const coords = await geocodeAddress(store.address);
          if (coords) {
            // Update store coordinates in database
            const { error: updateError } = await supabase
              .from('Stores')
              .update({ 
                lat: coords.lat, 
                lng: coords.lng 
              })
              .eq('id', store.id);

            if (updateError) {
              console.error('Error updating store coordinates:', updateError);
            } else {
              console.log('Updated store coordinates:', coords);
              return { ...store, ...coords };
            }
          }
        }
        
        // Return existing coordinates if geocoding failed
        if (store.lat && store.lng) {
          return {
            ...store,
            lat: typeof store.lat === 'string' ? parseFloat(store.lat) : store.lat,
            lng: typeof store.lng === 'string' ? parseFloat(store.lng) : store.lng
          };
        }
        
        return store;
      }));

      // Then get all feed listings
      const { data: feedListings, error: feedError } = await supabase
        .from('Feed')
        .select('*')

      if (feedError) {
        console.error('Feed fetch error:', feedError);
        throw feedError;
      }

      // Calculate distances and combine data
      const listingsWithDistance = storesWithCoords
        .filter(store => {
          // Only include stores with valid coordinates
          const hasValidCoords = store.lat && store.lng && 
            !isNaN(store.lat) && !isNaN(store.lng) &&
            Math.abs(store.lat) <= 90 && Math.abs(store.lng) <= 180;
          
          if (!hasValidCoords) {
            console.log('Store with invalid coordinates:', store);
          }
          return hasValidCoords;
        })
        .map((store) => {
          const distance = calculateHaversineDistance(
            farmLoc.lat, 
            farmLoc.lng, 
            store.lat!, 
            store.lng!
          );
          
          const storeFeed = feedListings.filter(feed => feed.store_id === store.id)
          
          return {
            ...store,
            feed: storeFeed,
            distance
          }
        });

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

  // Initialize data and refresh when distance changes
  useEffect(() => {
    fetchListings()
  }, [distance])

  // Add a refresh effect when the component mounts and periodically
  useEffect(() => {
    // Initial fetch
    fetchListings()

    // Set up periodic refresh every 5 minutes
    const intervalId = setInterval(fetchListings, 5 * 60 * 1000)

    // Cleanup on unmount
    return () => clearInterval(intervalId)
  }, [])

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

  // Fetch orders
  const fetchOrders = async () => {
    try {
      // First, let's directly query the Feed table to see what's in it
      const { data: allFeeds, error: feedError } = await supabase
        .from('Feed')
        .select('*')
      
      console.log('DEBUG - All Feed table rows:', JSON.stringify(allFeeds, null, 2));

      const { data: ordersData, error: ordersError } = await supabase
        .from('Purchases')
        .select(`
          *,
          Stores (
            name
          ),
          Feed!inner (
            id,
            feed_type,
            ingredients,
            amount
          )
        `)
        .order('purchase_date', { ascending: false })

      if (ordersError) {
        console.error('Order fetch error:', ordersError);
        throw ordersError;
      }

      console.log('DEBUG - Orders with Feed data:', JSON.stringify(ordersData, null, 2));

      const formattedOrders = ordersData.map(order => {
        console.log('DEBUG - Processing order with Feed:', {
          orderId: order.id,
          feedData: order.Feed
        });
        return {
          id: order.id,
          store_name: order.Stores?.name || 'Unknown Store',
          feed_type: order.Feed?.feed_type || 'Unknown Feed',
          amount: order.amount,
          total_price: order.total_price,
          status: order.status,
          purchase_date: order.purchase_date,
          ingredients: order.Feed?.ingredients || 'No ingredients information available'
        };
      });

      console.log('DEBUG - Formatted orders with ingredients:', JSON.stringify(formattedOrders, null, 2));
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    }
  }

  // Initialize data
  useEffect(() => {
    fetchOrders()
  }, [])

  // Handle completing an order
  const handleCompleteOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId);
      console.log('Starting to complete order:', orderId);

      // Get the order details first
      const { data: order, error: orderError } = await supabase
        .from('Purchases')
        .select(`
          *,
          Feed!inner (
            id,
            amount,
            feed_type,
            store_id
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderError) {
        console.error('Order fetch error:', orderError);
        throw new Error(`Failed to fetch order: ${orderError.message}`);
      }

      if (!order || !order.Feed) {
        console.error('No order or feed data found:', order);
        throw new Error('Order or feed data not found');
      }

      console.log('Found order:', order);

      // Calculate new feed amount
      const newFeedAmount = order.Feed.amount - order.amount;
      console.log('Calculating new feed amount:', {
        currentAmount: order.Feed.amount,
        purchasedAmount: order.amount,
        newAmount: newFeedAmount
      });

      // Calculate reduction ratio for ingredients
      const reductionRatio = order.amount / order.Feed.amount;

      // Start transaction
      // 1. Update order status and remove feed_id reference
      const { error: statusError } = await supabase
        .from('Purchases')
        .update({ 
          status: 'completed',
          feed_id: null  // Remove reference to allow feed deletion
        })
        .eq('id', orderId);

      if (statusError) {
        console.error('Status update error:', statusError);
        throw new Error(`Failed to update status: ${statusError.message}`);
      }

      console.log('Updated order status to completed');

      // 2. Handle feed
      if (newFeedAmount <= 0) {
        // Delete the feed if amount would be 0 or less
        const { error: deleteFeedError } = await supabase
          .from('Feed')
          .delete()
          .eq('id', order.feed_id);

        if (deleteFeedError) {
          console.error('Feed deletion error:', deleteFeedError);
          throw new Error(`Failed to delete feed: ${deleteFeedError.message}`);
        }
        console.log('Deleted feed record');
      } else {
        // Update the feed amount if there's still some left
        const { error: feedError } = await supabase
          .from('Feed')
          .update({ amount: newFeedAmount })
          .eq('id', order.feed_id);

        if (feedError) {
          console.error('Feed update error:', feedError);
          throw new Error(`Failed to update feed: ${feedError.message}`);
        }
        console.log('Updated feed amount');
      }

      // 3. Handle ingredients
      console.log('Fetching ingredients for feed type:', order.Feed.feed_type);
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('Ingredients')
        .select('*')
        .eq('store_id', order.Feed.store_id)
        .eq('type', order.Feed.feed_type.toLowerCase());

      if (ingredientsError) {
        console.error('Ingredients fetch error:', ingredientsError);
        throw new Error(`Failed to fetch ingredients: ${ingredientsError.message}`);
      }

      console.log('Found ingredients:', ingredients);
      
      // Update or delete each ingredient
      for (const ingredient of ingredients) {
        const newAmount = ingredient.amount - (ingredient.amount * reductionRatio);
        console.log('Processing ingredient:', {
          id: ingredient.id,
          currentAmount: ingredient.amount,
          newAmount: newAmount
        });

        if (newAmount <= 0) {
          // Delete the ingredient if amount would be 0 or less
          const { error: deleteIngredientError } = await supabase
            .from('Ingredients')
            .delete()
            .eq('id', ingredient.id);

          if (deleteIngredientError) {
            console.error('Ingredient deletion error:', deleteIngredientError);
            throw new Error(`Failed to delete ingredient: ${deleteIngredientError.message}`);
          }
          console.log('Deleted ingredient:', ingredient.id);
        } else {
          // Update the ingredient amount if there's still some left
          const { error: updateError } = await supabase
            .from('Ingredients')
            .update({ amount: newAmount })
            .eq('id', ingredient.id);

          if (updateError) {
            console.error('Ingredient update error:', updateError);
            throw new Error(`Failed to update ingredient: ${updateError.message}`);
          }
          console.log('Updated ingredient:', ingredient.id);
        }
      }

      console.log('Order completion successful');
      toast.success('Order completed successfully');
      fetchOrders(); // Refresh the orders list
      fetchListings(); // Refresh the listings to reflect deleted feeds
    } catch (error: any) {
      console.error('Error completing order:', error);
      toast.error(error.message || 'Failed to complete order');
    } finally {
      setProcessingOrder(null);
    }
  };

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
                  <FeedRecommendations />
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
                      <Slider id="distance" max={500} step={1} value={distance} onValueChange={setDistance} />
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
                        zoom={10}
                        locations={[
                          { ...farmLocation, title: "Your Farm" },
                          ...filteredListings
                            .filter(store => store.lat && store.lng && !isNaN(store.lat) && !isNaN(store.lng))
                            .map(store => ({
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
                                    <Button 
                                      variant="ghost" 
                                      className="col-span-2 mt-1 h-auto p-0 text-left hover:bg-transparent"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedFeed(expandedFeed === feed.id ? null : feed.id);
                                      }}
                                    >
                                      <span className="text-sm text-muted-foreground underline">
                                        {expandedFeed === feed.id ? 'Hide ingredients' : 'Show ingredients'}
                                      </span>
                                    </Button>
                                    {expandedFeed === feed.id && (
                                      <div className="col-span-2 mt-2 rounded-md bg-muted p-3">
                                        <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
                                        <p className="text-sm text-muted-foreground">
                                          {feed.ingredients || 'No ingredients information available'}
                                        </p>
                                      </div>
                                    )}
                                    <Button 
                                      className="col-span-2 mt-2" 
                                      onClick={() => setSelectedFeed({
                                        feed,
                                        storeName: listing.name,
                                        storeAddress: listing.address
                                      })}
                                    >
                                      Purchase
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                No feed listings available
                              </div>
                            )}
                          </CardContent>
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
                  {loading ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Loading your orders...
                    </div>
                  ) : (
                    <div className="divide-y">
                      {orders?.length > 0 ? (
                        orders.map((order) => (
                          <div key={order.id} className="p-4">
                            <div className="grid gap-1">
                              <div className="flex items-center justify-between">
                                <div className="font-semibold">{order.store_name}</div>
                                <Badge variant={order.status === 'pending' ? 'outline' : 'default'}>
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {order.feed_type} - {order.amount} lbs
                              </div>
                              <div className="text-sm">
                                Total: ${order.total_price.toFixed(2)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Purchased on {new Date(order.purchase_date).toLocaleDateString()}
                              </div>
                              <Button 
                                variant="ghost" 
                                className="mt-1 h-auto p-0 text-left hover:bg-transparent"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              >
                                <span className="text-sm text-muted-foreground underline">
                                  {expandedOrder === order.id ? 'Hide ingredients' : 'Show ingredients'}
                                </span>
                              </Button>
                              {expandedOrder === order.id && (
                                <div className="mt-2 rounded-md bg-muted p-3">
                                  <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {order.ingredients}
                                  </p>
                                </div>
                              )}
                              {order.status === 'pending' && (
                                <Button 
                                  onClick={() => handleCompleteOrder(order.id)}
                                  disabled={processingOrder === order.id}
                                  className="mt-2"
                                >
                                  {processingOrder === order.id ? 'Processing...' : 'Complete Order'}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          You don't have any orders yet. Start by purchasing feed from available listings.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {selectedFeed && (
        <FeedDetailsModal
          isOpen={!!selectedFeed}
          onClose={() => {
            setSelectedFeed(null);
            fetchOrders(); // Fetch orders when modal closes
          }}
          feed={selectedFeed.feed}
          storeName={selectedFeed.storeName}
          storeAddress={selectedFeed.storeAddress}
          onPurchaseComplete={fetchOrders} // Add this prop to refresh orders after purchase
        />
      )}
    </div>
  )
}

