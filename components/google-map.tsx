"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

export interface Location {
  lat: number
  lng: number
  address?: string
  title?: string
}

interface GoogleMapProps {
  locations: Location[]
  center?: Location
  zoom?: number
  height?: string
  className?: string
  onMarkerClick?: (location: Location) => void
}

export function GoogleMap({
  locations,
  center,
  zoom = 12,
  height = "400px",
  className = "",
  onMarkerClick,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          version: "weekly",
        })

        const google = await loader.load()
        const map = new google.maps.Map(mapRef.current!, {
          center: center || locations[0],
          zoom,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        setMap(map)

        // Create markers for each location
        const newMarkers = locations.map((location) => {
          const marker = new google.maps.Marker({
            position: location,
            map,
            title: location.title || location.address,
          })

          if (onMarkerClick) {
            marker.addListener("click", () => onMarkerClick(location))
          }

          return marker
        })

        setMarkers(newMarkers)
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        setError("Failed to load map. Please try again later.")
        setIsLoading(false)
      }
    }

    if (mapRef.current && locations && locations.length > 0) {
      initMap()
    }

    return () => {
      // Clean up markers when component unmounts
      markers.forEach((marker) => marker.setMap(null))
    }
  }, [locations, center, zoom, onMarkerClick])

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="text-center p-4 bg-background rounded-lg shadow-lg">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}

