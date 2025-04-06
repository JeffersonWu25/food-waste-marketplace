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
import { Plus, Trash, Edit2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

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

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function GroceryInventory() {
  const router = useRouter()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    expiration_date: "",
    status: "Expiring",
    amount: 1,
    type: "Produce (Fruit)"
  })
  const [editForm, setEditForm] = useState({
    name: "",
    expiration_date: "",
    status: "",
    amount: 0,
    type: ""
  })

  // Get current store's ID
  const getCurrentStoreId = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      
      if (!user) {
        toast.error("Please log in to view your inventory")
        router.push('/login')
        return null
      }

      // Check if user exists in Stores table
      const { data: storeData, error: storeError } = await supabase
        .from('Stores')
        .select('id')
        .eq('id', user.id)
        .single()

      if (storeError) {
        if (storeError.code === 'PGRST116') { // No rows returned
          toast.error("Access denied. This account is not registered as a store")
          router.push('/login')
          return null
        }
        throw storeError
      }

      return storeData.id
    } catch (error) {
      console.error('Error getting store ID:', error)
      toast.error('Failed to authenticate store')
      return null
    }
  }

  // Fetch ingredients from Supabase
  const fetchIngredients = async () => {
    try {
      if (!storeId) return

      setLoading(true)
      const { data, error } = await supabase
        .from('Ingredients')
        .select('*')
        .eq('store_id', storeId)
        .order('expiration_date', { ascending: true })

      if (error) throw error

      // Ensure all types are capitalized
      const formattedData = data?.map(item => ({
        ...item,
        type: capitalizeFirstLetter(item.type)
      })) || []

      setIngredients(formattedData)
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
    if (!storeId) {
      toast.error("Please log in to add ingredients")
      return
    }

    try {
      // Ensure type is capitalized before saving
      const ingredientToSave = {
        ...newIngredient,
        store_id: storeId,
        type: capitalizeFirstLetter(newIngredient.type)
      }
      
      const { data, error } = await supabase
        .from('Ingredients')
        .insert([ingredientToSave])
        .select()

      if (error) throw error

      setIngredients([...ingredients, ...data])
      setNewIngredient({
        name: "",
        expiration_date: "",
        status: "Expiring",
        amount: 1,
        type: "Produce (Fruit)"
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
    if (!storeId) return

    try {
      const { error } = await supabase
        .from('Ingredients')
        .delete()
        .eq('id', id)
        .eq('store_id', storeId) // Ensure we can only delete our own ingredients

      if (error) throw error

      setIngredients(ingredients.filter(ingredient => ingredient.id !== id))
      toast.success('Ingredient deleted successfully')
    } catch (error: any) {
      console.error('Error deleting ingredient:', error)
      toast.error('Failed to delete ingredient')
    }
  }

  // Start editing an ingredient
  const handleStartEdit = (ingredient: Ingredient) => {
    if (ingredient.store_id !== storeId) {
      toast.error("You can only edit your own ingredients")
      return
    }
    
    setEditingId(ingredient.id)
    setEditForm({
      name: ingredient.name,
      expiration_date: ingredient.expiration_date,
      status: ingredient.status,
      amount: ingredient.amount,
      type: ingredient.type
    })
  }

  // Save edited ingredient
  const handleSaveEdit = async (id: number) => {
    if (!storeId) return

    try {
      // Ensure type is capitalized before saving
      const updatedData = {
        ...editForm,
        type: capitalizeFirstLetter(editForm.type)
      }
      
      const { error } = await supabase
        .from('Ingredients')
        .update(updatedData)
        .eq('id', id)
        .eq('store_id', storeId) // Ensure we can only update our own ingredients

      if (error) throw error

      // Update local state
      setIngredients(ingredients.map(item => 
        item.id === id ? { ...item, ...updatedData } : item
      ))
      
      setEditingId(null)
      toast.success('Ingredient updated successfully')
    } catch (error: any) {
      console.error('Error updating ingredient:', error)
      toast.error('Failed to update ingredient')
    }
  }

  // Handle type change in the add form
  const handleTypeChange = (value: string) => {
    setNewIngredient({ ...newIngredient, type: value })
  }

  // Handle type change in the edit form
  const handleEditTypeChange = (value: string) => {
    setEditForm({ ...editForm, type: value })
  }

  // Initialize store ID and load ingredients
  useEffect(() => {
    const init = async () => {
      const id = await getCurrentStoreId()
      if (id) {
        setStoreId(id)
      }
    }
    init()
  }, [])

  // Load ingredients when storeId changes
  useEffect(() => {
    if (storeId) {
      fetchIngredients()
    }
  }, [storeId])

  return (
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
                    placeholder="E.G. Carrots, Eggs"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={newIngredient.type} 
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Produce (Fruit)">Produce (Fruit)</SelectItem>
                      <SelectItem value="Produce (Vegetable)">Produce (Vegetable)</SelectItem>
                      <SelectItem value="Protein">Protein</SelectItem>
                      <SelectItem value="Bakery">Bakery</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (lbs)</Label>
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
                  <TableHead>Amount (lbs)</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {editingId === item.id ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      ) : (
                        item.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Select 
                          value={editForm.type} 
                          onValueChange={handleEditTypeChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Produce (Fruit)">Produce (Fruit)</SelectItem>
                            <SelectItem value="Produce (Vegetable)">Produce (Vegetable)</SelectItem>
                            <SelectItem value="Protein">Protein</SelectItem>
                            <SelectItem value="Bakery">Bakery</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        item.type
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          min="1"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: parseInt(e.target.value) })}
                        />
                      ) : (
                        item.amount
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          type="date"
                          value={editForm.expiration_date}
                          onChange={(e) => setEditForm({ ...editForm, expiration_date: e.target.value })}
                        />
                      ) : (
                        new Date(item.expiration_date).toLocaleDateString()
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Select 
                          value={editForm.status} 
                          onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Expiring">Expiring</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'Expired' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === item.id ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSaveEdit(item.id)}
                        >
                          <Save className="h-4 w-4" />
                          <span className="sr-only">Save</span>
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleStartEdit(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      )}
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
  )
}
