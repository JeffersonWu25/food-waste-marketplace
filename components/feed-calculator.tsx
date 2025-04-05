"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, Tag, ArrowRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Feed conversion rates (simplified for demonstration)
const FEED_CONVERSION = {
  Produce: {
    chicken: 0.8,
    pig: 0.6,
    cattle: 0.4,
    goat: 0.7,
    sheep: 0.6,
  },
  Bakery: {
    chicken: 0.5,
    pig: 0.9,
    cattle: 0.3,
    goat: 0.4,
    sheep: 0.4,
  },
  Dairy: {
    chicken: 0.3,
    pig: 0.8,
    cattle: 0.5,
    goat: 0.6,
    sheep: 0.5,
  },
  Meat: {
    chicken: 0.7,
    pig: 0.9,
    cattle: 0.6,
    goat: 0.5,
    sheep: 0.5,
  },
  "Dry Goods": {
    chicken: 0.9,
    pig: 0.7,
    cattle: 0.5,
    goat: 0.6,
    sheep: 0.6,
  },
}

export function FeedCalculator() {
  const [groceryItems, setGroceryItems] = useState([
    { id: 1, name: "Lettuce", category: "Produce", quantity: 20, unit: "lbs" },
    { id: 2, name: "Bread", category: "Bakery", quantity: 15, unit: "loaves" },
    { id: 3, name: "Milk", category: "Dairy", quantity: 10, unit: "gallons" },
    { id: 4, name: "Apples", category: "Produce", quantity: 30, unit: "lbs" },
    { id: 5, name: "Chicken", category: "Meat", quantity: 25, unit: "lbs" },
  ])

  const [calculatedFeed, setCalculatedFeed] = useState({
    chicken: 0,
    pig: 0,
    cattle: 0,
    goat: 0,
    sheep: 0,
  })

  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [listingPrices, setListingPrices] = useState({
    chicken: "",
    pig: "",
    cattle: "",
    goat: "",
    sheep: "",
  })

  // Calculate potential animal feed based on selected grocery items
  const calculateFeed = () => {
    const result = {
      chicken: 0,
      pig: 0,
      cattle: 0,
      goat: 0,
      sheep: 0,
    }

    groceryItems
      .filter((item) => selectedItems.includes(item.id))
      .forEach((item) => {
        // Convert quantity to pounds for calculation
        let quantityInLbs = item.quantity
        if (item.unit === "gallons") quantityInLbs = item.quantity * 8.34 // Approximate weight of a gallon
        if (item.unit === "loaves") quantityInLbs = item.quantity * 1.5 // Approximate weight of a loaf

        // Apply conversion rates
        const conversions = FEED_CONVERSION[item.category as keyof typeof FEED_CONVERSION]
        if (conversions) {
          result.chicken += quantityInLbs * conversions.chicken
          result.pig += quantityInLbs * conversions.pig
          result.cattle += quantityInLbs * conversions.cattle
          result.goat += quantityInLbs * conversions.goat
          result.sheep += quantityInLbs * conversions.sheep
        }
      })

    // Round to 1 decimal place
    Object.keys(result).forEach((key) => {
      result[key as keyof typeof result] = Math.round(result[key as keyof typeof result] * 10) / 10
    })

    setCalculatedFeed(result)
  }

  const toggleItemSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const createListings = () => {
    // This would typically create listings for each feed type with a price
    console.log("Creating listings with prices:", listingPrices)
    alert("Listings created successfully! Check your active listings.")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Feed Calculator</h2>
        <p className="text-muted-foreground">Calculate how much animal feed you can produce from your grocery items</p>
      </div>

      <Tabs defaultValue="calculate">
        <TabsList>
          <TabsTrigger value="calculate">Calculate Feed</TabsTrigger>
          <TabsTrigger value="create">Create Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="calculate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Grocery Items</CardTitle>
              <CardDescription>Choose the items you want to convert into animal feed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groceryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        {item.quantity} {item.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button onClick={calculateFeed} className="ml-auto">
                <Calculator className="mr-2 h-4 w-4" /> Calculate Feed
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calculated Feed Output</CardTitle>
              <CardDescription>Potential animal feed that can be produced from selected items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Chicken Feed</span>
                  <span className="text-2xl font-bold">{calculatedFeed.chicken} lbs</span>
                </div>
                <div className="flex flex-col p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Pig Feed</span>
                  <span className="text-2xl font-bold">{calculatedFeed.pig} lbs</span>
                </div>
                <div className="flex flex-col p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Cattle Feed</span>
                  <span className="text-2xl font-bold">{calculatedFeed.cattle} lbs</span>
                </div>
                <div className="flex flex-col p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Goat Feed</span>
                  <span className="text-2xl font-bold">{calculatedFeed.goat} lbs</span>
                </div>
                <div className="flex flex-col p-4 border rounded-lg">
                  <span className="text-sm text-muted-foreground">Sheep Feed</span>
                  <span className="text-2xl font-bold">{calculatedFeed.sheep} lbs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Feed Listings</CardTitle>
              <CardDescription>Set prices for your calculated feed and create listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="chicken-price">Chicken Feed ({calculatedFeed.chicken} lbs)</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        $
                      </span>
                      <Input
                        id="chicken-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={listingPrices.chicken}
                        onChange={(e) => setListingPrices({ ...listingPrices, chicken: e.target.value })}
                        className="rounded-l-none"
                        disabled={calculatedFeed.chicken === 0}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pig-price">Pig Feed ({calculatedFeed.pig} lbs)</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        $
                      </span>
                      <Input
                        id="pig-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={listingPrices.pig}
                        onChange={(e) => setListingPrices({ ...listingPrices, pig: e.target.value })}
                        className="rounded-l-none"
                        disabled={calculatedFeed.pig === 0}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cattle-price">Cattle Feed ({calculatedFeed.cattle} lbs)</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        $
                      </span>
                      <Input
                        id="cattle-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={listingPrices.cattle}
                        onChange={(e) => setListingPrices({ ...listingPrices, cattle: e.target.value })}
                        className="rounded-l-none"
                        disabled={calculatedFeed.cattle === 0}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goat-price">Goat Feed ({calculatedFeed.goat} lbs)</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        $
                      </span>
                      <Input
                        id="goat-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={listingPrices.goat}
                        onChange={(e) => setListingPrices({ ...listingPrices, goat: e.target.value })}
                        className="rounded-l-none"
                        disabled={calculatedFeed.goat === 0}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sheep-price">Sheep Feed ({calculatedFeed.sheep} lbs)</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        $
                      </span>
                      <Input
                        id="sheep-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={listingPrices.sheep}
                        onChange={(e) => setListingPrices({ ...listingPrices, sheep: e.target.value })}
                        className="rounded-l-none"
                        disabled={calculatedFeed.sheep === 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard/store?tab=calculate">
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back to Calculator
                </Link>
              </Button>
              <Button onClick={createListings}>
                <Tag className="mr-2 h-4 w-4" /> Create Listings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

