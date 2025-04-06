"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, Tag, ArrowRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import Link from "next/link"

// Feed conversion rates (simplified for demonstration)
const FEED_CONVERSION = {
  produce: {
    chicken: 0.8,
    pig: 0.6,
    cattle: 0.4,
    goat: 0.7,
    sheep: 0.6,
  },
  bakery: {
    chicken: 0.5,
    pig: 0.9,
    cattle: 0.3,
    goat: 0.4,
    sheep: 0.4,
  },
  dairy: {
    chicken: 0.3,
    pig: 0.8,
    cattle: 0.5,
    goat: 0.6,
    sheep: 0.5,
  },
  protein: {
    chicken: 0.7,
    pig: 0.9,
    cattle: 0.6,
    goat: 0.5,
    sheep: 0.5,
  },
  other: {
    chicken: 0.9,
    pig: 0.7,
    cattle: 0.5,
    goat: 0.6,
    sheep: 0.6,
  },
}

interface Ingredient {
  id: number
  name: string
  store_id: string
  expiration_date: string
  status: string
  amount: number
  type: string
}

export function FeedCalculator() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [calculatedFeed, setCalculatedFeed] = useState({
    chicken: 0,
    pig: 0,
    cattle: 0,
    goat: 0,
  })
  const [listingPrices, setListingPrices] = useState({
    chicken: "",
    pig: "",
    cattle: "",
    goat: "",
  })

  // Fetch ingredients from Supabase
  const fetchIngredients = async () => {
    try {
      setLoading(true)
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please log in to access this feature')
        return
      }

      const { data, error } = await supabase
        .from('Ingredients')
        .select('*')
        .eq('store_id', user.id)
        .order('expiration_date', { ascending: true })

      if (error) throw error

      setIngredients(data || [])
    } catch (error: any) {
      console.error('Error fetching ingredients:', error)
      toast.error('Failed to load ingredients')
    } finally {
      setLoading(false)
    }
  }

  // Load ingredients when the component mounts
  useEffect(() => {
    fetchIngredients()
  }, [])

  // Add the Gemini API function
  const getFeedCalculationFromGemini = async (ingredients: Ingredient[]) => {
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const prompt = `You are a feed calculation system. Given these ingredients, calculate the pounds of animal feed that can be produced.
      Format your response EXACTLY like this example:
      {
        "chicken": 10,
        "pig": 15,
        "cattle": 20,
        "goat": 12
      }

      Ingredients:
      ${ingredients.map(i => `- ${i.amount} units of ${i.name} (${i.type}), expires: ${i.expiration_date}, status: ${i.status}`).join('\n')}`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      console.log('Raw Gemini response:', data); // Debug log

      // Get the text response
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('Extracted text:', text); // Debug log

      // Return the raw text
      return text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast.error('Failed to calculate feed amounts');
      return null;
    }
  };

  // Update the calculateFeed function to handle the text response
  const calculateFeed = async () => {
    const selectedIngredients = ingredients.filter((item) => selectedItems.includes(item.id));

    if (selectedIngredients.length === 0) {
      toast.error('Please select at least one ingredient');
      return;
    }

    const response = await getFeedCalculationFromGemini(selectedIngredients);

    if (response) {
      try {
        // Try to find and extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const feedAmounts = JSON.parse(jsonMatch[0]);
          setCalculatedFeed(feedAmounts);
        } else {
          toast.error('Could not parse calculation results');
        }
      } catch (error) {
        console.error('Error parsing feed calculation:', error);
        toast.error('Failed to parse calculation results');
      }
    }
  };

  const toggleItemSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const createListings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please log in to create listings')
        return
      }

      // Create an array of feed listings to insert
      const listings = Object.entries(calculatedFeed)
        .filter(([_, amount]) => amount > 0) // Only create listings for non-zero amounts
        .map(([feedType, amount]) => ({
          store_id: user.id,
          feed_type: feedType,
          amount: amount,
          ingredients: selectedItems, // This will store the IDs of ingredients used
          price: parseFloat(listingPrices[feedType as keyof typeof listingPrices] || '0')
        }))

      // Insert the listings into the feeds table
      const { data, error } = await supabase
        .from('feeds')
        .insert(listings)

      if (error) throw error

      toast.success('Listings created successfully!')
      // Clear the form
      setSelectedItems([])
      setCalculatedFeed({
        chicken: 0,
        pig: 0,
        cattle: 0,
        goat: 0,
      })
      setListingPrices({
        chicken: "",
        pig: "",
        cattle: "",
        goat: "",
      })

    } catch (error: any) {
      console.error('Error creating listings:', error)
      toast.error('Failed to create listings')
    }
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
              {loading ? (
                <div>Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Expiration Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingredients.map((item) => (
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
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>{new Date(item.expiration_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Expired' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {item.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
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
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={calculateFeed}>
                <Calculator className="mr-2 h-4 w-4" /> Recalculate
              </Button>
              <Button onClick={createListings} variant="outline">
                <Tag className="mr-2 h-4 w-4" /> List Feed Now
              </Button>
            </CardFooter>
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
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-300 bg-gray-50 text-gray-500">
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
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={createListings} className="ml-auto">
                <Tag className="mr-2 h-4 w-4" /> Create Listings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

