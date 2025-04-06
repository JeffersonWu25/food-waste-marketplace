"use client"

import { useEffect, useRef, useState } from "react"
import { loader, Location } from "@/lib/google-maps-config"

interface GoogleMapProps {
  locations: Location[];
  center?: Location;
  zoom?: number;
  height?: string;
  className?: string;
  onMarkerClick?: (location: Location) => void;
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
      if (!locations.length) return;

      try {
        const google = await loader.load()
        
        // Use first location as center if none provided
        const mapCenter = center || locations[0]
        
        const map = new google.maps.Map(mapRef.current!, {
          center: mapCenter,
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
          // Create custom marker icon for farm location
          const isFarm = location.title === "Your Farm";
          const markerIcon = isFarm ? {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#03396c', // Tailwind blue-600
            fillOpacity: 1,
            strokeColor: '#aaaaaa', // Tailwind blue-800
            strokeWeight: 2,
            scale: 13,
          } : undefined;

          const marker = new google.maps.Marker({
            position: location,
            map,
            title: location.title || location.address,
            icon: markerIcon,
            label: isFarm ? {
              text: "Farm",
              color: "#b3cde0",
              fontSize: "10px",
              fontWeight: "bold"
            } : undefined
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

    if (mapRef.current && locations.length > 0) {
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

