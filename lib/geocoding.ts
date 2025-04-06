import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is not set in environment variables');
}

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY || '',
  version: "weekly",
  libraries: ["places", "geocoding"]
});

export interface GeocodingResult {
  lat: number;
  lng: number;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!address) {
    console.error('No address provided for geocoding');
    return null;
  }

  try {
    const google = await loader.load();
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0] && results[0].geometry && results[0].geometry.location) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.error(`Geocoding failed for address: ${address}`, status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Function to test geocoding
export async function testGeocoding(address: string) {
  console.log(`Testing geocoding for address: ${address}`);
  const result = await geocodeAddress(address);
  console.log('Geocoding result:', result);
  return result;
} 