import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is not set in environment variables');
}

// Create a single loader instance that can be reused
export const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY || '',
  version: "weekly",
  libraries: ["places", "geocoding"]
});

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  title?: string;
} 