"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  ShoppingCart,
  Clock,
  Star,
  ArrowLeft,
  Phone,
  Mail,
  Truck,
  MessageSquare,
  Info,
  AlertTriangle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/date-picker"

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.id
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockListing = {
      id: listingId,
      storeName: "Fresh Market",
      storeRating: 4.8,
      storeReviews: 124,
      storeDescription:
        "A local grocery store specializing in fresh produce and organic foods. We're committed to reducing food waste and supporting local farmers.",
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      email: "contact@freshmarket.com",
      distance: 2.3,
      feedType: "chicken",
      quantity: "50 lbs",
      price: "$45.00",
      expiry: "2 days over",
      daysOver: 2,
      lat: 40.7128,
      lng: -74.006,
      image: "/placeholder.svg?height=400&width=600",
      ingredients: [
        { name: "Lettuce Trimmings", percentage: 30 },
        { name: "Bread Crusts", percentage: 25 },
        { name: "Carrot Tops", percentage: 20 },
        { name: "Apple Peels", percentage: 15 },
        { name: "Grain Sweepings", percentage: 10 },
      ],
      nutritionalValue: {
        protein: "Medium",
        fiber: "High",
        vitamins: "Medium",
        minerals: "Medium",
      },
      suitableFor: ["Chickens", "Ducks", "Turkeys"],
      reviews: [
        { id: 1, farmer: "Green Acres Farm", rating: 5, comment: "Great quality feed, my chickens love it!" },
        { id: 2, farmer: "Sunny Meadows", rating: 4, comment: "Good value for the price, will buy again." },
        { id: 3, farmer: "Happy Hens Homestead", rating: 5, comment: "Very fresh despite being past expiry date." },
      ],
    }

    setTimeout(() => {
      setListing(mockListing)
      setLoading(false)
    }, 500)
  }, [listingId])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="ml-4 space-y-1">
              <div className="h-5 w-40 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-[300px] animate-pulse rounded-lg bg-muted"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="ml-4">
            <h1 className="text-lg font-semibold">
              {listing.feedType.charAt(0).toUpperCase() + listing.feedType.slice(1)} Feed
            </h1>
            <p className="text-sm text-muted-foreground">Listing #{listing.id}</p>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="rounded-lg overflow-hidden border">
              <img
                src={listing.image || "/placeholder.svg"}
                alt={`${listing.feedType} feed`}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="mt-6">
              <Tabs defaultValue="ingredients">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="ingredients" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ingredients Breakdown</CardTitle>
                      <CardDescription>What's included in this feed mix</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {listing.ingredients.map((ingredient, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{ingredient.name}</span>
                            <span className="text-sm">{ingredient.percentage}%</span>
                          </div>
                          <Progress value={ingredient.percentage} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="h-4 w-4 mr-2" />
                        Suitable for: {listing.suitableFor.join(", ")}
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="nutrition" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Nutritional Value</CardTitle>
                      <CardDescription>Estimated nutritional content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Protein</p>
                          <div className="flex items-center">
                            <Progress
                              value={
                                listing.nutritionalValue.protein === "High"
                                  ? 90
                                  : listing.nutritionalValue.protein === "Medium"
                                    ? 60
                                    : 30
                              }
                              className="h-2 mr-2 flex-1"
                            />
                            <span className="text-sm">{listing.nutritionalValue.protein}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Fiber</p>
                          <div className="flex items-center">
                            <Progress
                              value={
                                listing.nutritionalValue.fiber === "High"
                                  ? 90
                                  : listing.nutritionalValue.fiber === "Medium"
                                    ? 60
                                    : 30
                              }
                              className="h-2 mr-2 flex-1"
                            />
                            <span className="text-sm">{listing.nutritionalValue.fiber}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Vitamins</p>
                          <div className="flex items-center">
                            <Progress
                              value={
                                listing.nutritionalValue.vitamins === "High"
                                  ? 90
                                  : listing.nutritionalValue.vitamins === "Medium"
                                    ? 60
                                    : 30
                              }
                              className="h-2 mr-2 flex-1"
                            />
                            <span className="text-sm">{listing.nutritionalValue.vitamins}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Minerals</p>
                          <div className="flex items-center">
                            <Progress
                              value={
                                listing.nutritionalValue.minerals === "High"
                                  ? 90
                                  : listing.nutritionalValue.minerals === "Medium"
                                    ? 60
                                    : 30
                              }
                              className="h-2 mr-2 flex-1"
                            />
                            <span className="text-sm">{listing.nutritionalValue.minerals}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center text-sm text-amber-600">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        This feed is {listing.daysOver} days past expiry date
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Farmer Reviews</CardTitle>
                      <CardDescription>What other farmers are saying</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {listing.reviews.map((review) => (
                        <div key={review.id} className="pb-4 border-b last:border-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{review.farmer}</p>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm mt-1">{review.comment}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize">
                      {listing.feedType} Feed - {listing.quantity}
                    </CardTitle>
                    <CardDescription>From {listing.storeName}</CardDescription>
                  </div>
                  <div className="text-2xl font-bold">{listing.price}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(listing.storeRating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    {listing.storeRating} ({listing.storeReviews} reviews)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{listing.distance} miles away</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className={`${listing.daysOver > 2 ? "text-amber-600" : ""}`}>Expired: {listing.expiry}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium">About the Store</h3>
                  <p className="text-sm text-muted-foreground">{listing.storeDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{listing.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{listing.email}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{listing.address}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-medium">Schedule Pickup</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm">Select Date:</p>
                      <DatePicker date={pickupDate} setDate={setPickupDate} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Purchase Now
                </Button>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" /> Contact Store
                  </Button>
                  <Button variant="outline">
                    <Truck className="mr-2 h-4 w-4" /> Request Delivery
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Similar Listings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-16 h-16 rounded overflow-hidden">
                    <img
                      src="/placeholder.svg?height=64&width=64"
                      alt="Similar feed"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate capitalize">{listing.feedType} Feed - 30 lbs</h4>
                    <p className="text-sm text-muted-foreground">Super Foods - 5.7 miles</p>
                  </div>
                  <div className="font-medium">$28.00</div>
                </div>
                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-16 h-16 rounded overflow-hidden">
                    <img
                      src="/placeholder.svg?height=64&width=64"
                      alt="Similar feed"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate capitalize">{listing.feedType} Feed - 25 lbs</h4>
                    <p className="text-sm text-muted-foreground">City Market - 12.5 miles</p>
                  </div>
                  <div className="font-medium">$22.00</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full" asChild>
                  <Link href="/dashboard/farmer">View All Similar Listings</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

