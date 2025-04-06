"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { geminiModel } from "@/lib/gemini"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Livestock {
  id: string
  animal_type: string
  count: number
  weekly_feed_required: number
  farm_id: string
}

interface Feed {
  feed_type: string
  amount: number
  ingredients: string
  price: number
}

interface FeedRecommendationsProps {
  farmId?: string
}

interface LivestockTypeData {
  count: number
  weekly_feed_required: number
}

export function FeedRecommendations({ farmId }: FeedRecommendationsProps) {
  const router = useRouter()
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [availableFeed, setAvailableFeed] = useState<Feed[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedRequirements, setFeedRequirements] = useState<{
    [key: string]: {
      required: number
      available: number
      needed: number
      percentage: number
    }
  }>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) {
          toast.error('Please log in to view recommendations')
          router.push('/login')
          return
        }

        // Get farm ID if not provided
        let currentFarmId = farmId
        if (!currentFarmId) {
          const { data: farmData, error: farmError } = await supabase
            .from('Farms')
            .select('id')
            .eq('id', user.id)
            .single()

          if (farmError) {
            console.error("Farm fetch error:", farmError)
            if (farmError.code === 'PGRST116') {
              toast.error("Access denied. This account is not registered as a farm")
              router.push('/login')
              return
            }
            throw new Error(`Failed to fetch farm data: ${farmError.message}`)
          }

          currentFarmId = farmData.id
        }

        console.log("Fetching data for farm:", currentFarmId)

        // Fetch livestock data
        const { data: livestockData, error: livestockError } = await supabase
          .from('Livestock')
          .select('*')
          .eq('farm_id', currentFarmId)

        if (livestockError) {
          console.error("Livestock fetch error:", livestockError)
          throw new Error(`Failed to fetch livestock: ${livestockError.message}`)
        }

        console.log("Livestock data:", livestockData)
        setLivestock(livestockData || [])

        // Fetch available feed
        const { data: feedData, error: feedError } = await supabase
          .from('Feed')
          .select('*')

        if (feedError) {
          console.error("Feed fetch error:", feedError)
          throw new Error(`Failed to fetch feed: ${feedError.message}`)
        }

        console.log("Feed data:", feedData)
        setAvailableFeed(feedData || [])

        // Calculate feed requirements
        const requirements: typeof feedRequirements = {}
        
        if (livestockData && livestockData.length > 0) {
          // Group livestock by animal type
          const livestockByType: Record<string, LivestockTypeData> = {}
          
          // First, initialize the data structure
          livestockData.forEach(animal => {
            const type = animal.animal_type.toLowerCase()
            if (!livestockByType[type]) {
              livestockByType[type] = {
                count: 0,
                weekly_feed_required: 0
              }
            }
          })
          
          // Then, populate with data
          livestockData.forEach(animal => {
            const type = animal.animal_type.toLowerCase()
            livestockByType[type].count += animal.count
            livestockByType[type].weekly_feed_required += animal.weekly_feed_required
          })

          console.log("Grouped livestock by type:", livestockByType)

          // Calculate requirements for each animal type
          Object.keys(livestockByType).forEach(animalType => {
            const data = livestockByType[animalType]
            if (data.count > 0) {
              const totalRequired = data.weekly_feed_required
              const available = feedData?.filter(f => 
                f.feed_type.toLowerCase() === animalType
              ).reduce((sum, feed) => sum + feed.amount, 0) || 0
              
              const needed = Math.max(0, totalRequired - available)
              const percentage = totalRequired > 0 ? Math.min(100, (available / totalRequired) * 100) : 0

              console.log(`${animalType} requirements:`, {
                count: data.count,
                totalRequired,
                available,
                needed,
                percentage
              })

              requirements[animalType] = {
                required: totalRequired,
                available,
                needed,
                percentage
              }
            }
          })
        }

        console.log("Calculated requirements:", requirements)
        setFeedRequirements(requirements)

      } catch (error) {
        console.error('Detailed error:', error)
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        setError(errorMessage)
        toast.error(`Failed to load feed recommendations: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [farmId, router])

  if (loading) {
    return (
      <div className="rounded-lg bg-blue-50 p-6">
        <p>Loading recommendations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  if (livestock.length === 0) {
    return (
      <div className="rounded-lg bg-blue-50 p-6">
        <p>No livestock data available. Please add livestock to your farm.</p>
      </div>
    )
  }

  // Get livestock summary for display
  const getLivestockSummary = () => {
    return livestock
      .filter(animal => animal.count > 0)
      .map(animal => `${animal.count} ${animal.animal_type}`)
      .join(', ')
  }

  return (
    <div className="rounded-lg bg-blue-50 p-6 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-2xl font-bold tracking-tight text-blue-600">Feed Recommendations</h2>
        </div>
        <p className="text-sm text-gray-600">
          Based on your livestock inventory ({getLivestockSummary()})
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-700">Your weekly feed requirements:</h3>

        <div className="space-y-6">
          {Object.entries(feedRequirements).map(([animalType, data]) => (
            <div key={animalType} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium capitalize">{animalType} Feed:</span>
                <span className="font-medium">{data.required} lbs/week</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${data.percentage >= 100 ? 'bg-green-500' :
                    data.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${data.percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-600">{data.available} lbs in stock</span>
                <span className="text-blue-600">{data.needed} lbs needed</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-blue-600 text-sm">
          We've highlighted matching feed types in the listings below.
        </p>
      </div>
    </div>
  )
} 