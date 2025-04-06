import { supabase } from '../lib/supabase';
import { testGeocoding } from '../lib/geocoding';

async function testAndUpdateCoordinates() {
  // Test addresses
  const addresses = [
    "2400 Sheridan Rd, Evanston, IL 60208",  // Farm
    "123 Main St, Evanston, IL 60202",       // Store 1
    "2425 S Euclid Ave, Ontario, CA 91762",  // Store 2
    "14168 Central Ave, Chino, CA 91710"     // Store 3
  ];

  console.log('Testing geocoding for addresses...');
  
  for (const address of addresses) {
    const coords = await testGeocoding(address);
    console.log(`Address: ${address}`);
    console.log('Coordinates:', coords);
    console.log('---');
  }
}

// Run the test
console.log('Starting geocoding test...');
testAndUpdateCoordinates()
  .then(() => console.log('Finished testing geocoding'))
  .catch(console.error); 