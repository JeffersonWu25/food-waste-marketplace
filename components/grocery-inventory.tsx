"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash, Save, Tag } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatePicker } from "@/components/date-picker"

export function GroceryInventory() {
  const [inventory, setInventory] = useState([
    { id: 1, name: "Lettuce", category: "Produce", quantity: "20 lbs", expiry: "Today", status: "Expiring" },
    { id: 2, name: "Bread", category: "Bakery", quantity: "15 loaves", expiry: "Tomorrow", status: "Expiring" },
    { id: 3, name: "Milk", category: "Dairy", quantity: "10 gallons", expiry: "2 days", status: "Expiring" },
    { id: 4, name: "Apples", category: "Produce", quantity: "30 lbs", expiry: "3 days", status: "Good" },
    { id: 5, name: "Chicken", category: "Meat", quantity: "25 lbs", expiry: "Today", status: "Expiring" },
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "lbs",
    expiry: undefined as Date | undefined,
  })

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.quantity) {
      setInventory([
        ...inventory,
        {
          id: Date.now(),
          name: newItem.name,
          category: newItem.category,
          quantity: `${newItem.quantity} ${newItem.unit}`,
          expiry: newItem.expiry ? new Date(newItem.expiry).toLocaleDateString() : "Unknown",
          status:
            newItem.expiry && new Date(newItem.expiry) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
              ? "Expiring"
              : "Good",
        },
      ])

      setNewItem({
        name: "",
        category: "",
        quantity: "",
        unit: "lbs",
        expiry: undefined,
      })
      setIsAdding(false)
    }
  }

  const handleRemoveItem = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id))
  }

  const createListing = (item: any) => {
    // This would typically navigate to the listing creation page with pre-filled data
    console.log(`Creating listing for ${item.name}`)
    alert(`Creating listing for ${item.name}. This would navigate to the listing form.`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Grocery Inventory</h2>
          <p className="text-muted-foreground">Manage your expiring food items and create listings</p>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  placeholder="e.g., Lettuce, Bread, Milk"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger id="item-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produce">Produce</SelectItem>
                    <SelectItem value="Bakery">Bakery</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Meat">Meat</SelectItem>
                    <SelectItem value="Dry Goods">Dry Goods</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="item-quantity">Quantity</Label>
                  <Input
                    id="item-quantity"
                    type="number"
                    min="1"
                    placeholder="Amount"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-unit">Unit</Label>
                  <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                    <SelectTrigger id="item-unit">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">lbs</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="units">units</SelectItem>
                      <SelectItem value="loaves">loaves</SelectItem>
                      <SelectItem value="gallons">gallons</SelectItem>
                      <SelectItem value="boxes">boxes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-expiry">Expiry Date</Label>
                <DatePicker date={newItem.expiry} setDate={(date) => setNewItem({ ...newItem, expiry: date })} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
          <CardDescription>Your current food items and their expiry status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.expiry}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.status === "Expiring" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => createListing(item)}>
                      <Tag className="h-4 w-4" />
                      <span className="sr-only">Create Listing</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

