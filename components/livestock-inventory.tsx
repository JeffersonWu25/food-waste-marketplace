"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash, Save, Edit2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Define the type for our livestock data
interface Livestock {
  id: string
  animal_type: string
  count: number
  weekly_feed_required: number
  farm_id: string
}

export function LivestockInventory() {
  const router = useRouter()
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [farmId, setFarmId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [newAnimal, setNewAnimal] = useState({
    animal_type: "Cow",
    count: 1,
    weekly_feed_required: 0
  })

  const [editForm, setEditForm] = useState({
    animal_type: "",
    count: 0,
    weekly_feed_required: 0
  })

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>, isNewAnimal: boolean) => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value)
    
    if (isNewAnimal) {
      setNewAnimal(prev => ({
        ...prev,
        count: value === '' ? 0 : value
      }))
    } else {
      setEditForm(prev => ({
        ...prev,
        count: value === '' ? 0 : value
      }))
    }
  }

  // Get current farm's ID
  const getCurrentFarmId = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      
      if (!user) {
        toast.error("Please log in to view your livestock")
        router.push('/login')
        return null
      }

      // Check if user exists in Farms table
      const { data: farmData, error: farmError } = await supabase
        .from('Farms')
        .select('id')
        .eq('id', user.id)
        .single()

      if (farmError) {
        if (farmError.code === 'PGRST116') { // No rows returned
          toast.error("Access denied. This account is not registered as a farm")
          router.push('/login')
          return null
        }
        throw farmError
      }

      return farmData.id
    } catch (error) {
      console.error('Error getting farm ID:', error)
      toast.error('Failed to authenticate farm')
      return null
    }
  }

  // Calculate weekly feed based on animal type and count
  const calculateWeeklyFeed = (type: string, count: number): number => {
    switch (type.toLowerCase()) {
      case 'cow':
        return count * 150 // 150 lbs per cow per week
      case 'pig':
        return count * 50  // 50 lbs per pig per week
      case 'chicken':
        return count * 2   // 2 lbs per chicken per week
      default:
        return 0
    }
  }

  // Fetch livestock from Supabase
  const fetchLivestock = async () => {
    try {
      if (!farmId) return

      setLoading(true)
      const { data, error } = await supabase
        .from('Livestock')
        .select('*')
        .eq('farm_id', farmId)
        .order('animal_type', { ascending: true })

      if (error) throw error

      setLivestock(data || [])
    } catch (error: any) {
      console.error('Error fetching livestock:', error)
      toast.error('Failed to load livestock')
    } finally {
      setLoading(false)
    }
  }

  // Add a new animal
  const handleAddAnimal = async () => {
    if (!farmId) {
      toast.error("Please log in to add livestock")
      return
    }

    try {
      const weekly_feed_required = calculateWeeklyFeed(newAnimal.animal_type, newAnimal.count)
      
      const animalToSave = {
        ...newAnimal,
        farm_id: farmId,
        weekly_feed_required
      }
      
      const { data, error } = await supabase
        .from('Livestock')
        .insert([animalToSave])
        .select()

      if (error) throw error

      setLivestock([...livestock, ...data])
      setNewAnimal({
        animal_type: "Cow",
        count: 1,
        weekly_feed_required: 0
      })
      setIsAdding(false)
      toast.success('Livestock added successfully')
    } catch (error: any) {
      console.error('Error adding livestock:', error)
      toast.error('Failed to add livestock')
    }
  }

  // Start editing an animal
  const handleStartEdit = (animal: Livestock) => {
    if (animal.farm_id !== farmId) {
      toast.error("You can only edit your own livestock")
      return
    }
    
    setEditingId(animal.id)
    setEditForm({
      animal_type: animal.animal_type,
      count: animal.count,
      weekly_feed_required: animal.weekly_feed_required
    })
  }

  // Save edited animal
  const handleSaveEdit = async (id: string) => {
    if (!farmId) return

    try {
      const weekly_feed_required = calculateWeeklyFeed(editForm.animal_type, editForm.count)
      
      const updatedData = {
        ...editForm,
        weekly_feed_required
      }
      
      const { error } = await supabase
        .from('Livestock')
        .update(updatedData)
        .eq('id', id)
        .eq('farm_id', farmId)

      if (error) throw error

      // Update local state
      setLivestock(livestock.map(animal => 
        animal.id === id ? { ...animal, ...updatedData } : animal
      ))
      
      setEditingId(null)
      toast.success('Livestock updated successfully')
    } catch (error: any) {
      console.error('Error updating livestock:', error)
      toast.error('Failed to update livestock')
    }
  }

  // Remove an animal
  const handleRemoveAnimal = async (id: string) => {
    if (!farmId) return

    try {
      const { error } = await supabase
        .from('Livestock')
        .delete()
        .eq('id', id)
        .eq('farm_id', farmId)

      if (error) throw error

      setLivestock(livestock.filter(animal => animal.id !== id))
      toast.success('Livestock removed successfully')
    } catch (error: any) {
      console.error('Error removing livestock:', error)
      toast.error('Failed to remove livestock')
    }
  }

  // Initialize farm ID and load livestock
  useEffect(() => {
    const init = async () => {
      const id = await getCurrentFarmId()
      if (id) {
        setFarmId(id)
      }
    }
    init()
  }, [])

  // Load livestock when farmId changes
  useEffect(() => {
    if (farmId) {
      fetchLivestock()
    }
  }, [farmId])

  const totalFeedNeeded = livestock.reduce((total, animal) => {
    return total + animal.weekly_feed_required
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Livestock Inventory</h2>
          <p className="text-muted-foreground">Manage your animals and track feed requirements</p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="mr-2 h-4 w-4" /> Add Animal
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Animal</CardTitle>
            <CardDescription>Enter the details of the animals you want to add to your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="animal-type">Animal Type</Label>
                <Select 
                  value={newAnimal.animal_type} 
                  onValueChange={(value) => setNewAnimal({ ...newAnimal, animal_type: value })}
                >
                  <SelectTrigger id="animal-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cow">Cow</SelectItem>
                    <SelectItem value="Pig">Pig</SelectItem>
                    <SelectItem value="Chicken">Chicken</SelectItem>
                    <SelectItem value="Goat">Goat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="animal-count">Count</Label>
                <Input
                  id="animal-count"
                  type="number"
                  min="1"
                  value={newAnimal.count || ''}
                  onChange={(e) => handleCountChange(e, true)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAnimal}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Livestock</CardTitle>
          <CardDescription>Your current animals and their feed requirements</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal Type</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Weekly Feed Required (lbs)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {livestock.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell className="font-medium">
                      {editingId === animal.id ? (
                        <Select 
                          value={editForm.animal_type} 
                          onValueChange={(value) => setEditForm({ ...editForm, animal_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cow">Cow</SelectItem>
                            <SelectItem value="Pig">Pig</SelectItem>
                            <SelectItem value="Chicken">Chicken</SelectItem>
                            <SelectItem value="Goat">Goat</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        animal.animal_type
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === animal.id ? (
                        <Input
                          type="number"
                          min="1"
                          value={editForm.count || ''}
                          onChange={(e) => handleCountChange(e, false)}
                        />
                      ) : (
                        animal.count
                      )}
                    </TableCell>
                    <TableCell>{animal.weekly_feed_required}</TableCell>
                    <TableCell className="text-right">
                      {editingId === animal.id ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleSaveEdit(animal.id)}
                        >
                          <Save className="h-4 w-4" />
                          <span className="sr-only">Save</span>
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleStartEdit(animal)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveAnimal(animal.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <span className="text-muted-foreground">Total Feed Required:</span>
            <span className="font-bold">{totalFeedNeeded.toFixed(1)} lbs/week</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

