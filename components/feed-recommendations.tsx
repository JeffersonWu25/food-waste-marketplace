"use client"

interface Livestock {
  cattle: number
  pigs: number
  chickens: number
}

interface FeedRecommendationsProps {
  livestock: Livestock
}

export function FeedRecommendations({ livestock }: FeedRecommendationsProps) {
  return (
    <div className="rounded-lg bg-blue-50 p-6 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-2xl font-bold tracking-tight text-blue-600">Gemini Recommendations</h2>
        </div>
        <p className="text-sm text-gray-600">
          Based on your livestock inventory
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-700">Your weekly feed requirements:</h3>
        
        <div className="space-y-6">
          {/* Cattle Feed */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Cattle Feed:</span>
              <span className="font-medium">250 lbs/week</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[32%] bg-black rounded-full"></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">80 lbs in stock</span>
              <span className="text-blue-600">170 lbs needed</span>
            </div>
          </div>

          {/* Pig Feed */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Pig Feed:</span>
              <span className="font-medium">120 lbs/week</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[42%] bg-black rounded-full"></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">50 lbs in stock</span>
              <span className="text-blue-600">70 lbs needed</span>
            </div>
          </div>

          {/* Chicken Feed */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Chicken Feed:</span>
              <span className="font-medium">25 lbs/week</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[40%] bg-black rounded-full"></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">10 lbs in stock</span>
              <span className="text-blue-600">15 lbs needed</span>
            </div>
          </div>
        </div>

        <p className="text-blue-600 text-sm">
          We've highlighted matching feed types in the listings below.
        </p>
      </div>
    </div>
  )
} 