"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash, Save } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function LivestockInventory() {
  const [livestock, setLivestock] = useState([
    { id: 1, type: "Chicken", count: 50, feedNeeded: "25 lbs/week" },
    { id: 2, type: "Pig", count: 12, feedNeeded: "120 lbs/week" },
    { id: 3, type: "Cattle", count: 5, feedNeeded: "250 lbs/week" },
  ])

  const [newAnimalType, setNewAnimalType] = useState("")
  const [newAnimalCount, setNewAnimalCount] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddAnimal = () => {
    if (newAnimalType && newAnimalCount) {
      const count = Number.parseInt(newAnimalCount)
      let feedNeeded = "0 lbs/week"

      // Simple calculation for feed needed based on animal type
      switch (newAnimalType.toLowerCase()) {
        case "chicken":
          feedNeeded = `${count * 0.5} lbs/week`
          break
        case "pig":
          feedNeeded = `${count * 10} lbs/week`
          break
        case "cattle":
          feedNeeded = `${count * 50} lbs/week`
          break
        case "goat":
          feedNeeded = `${count * 5} lbs/week`
          break
        case "sheep":
          feedNeeded = `${count * 7} lbs/week`
          break
        default:
          feedNeeded = `${count * 2} lbs/week`
      }

      setLivestock([
        ...livestock,
        {
          id: Date.now(),
          type: newAnimalType,
          count,
          feedNeeded,
        },
      ])

      setNewAnimalType("")
      setNewAnimalCount("")
      setIsAdding(false)
    }
  }

  const handleRemoveAnimal = (id: number) => {
    setLivestock(livestock.filter((animal) => animal.id !== id))
  }

  const totalFeedNeeded = livestock.reduce((total, animal) => {
    const feedAmount = Number.parseFloat(animal.feedNeeded.split(" ")[0])
    return total + feedAmount
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
                <Input
                  id="animal-type"
                  placeholder="e.g., Chicken, Pig, Cattle"
                  value={newAnimalType}
                  onChange={(e) => setNewAnimalType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="animal-count">Count</Label>
                <Input
                  id="animal-count"
                  type="number"
                  min="1"
                  placeholder="Number of animals"
                  value={newAnimalCount}
                  onChange={(e) => setNewAnimalCount(e.target.value)}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal Type</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Feed Required</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {livestock.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.type}</TableCell>
                  <TableCell>{animal.count}</TableCell>
                  <TableCell>{animal.feedNeeded}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveAnimal(animal.id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

