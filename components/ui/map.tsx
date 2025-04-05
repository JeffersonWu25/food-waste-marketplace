'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface MapProps {
  center: {
    lat: number
    lng: number
  }
  zoom?: number
  markers?: Array<{
    position: {
      lat: number
      lng: number
    }
    title?: string
  }>
}

export function Map({ center, zoom = 12, markers = [] }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      })

      try {
        const google = await loader.load()
        const map = new google.maps.Map(mapRef.current!, {
          center,
          zoom,
        })

        // Add markers if provided
        markers.forEach((marker) => {
          new google.maps.Marker({
            position: marker.position,
            map,
            title: marker.title,
          })
        })
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    initMap()
  }, [center, zoom, markers])

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-lg border"
      style={{ minHeight: '400px' }}
    />
  )
} 