"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash } from "lucide-react"

// Define the type for our ingredient data
interface Ingredient {
  id: number
  name: string
  store_id: string
  expiration_date: string
  status: string
  amount: number
  type: string
}

export default function GroceryInventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    expiration_date: "",
    status: "Expiring",
    amount: 1,
    type: "produce"
  })

  // Fetch ingredients from Supabase
  const fetchIngredients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('Ingredients')
        .select('*')
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

  // Add a new ingredient
  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('Ingredients')
        .insert([newIngredient])
        .select()

      if (error) throw error

      setIngredients([...ingredients, ...data])
      setNewIngredient({
        name: "",
        expiration_date: "",
        status: "Expiring",
        amount: 1,
        type: "produce"
      })
      setIsAdding(false)
      toast.success('Ingredient added successfully')
    } catch (error: any) {
      console.error('Error adding ingredient:', error)
      toast.error('Failed to add ingredient')
    }
  }

  // Delete an ingredient
  const handleDeleteIngredient = async (id: number) => {
    try {
      const { error } = await supabase
        .from('Ingredients')
        .delete()
        .eq('id', id)

      if (error) throw error

      setIngredients(ingredients.filter(ingredient => ingredient.id !== id))
      toast.success('Ingredient deleted successfully')
    } catch (error: any) {
      console.error('Error deleting ingredient:', error)
      toast.error('Failed to delete ingredient')
    }
  }

  // Load ingredients when the component mounts
  useEffect(() => {
    fetchIngredients()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Grocery Inventory</h2>
            <p className="text-muted-foreground">Manage your expiring food items</p>
          </div>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>

        {isAdding && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
              <CardDescription>Enter the details of the food item you want to add to your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddIngredient} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Carrot, Bread, Milk"
                      value={newIngredient.name}
                      onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={newIngredient.type} 
                      onValueChange={(value) => setNewIngredient({ ...newIngredient, type: value })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="produce">Produce</SelectItem>
                        <SelectItem value="protein">Protein</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      value={newIngredient.amount}
                      onChange={(e) => setNewIngredient({ ...newIngredient, amount: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiration_date">Expiration Date</Label>
                    <Input
                      id="expiration_date"
                      type="date"
                      value={newIngredient.expiration_date}
                      onChange={(e) => setNewIngredient({ ...newIngredient, expiration_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newIngredient.status} 
                      onValueChange={(value) => setNewIngredient({ ...newIngredient, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Expiring">Expiring</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Current Inventory</CardTitle>
            <CardDescription>Your current food items and their expiry status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Expiration Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{new Date(item.expiration_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'Expired' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteIngredient(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 