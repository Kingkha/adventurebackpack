import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

// Cache for city data to avoid reading CSV file repeatedly
let cityDataCache: any[] | null = null

// Function to load and parse city data from CSV
function loadCityData() {
  if (cityDataCache) {
    return cityDataCache
  }

  try {
    const csvPath = path.join(process.cwd(), 'content', 'cities.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })
    
    cityDataCache = records
    return records
  } catch (error) {
    console.error('Error loading city data:', error)
    return []
  }
}

// Function to extract city name from content
function extractCityFromContent(content: string, title: string, slug: string): string | undefined {
  // Load city data
  const cities = loadCityData()
  
  // For slug-based detection, try to extract city by removing common postfixes
  if (slug) {
    // Remove common postfixes from slug
    const postfixes = ['-events', '-activities', '-highlights', '-landmarks', '-culture', '-experiences', '-itinerary', '-guide', '-tips', '-attractions', '-tours', '-things-to-do']
    
    let citySlug = slug.toLowerCase()
    
    // Remove postfixes
    for (const postfix of postfixes) {
      if (citySlug.endsWith(postfix)) {
        citySlug = citySlug.slice(0, -postfix.length)
        break
      }
    }
    
    // Now search for cities that match the cleaned slug
    const foundCities = cities.filter(city => {
      // Normalize both strings by removing accents and converting to lowercase
      const normalizeString = (str: string) => {
        return str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/\s+/g, '-')
      }
      
      const normalizedCityName = normalizeString(city.City)
      const normalizedSlug = normalizeString(citySlug)
      
      // Exact match with normalized strings
      if (normalizedCityName === normalizedSlug) {
        return true
      }
      
      // Also check original city name (with spaces) converted to slug format
      const citySlugFromName = city.City.toLowerCase().replace(/\s+/g, '-')
      if (citySlugFromName === citySlug) {
        return true
      }
      
      return false
    })
    
    if (foundCities.length > 0) {
      return foundCities[0].City
    }
  }
  
  // Fallback: search in all text content
  const allText = `${title} ${slug} ${content}`.toLowerCase()
  
  const foundCities = cities.filter(city => {
    const cityName = city.City.toLowerCase()
    return allText.includes(cityName)
  })
  
  // Return the first match, or null if none found
  return foundCities.length > 0 ? foundCities[0].City : undefined
}

// Function to find city data by name
function findCityData(cityName: string) {
  const cities = loadCityData()
  return cities.find(city => 
    city.City.toLowerCase() === cityName.toLowerCase()
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const content = searchParams.get('content') || '';
    const title = searchParams.get('title') || '';
    const slug = searchParams.get('slug') || '';
    const cityName = searchParams.get('cityName');
    
    let detectedCity = cityName;
    
    // If no city name provided, try to extract from slug first (most reliable)
    if (!detectedCity && slug) {
      detectedCity = extractCityFromContent('', '', slug);
    }
    
    // If still no city detected, try to extract from content/title
    if (!detectedCity) {
      detectedCity = extractCityFromContent(content, title, slug);
    }
    
    if (detectedCity) {
      const cityData = findCityData(detectedCity);
      if (cityData && cityData.viator_destination_id) {
        // Construct Viator URL using viator_destination_name from CSV, replacing spaces with hyphens
        const viatorUrlSlug = cityData.viator_destination_name.replace(/\s+/g, '-');
        return NextResponse.json({
          success: true,
          cityData,
          viatorUrl: `https://www.viator.com/${viatorUrlSlug}/d${cityData.viator_destination_id}-ttd`
        });
      }
    }
    
    return NextResponse.json({
      success: false,
      cityData: null,
      viatorUrl: 'https://www.viator.com/'
    });
    
  } catch (error) {
    console.error('Error in city API:', error);
    return NextResponse.json({
      success: false,
      cityData: null,
      viatorUrl: 'https://www.viator.com/'
    }, { status: 500 });
  }
}
