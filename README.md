# Farm Connect!

A marketplace app that connects stores and restaurants selling food scraps to livestock farmers creating a win-win-win scenario that benefits farmers, stores/restaurants, and the planet!


Built by:

Jefferson Wu, Lina Mei, Ben Wong-Fodor


## Inspiration
- Over 5 million tonnes of food gets wasted yearly.
- In the United States, food waste constitutes about 24% of municipal solid waste in landfills.
- Many grocery stores dispose of perfectly edible food due to expiration dates or cosmetic imperfections, while livestock farmers need affordable, nutritious feed.
- This app helps solve two pressing issues: reducing food waste and providing affordable feed for livestock farmers.

## What it does
- Allows stores to list excess or "wasted" food items that are still safe and nutritious.
- Matches those items with livestock farmers based on their feed needs (e.g., which animals need what types of food).
- Uses Gemini (AI-powered tool) to automatically match stores’ available food scraps to livestock needs (e.g., what food is appropriate for cows, chickens, pigs, etc.).
- Provides a streamlined process for farmers to purchase surplus food that meets their specific livestock requirements.

## How we built it
We created Farm Connect using a full-stack web development approach:

- Frontend: Built with React for a dynamic, user-friendly interface that allows stores and farmers to easily post and browse available food scraps.
- Backend: Node.js and React were used to handle API calls, manage user data, and process transactions.
- Gemini Integration: We integrated Gemini to analyze the type of food being listed and match it with the specific nutritional needs of different livestock. This decision-making process uses machine learning models to optimize the matching of food waste to animal needs.
- We used typescript, HTLM, CSS
- Database: Utilized Supabase to store information about available food scraps, stores, and livestock farmers.
- We also used Cursor for backend and vercel v0 for debugging and frontend respectively.

## Challenges we ran into
- Data quality and consistency: Ensuring the nutritional value and safety of food scraps listed by stores was a challenge. We needed to create strict validation protocols for listings and ensure all food items were safe for livestock consumption.
- Matching algorithms: Fine-tuning the Gemini-based matching system to accurately recommend the right food scraps to the right type of livestock was difficult. We needed to consider various factors like nutritional content, type of livestock, and the quantities of food scraps available.
- Making calls to the google maps api and geocoordinate api were also challenging and took lots of time to debug

## Accomplishments that we're proud of
- Successfully built a working platform that connects stores and farmers and uses Gemini to automate the matching process.
- Created a seamless user experience where grocery stores can list excess food, and farmers can browse, purchase, and pick up food scraps that match their livestock needs.
- Managed to reduce food waste by creating a direct channel to repurpose items for animal feed.
Integrated Gemini's AI into the platform, making smart decisions on food matching and providing valuable insights for both stores and farmers.
- Built a scalable database that can support many users, stores, and transactions, with room for expansion as we grow.

## What we learned
- Market needs: We learned that there is a clear gap in the market for a solution that can directly connect food waste with livestock feed in an efficient and cost-effective way.
- Tech stack adaptability: We learned how to effectively integrate an AI model like Gemini into a real-world application, where it can make dynamic, data-driven decisions that benefit both farmers and stores.
- User engagement: Engaging both stores and farmers in the process required us to tailor the user interface and experience, ensuring both groups could easily adopt the platform and trust the matching system.
- Legal and safety considerations: We gained a better understanding of the legal complexities involved in handling and repurposing food waste for animal feed.

## What's next for Farm Connect
- Scaling the platform: We plan to expand the app’s reach to a wider audience of stores and farmers across multiple states and regions.
- Mobile app development: We are considering developing a mobile version of the app to make it easier for farmers to access food scraps while on the go and for stores to list available items directly from their phones.
- Better AI models: We'll work on further improving the Gemini-powered food matching algorithms to be more precise and better understand the changing needs of livestock and the varying types of food scraps available.
- Partnerships: We plan to partner with local municipalities, food banks, and sustainability-focused organizations to amplify the positive environmental and economic impact of the platform.
 - User education and awareness: We will work on providing more resources, tips, and education to both stores and farmers about the benefits of repurposing food scraps and reducing food waste.
