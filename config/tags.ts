/**
 * Central source of truth for tag governance.
 *
 * This file is imported by:
 *   - lib/utils.ts (re-exports for runtime code)
 *   - scripts/generate-blog-cache.ts (ingest-time tag sanitization)
 *   - scripts/generate-blog-sitemap.ts (sitemap tag filtering)
 *   - app/tag/[tag]/page.tsx (editorial intros for hub pages)
 *
 * Edit this ONE file when rebranding the template for a new niche.
 * No runtime code below should hardcode tag lists.
 */

// Tags longer than this are treated as article-title accidents from LLM generation
export const MAX_TAG_LENGTH = 30

// Minimum articles required for a tag to get its own hub page
export const MIN_POSTS_PER_HUB = 5

/**
 * CANONICAL_TAGS — the approved allowlist for LLM content generation.
 * Pass this to prompts to prevent tag pollution. Tags not in this list or
 * in GENERIC_TAGS below are still allowed, but won't generate hub pages.
 *
 * Adventure backpacking niche: top backpacker destinations, regions, and themes.
 */
export const CANONICAL_TAGS: ReadonlySet<string> = new Set([
  // Southeast Asia hubs
  "Hanoi", "Saigon", "Hoi An", "Vietnam",
  "Bangkok", "Chiang Mai", "Pai", "Krabi", "Thailand",
  "Bali", "Yogyakarta", "Lombok", "Indonesia",
  "Manila", "Cebu", "Palawan", "Philippines",
  "Luang Prabang", "Vientiane", "Laos",
  "Siem Reap", "Phnom Penh", "Cambodia",
  // South Asia hubs
  "Kathmandu", "Pokhara", "Nepal",
  "Goa", "Rishikesh", "India",
  "Colombo", "Ella", "Sri Lanka",
  // Latin America hubs
  "La Paz", "Uyuni", "Bolivia",
  "Cusco", "Lima", "Peru",
  "Medellin", "Cartagena", "Colombia",
  "Oaxaca", "Mexico City", "Mexico",
  "Quito", "Banos", "Ecuador",
  // Africa & Middle East
  "Cape Town", "Johannesburg", "South Africa",
  "Marrakech", "Fes", "Morocco",
  "Zanzibar", "Arusha", "Tanzania",
  // Europe (backpacker hubs)
  "Reykjavik", "Iceland",
  "Lofoten", "Bergen", "Norway",
  "Tbilisi", "Georgia",
  "Sarajevo", "Bosnia",
  "Albania", "Tirana",
  // Oceania
  "Queenstown", "Auckland", "New Zealand",
  "Cairns", "Sydney", "Australia",
  // Themes & activities
  "Backpacking", "Hostel", "Hostels", "Budget Travel",
  "Hiking", "Trekking", "Mountain Biking", "Kayaking",
  "Surfing", "Diving", "Climbing", "Volunteering",
  "Overland", "Visa", "Travel Gear", "Packing",
  "Itinerary", "Day Trip", "Adventure",
])

/**
 * GENERIC_TAGS — excluded from hub pages, tag chips, and sitemap-tags.xml.
 * These are content-type labels, CMS internals, and overly-broad themes that
 * would produce low-value hub pages if indexed.
 */
export const GENERIC_TAGS: ReadonlySet<string> = new Set([
  // Content types & formats
  "travel", "Travel", "guides", "Guide", "Travel Guide", "travel guide",
  "Adventure Travel", "Adventure", "Howto", "How-to", "Listicle",
  "Step-by-step Guide", "Comprehensive Guide", "Beginner Friendly",
  "Intermediate", "Navigation", "Booking",
  // Internal CMS labels
  "Main", "Main Content", "Featured Content", "Information",
  "Pillar", "Hub Page", "Hub",
  // Generic travel themes (too broad to be useful as hubs)
  "Trip Planning", "Travel Tips", "travel tips", "Budget",
  "Seasonal", "2026", "Events", "Entertainment", "Sightseeing",
  "Cultural Travel", "Summer Travel", "general",
])

