/**
 * Geocoding API service to resolve city names into coordinates.
 */

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Searches for a city and returns its top result's coordinates and name.
 * @param {string} cityName 
 * @returns {Promise<Object>} { lat, lon, name, admin1, country } or null if not found
 */
export async function searchCity(cityName) {
    if (!cityName.trim()) return null;

    const url = new URL(GEOCODING_API_URL);
    url.searchParams.append('name', cityName.trim());
    url.searchParams.append('count', '1');
    url.searchParams.append('language', 'de');
    url.searchParams.append('format', 'json');

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
                lat: result.latitude,
                lon: result.longitude,
                name: result.name,
                admin1: result.admin1,
                country: result.country
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching geocoding data:", error);
        throw error;
    }
}
