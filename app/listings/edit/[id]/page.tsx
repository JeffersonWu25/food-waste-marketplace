"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Trash } from "lucide-react"

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.id

  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState({
    title: "",
    description: "",
    feedType: "",
    quantity: "",
    unit: "lbs",
    price: "",
    expiry: undefined as Date | undefined,
    pickupTimes: "",
  })

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    setTimeout(() => {
      setListing({
        title: "Chicken Feed - Produce Mix",
        description:
          "Expired produce suitable for chicken feed. Includes lettuce, carrots, and other vegetable trimmings.",
        feedType: "chicken",
        quantity: "50",
        unit: "lbs",
        price: "15",
        expiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        pickupTimes: "Mon-Fri 3-5pm",
      })
      setLoading(false)
    }, 500)
  }, [listingId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API
    alert("Listing updated successfully!")
    router.push("/dashboard/store?tab=listings")
  }

  const handleDelete = () => {
    // In a real app, this would call an API
    if (confirm("Are you sure you want to delete this listing?")) {
      alert("Listing deleted successfully!")
      router.push("/dashboard/store?tab=listings")
    }
  }

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
          <div className="max-w-3xl mx-auto">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 animate-pulse rounded bg-muted"></div>
              <div className="h-24 animate-pulse rounded bg-muted"></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-10 animate-pulse rounded bg-muted"></div>
                <div className="h-10 animate-pulse rounded bg-muted"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Edit Listing</h1>
              <p className="text-sm text-muted-foreground">Listing #{listingId}</p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete Listing
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <div className="container max-w-3xl px-4 py-6 md:py-8">
          <Card>
            <CardHeader>
              <CardTitle>Edit Listing</CardTitle>
              <CardDescription>Update your food waste listing details</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Listing Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Produce Waste Available Daily"
                    value={listing.title}
                    onChange={(e) => setListing({ ...listing, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the type of food waste, condition, etc."
                    value={listing.description}
                    onChange={(e) => setListing({ ...listing, description: e.target.value })}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="feed-type">Feed Type</Label>
                    <Select
                      value={listing.feedType}
                      onValueChange={(value) => setListing({ ...listing, feedType: value })}
                      required
                    >
                      <SelectTrigger id="feed-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chicken">Chicken Feed</SelectItem>
                        <SelectItem value="pig">Pig Feed</SelectItem>
                        <SelectItem value="cattle">Cattle Feed</SelectItem>
                        <SelectItem value="goat">Goat Feed</SelectItem>
                        <SelectItem value="sheep">Sheep Feed</SelectItem>
                        <SelectItem value="mixed">Mixed Feed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={listing.quantity}
                        onChange={(e) => setListing({ ...listing, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={listing.unit} onValueChange={(value) => setListing({ ...listing, unit: value })}>
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lbs">lbs</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="boxes">boxes</SelectItem>
                          <SelectItem value="pallets">pallets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={listing.price}
                      onChange={(e) => setListing({ ...listing, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <DatePicker date={listing.expiry} setDate={(date) => setListing({ ...listing, expiry: date })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup-times">Available Pickup Times</Label>
                  <Input
                    id="pickup-times"
                    placeholder="e.g., Mon-Fri 3-5pm"
                    value={listing.pickupTimes}
                    onChange={(e) => setListing({ ...listing, pickupTimes: e.target.value })}
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex gap-4 justify-end">
              <Button variant="outline" asChild>
                <Link href="/dashboard/store?tab=listings">Cancel</Link>
              </Button>
              <Button type="submit" form="edit-form">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

