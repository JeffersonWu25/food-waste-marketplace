"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"

export default function CreateListingPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [wasteType, setWasteType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("lbs")
  const [expiry, setExpiry] = useState<Date | undefined>(undefined)
  const [pickupTimes, setPickupTimes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle listing creation logic here
    console.log("Creating listing with:", { title, description, wasteType, quantity, unit, expiry, pickupTimes })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">FarmConnect</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/listings" className="text-sm font-medium text-primary">
              Listings
            </Link>
            <Link href="/dashboard/messages" className="text-sm font-medium">
              Messages
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container max-w-3xl px-4 py-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Create New Listing</h1>
            <p className="text-muted-foreground">List your available food waste for local farmers</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Listing Title</Label>
              <Input
                id="title"
                placeholder="e.g., Produce Waste Available Daily"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the type of food waste, condition, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="waste-type">Waste Type</Label>
                <Select value={wasteType} onValueChange={setWasteType} required>
                  <SelectTrigger id="waste-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="produce">Produce</SelectItem>
                    <SelectItem value="bakery">Bakery</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="meat">Meat</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
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
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={unit} onValueChange={setUnit}>
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
                <Label htmlFor="expiry">Expiry Date</Label>
                <DatePicker date={expiry} setDate={setExpiry} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup-times">Available Pickup Times</Label>
                <Input
                  id="pickup-times"
                  placeholder="e.g., Mon-Fri 3-5pm"
                  value={pickupTimes}
                  onChange={(e) => setPickupTimes(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit">Create Listing</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