/**
 * Editorial intros for tag hub pages. Drives the top-of-page descriptive
 * paragraph AND the meta description for each hub. Unmatched slugs fall back
 * to a generic auto-generated description.
 *
 * Keys must match the output of tagToSlug() (lowercase, hyphenated).
 * Add an entry here when creating a new hub for an important tag.
 */
export const TAG_DESCRIPTIONS: Record<string, string> = {
  hanoi: "Hanoi is the launchpad for Southeast Asian backpacking — Old Quarter alleys, $1 bowls of pho, sleeper buses south to Hue and Hoi An, and overnight trains north to Sapa. These guides cover hostels, day trips to Ha Long Bay and Ninh Binh, the cheapest motorbike rentals, and how to plan a 10–30-day Vietnam route from here.",
  bangkok: "Bangkok is the budget-traveler capital of Asia — Khao San Road hostels, night markets, $5 massages, and the cheapest international flights on the continent. These guides cover the best hostels, day trips to Ayutthaya, overland routes to Cambodia and Laos, and how to use Bangkok as a Southeast Asia hub.",
  "chiang-mai": "Chiang Mai is northern Thailand's backpacker base — elephant sanctuaries, jungle treks, $3 pad thai, and a digital-nomad cafe scene that goes for miles. These guides cover Old City hostels, ethical elephant programs, hiking trails to hill-tribe villages, and how to plan a Pai or Mae Hong Son loop from here.",
  manila: "Manila is the gateway to the Philippines' 7,000 islands — busy, chaotic, and the cheapest jumping-off point for Palawan, Cebu, and Siargao. These guides cover hostels in Makati and BGC, day trips to Tagaytay and Taal Volcano, and the best inter-island flights and ferry routes for a budget backpacking loop.",
  kathmandu: "Kathmandu is the Himalayan trek launchpad — Thamel's permit shops, gear rental, and the cheapest dal bhat in Asia. These guides cover hostels in Thamel, trekking permits for Annapurna and Everest Base Camp, day trips to Bhaktapur and Nagarkot, and how to plan a 10–30-day Nepal route.",
  "la-paz": "La Paz is the highest capital in the world and Bolivia's backpacker hub — Death Road biking, Uyuni salt-flat tours, witches' markets, and cable-car rides between barrios. These guides cover hostels, the Death Road experience, three-day Uyuni tours, and how to plan an Andes loop into Peru or Argentina.",
  "cape-town": "Cape Town is South Africa's adventure capital — Table Mountain hikes, Cape Peninsula tours, world-class diving, and the cheapest jaw-dropping coastline on the continent. These guides cover backpacker hostels, the Garden Route drive, township tours, and how to combine Cape Town with safaris in Kruger or Botswana.",
  queenstown: "Queenstown is New Zealand's adventure-sports capital — bungy, paragliding, jet-boating, and the start of multi-day tracks like the Routeburn and Milford. These guides cover lakeside hostels, the cheapest tracks to hike, Fiordland day trips, and how to plan a South Island road trip from here.",
  reykjavik: "Reykjavik is the launchpad for Iceland's Ring Road — glacier hikes, geothermal pools, midnight-sun summers, and northern-light winters. These guides cover hostels in central Reykjavik, the Golden Circle day trip, a 7–10 day Ring Road itinerary, and how to keep costs down in the world's most expensive country.",
  cairns: "Cairns is the Great Barrier Reef gateway — daily diving and snorkel trips, Daintree Rainforest day tours, and one of Australia's most affordable hostel scenes. These guides cover the cheapest reef trips, the Atherton Tablelands loop, and how to combine Cairns with a Whitsundays sailing trip.",
  medellin: "Medellin is Colombia's reinvented backpacker hub — paragliding above the Aburra Valley, Comuna 13 street art tours, and the cheapest Spanish schools on the continent. These guides cover hostels in El Poblado and Laureles, day trips to Guatape, and how to plan a Cartagena–Medellin–Salento loop.",
  // Country/region tags
  vietnam: "Vietnam is one of the world's great backpacking countries — sleeper buses from Hanoi to Saigon, $5 hostel beds, and overland border crossings into Laos and Cambodia. These guides cover route planning, visa rules, motorbike rentals, and the best stops on a 10–30-day Vietnam route.",
  thailand: "Thailand is the most visited backpacking country in Southeast Asia — Bangkok, Chiang Mai, Pai, and the island chains of Krabi and Koh Tao. These guides cover overland routes, hostel networks, the best islands by season, and the cheapest way to move between regions.",
  nepal: "Nepal is the world's trekking capital — Annapurna Circuit, Everest Base Camp, and dozens of shorter hikes accessible from Kathmandu or Pokhara. These guides cover permit logistics, trek difficulty, gear rental in Thamel, and how to combine trekking with rafting, paragliding, and cultural detours.",
  bolivia: "Bolivia is the wildest backpacking country in South America — Uyuni salt flats, Death Road, Amazonian rainforest tours, and the highest navigable lake on Earth. These guides cover La Paz and Sucre hostels, three-day Uyuni tours, and how to cross into Peru, Chile, or Argentina overland.",
  peru: "Peru is the heart of Andean backpacking — Machu Picchu, Cusco, Lake Titicaca, and Amazon expeditions from Iquitos. These guides cover Inca Trail permits, hostels in Cusco's San Blas, the cheapest Machu Picchu route, and how to plan a 10–30-day Peru itinerary.",
  iceland: "Iceland is one of the world's most photogenic countries — glaciers, geysers, waterfalls, and the Ring Road that ties them all together. These guides cover camper-van rentals vs. hostels, Ring Road itineraries by season, the Golden Circle, and how to budget for Iceland's famously high prices.",
  "south-africa": "South Africa offers the most diverse backpacking experience on the continent — Cape Town, the Garden Route, Kruger safaris, and Drakensberg hiking. These guides cover Baz Bus passes, township tours, safari budgets, and how to combine South Africa with Namibia or Botswana.",
  "new-zealand": "New Zealand is the planet's best adventure-sports country — bungy in Queenstown, multi-day tracks in Fiordland, surfing in Raglan, and glaciers in Franz Josef. These guides cover the cheapest hostels and campgrounds, North vs. South Island itineraries, and seasonal timing.",
  // Theme/activity tags
  backpacking: "Backpacking is about long, slow, low-budget travel — sleeper trains, hostel dorms, overland borders, and itineraries built around what you can actually afford. These guides cover route planning, gear, budgets, and the regions that reward backpackers the most.",
  hostels: "Hostels are the social, budget heart of backpacking travel — dorms, common rooms, walking tours, and the easiest way to meet other travelers on the road. These guides cover the best hostel networks by country, what to look for in a hostel, and the unwritten rules of dorm life.",
  hiking: "Hiking is one of the cheapest and most rewarding things you can do as a backpacker — from day walks above hostel towns to multi-week treks like Annapurna or Torres del Paine. These guides cover trail logistics, gear, seasonal timing, and the best regions for every fitness level.",
  trekking: "Trekking — multi-day hiking with overnight stays in teahouses, refuges, or tents — defines backpacking in places like Nepal, Peru, and Patagonia. These guides cover permits, gear rental, difficulty grading, and how to choose between guided trips and independent treks.",
  "budget-travel": "Budget travel is the foundation of backpacking — $20–$50/day in cheap countries, $50–$100/day in expensive ones. These guides cover hostel networks, street-food eating, overland transit, and the specific tricks that drop daily costs without making the trip miserable.",
  itinerary: "Itinerary planning is the difference between an exhausting trip and a great one. These guides cover region-by-region routes — 10-day, 30-day, and longer — with realistic pacing, transport assumptions, and the stops that consistently reward backpackers.",
}
