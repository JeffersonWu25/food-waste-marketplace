import { supabase } from '../lib/supabase';
import { geocodeAddress } from '../lib/geocoding';

async function updateFarmCoordinates() {
  try {
    // Get all farms
    const { data: farms, error: farmError } = await supabase
      .from('Farms')
      .select('*');

    if (farmError) throw farmError;

    // Update each farm's coordinates
    for (const farm of farms || []) {
      if (farm.address) {
        const coords = await geocodeAddress(farm.address);
        if (coords) {
          const { error } = await supabase
            .from('Farms')
            .update({ lat: coords.lat, lng: coords.lng })
            .eq('id', farm.id);

          if (error) throw error;
          console.log(`Updated coordinates for farm: ${farm.address}`);
        }
      }
    }
  } catch (error) {
    console.error('Error updating farm coordinates:', error);
  }
}

async function updateStoreCoordinates() {
  try {
    // Get all stores
    const { data: stores, error: storeError } = await supabase
      .from('Stores')
      .select('*');

    if (storeError) throw storeError;

    // Update each store's coordinates
    for (const store of stores || []) {
      if (store.address) {
        const coords = await geocodeAddress(store.address);
        if (coords) {
          const { error } = await supabase
            .from('Stores')
            .update({ lat: coords.lat, lng: coords.lng })
            .eq('id', store.id);

          if (error) throw error;
          console.log(`Updated coordinates for store: ${store.address}`);
        }
      }
    }
  } catch (error) {
    console.error('Error updating store coordinates:', error);
  }
}

// Run the updates
async function main() {
  console.log('Starting coordinate updates...');
  await updateFarmCoordinates();
  await updateStoreCoordinates();
  console.log('Finished updating coordinates.');
}

main(); 