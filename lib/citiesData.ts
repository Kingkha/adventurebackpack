/**
 * Cities Data Loader
 * Loads and caches city data from cities.csv
 * Data is loaded once at build time and kept in memory
 */

import fs from 'fs';
import path from 'path';

export interface CityData {
  city: string;
  region: string;
  country: string;
  viatorDestinationId: string;
  viatorDestinationName: string;
  getyourguideLocationId: string;
}

let _citiesCache: CityData[] | null = null;

export function loadCitiesData(): CityData[] {
  if (_citiesCache !== null) {
    return _citiesCache;
  }

  try {
    const csvPath = path.join(process.cwd(), 'content', 'cities.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const lines = fileContent.split('\n');
    const cities: CityData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values: string[] = [];
      let currentValue = '';
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim());

      if (values.length >= 6) {
        const cleanViatorId = values[3] ? String(Math.floor(parseFloat(values[3]))) : '';
        const cleanGygId = values[5] ? String(Math.floor(parseFloat(values[5]))) : '';

        cities.push({
          city: values[0],
          region: values[1],
          country: values[2],
          viatorDestinationId: cleanViatorId,
          viatorDestinationName: values[4] || values[0],
          getyourguideLocationId: cleanGygId,
        });
      }
    }

    _citiesCache = cities;
    return cities;
  } catch (error) {
    console.error('❌ Error loading cities data:', error);
    _citiesCache = [];
    return [];
  }
}

function normalizeCityName(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^a-z0-9()\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function findCityData(cityName: string): CityData | null {
  const cities = loadCitiesData();
  const cityLower = normalizeCityName(cityName);

  let cityData = cities.find((c) => normalizeCityName(c.city) === cityLower);
  if (cityData) return cityData;

  cityData = cities.find((c) => normalizeCityName(c.city).includes(cityLower));
  if (cityData) return cityData;

  cityData = cities.find((c) => {
    const city = normalizeCityName(c.city);
    if (city.includes('(') && city.includes(')')) {
      const mainCity = city.split('(')[0].trim();
      const altCity = city.split('(')[1].split(')')[0].trim();
      return (
        mainCity === cityLower ||
        altCity === cityLower ||
        mainCity.includes(cityLower) ||
        altCity.includes(cityLower)
      );
    }
    return false;
  });

  return cityData || null;
}

export function extractCityFromTags(tags: string[]): string | null {
  if (tags && tags.length >= 4) {
    const cityTag = String(tags[3]);
    const cityName = cityTag.replace(/-/g, ' ').replace(/_/g, ' ').trim();
    return cityName || null;
  }
  return null;
}

export function convertCityToUrlFriendly(city: string): string {
  let cityUrl = city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss');

  cityUrl = cityUrl.replace(/\s+/g, '-');
  cityUrl = cityUrl.replace(/[^a-zA-Z0-9-]/g, '');

  return cityUrl;
}
