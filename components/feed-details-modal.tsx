"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface Feed {
  id: string
  store_id: string
  feed_type: string
  amount: number
  price: number
  ingredients?: string
}

interface FeedDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  feed: Feed
  storeName: string
  storeAddress: string
  onPurchaseComplete?: () => void
}

export function FeedDetailsModal({
  isOpen,
  onClose,
  feed,
  storeName,
  storeAddress,
  onPurchaseComplete
}: FeedDetailsModalProps) {
  const [purchasing, setPurchasing] = useState(false)

  const handlePurchase = async () => {
    try {
      setPurchasing(true)
      console.log('Starting purchase process...')
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) {
        console.log('No user found')
        toast.error('Please log in to make a purchase')
        return
      }
      console.log('User found:', user.id)

      // Get farm ID for the current user
      const { data: farmData, error: farmError } = await supabase
        .from('Farms')
        .select('id')
        .eq('id', user.id)
        .single()

      if (farmError) {
        console.error('Farm error:', farmError.message, farmError)
        if (farmError.code === 'PGRST116') {
          toast.error('Your account is not registered as a farm')
        } else {
          toast.error('Could not verify farm account: ' + farmError.message)
        }
        return
      }

      if (!farmData) {
        console.log('No farm data found for user:', user.id)
        toast.error('Could not find your farm account')
        return
      }
      console.log('Farm found:', farmData.id)

      // Create purchase record
      const purchaseData = {
        farm_id: farmData.id,
        store_id: feed.store_id,
        feed_id: feed.id,
        amount: feed.amount,
        total_price: feed.price,
        status: 'pending',
        purchase_date: new Date().toISOString()
      }
      console.log('Attempting to create purchase with data:', purchaseData)

      const { data: purchaseResult, error: purchaseError } = await supabase
        .from('Purchases')
        .insert(purchaseData)
        .select()

      if (purchaseError) {
        console.error('Purchase error details:', {
          code: purchaseError.code,
          message: purchaseError.message,
          details: purchaseError.details,
          hint: purchaseError.hint
        })
        throw new Error(`Purchase failed: ${purchaseError.message}${purchaseError.details ? ` - ${purchaseError.details}` : ''}`)
      }

      console.log('Purchase successful:', purchaseResult)
      toast.success('Purchase successful! Check your orders for details.')
      onPurchaseComplete?.();
      onClose()
    } catch (error: any) {
      console.error('Error making purchase:', error)
      const errorMessage = error?.message || 
                          (error?.details ? JSON.stringify(error.details) : null) ||
                          (typeof error === 'object' ? JSON.stringify(error) : null) ||
                          'Failed to complete purchase'
      toast.error(errorMessage)
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Feed Details</DialogTitle>
          <DialogDescription>
            {storeName} - {storeAddress}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span className="font-medium capitalize">{feed.feed_type} Feed</span>
            </div>
            <Badge variant="secondary">
              ${typeof feed.price === 'number' ? feed.price.toFixed(2) : 'Contact store'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>{feed.amount} lbs available</span>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Ingredients:</h4>
            <p className="text-sm text-muted-foreground">
              {feed.ingredients || 'No ingredients information available'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={purchasing}>
            {purchasing ? "Processing..." : "Complete Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 