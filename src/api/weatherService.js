/**
 * Core API fetching logic for Open-Meteo.
 * Strictly separated from UI logic.
 */

const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetches exactly 36 hours of weather forecast starting from the current hour.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Object containing hourly data array and metadata object.
 */
export async function fetchWeatherForecast(lat = 53.10, lon = 8.00) {
    // Request 3 days of forecast to guarantee 36 hours from the current time
    const url = new URL(API_BASE_URL);
    url.searchParams.append('latitude', lat);
    url.searchParams.append('longitude', lon);
    url.searchParams.append('hourly', 'temperature_2m,precipitation,wind_speed_10m,wind_direction_10m');
    url.searchParams.append('models', 'icon_d2'); // Explicitly calling ICON-D2 as requested
    url.searchParams.append('timezone', 'auto');
    url.searchParams.append('forecast_days', '3');

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Use exact local time of fetch for the metadata timestamp
        const lastUpdated = new Date().toLocaleString('de-DE', { 
            day: '2-digit', month: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });

        const metadata = {
            model: "ICON-D2",
            lastUpdated: lastUpdated
        };

        return {
            hourlyData: processHourlyData(data.hourly),
            metadata: metadata
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

/**
 * Processes the raw hourly API response.
 * Filters for exactly the next 36 hours starting from the current hour.
 * @param {Object} hourlyData - Raw hourly data from Open-Meteo.
 * @returns {Array} Clean array of 36 hourly data objects.
 */
function processHourlyData(hourlyData) {
    const now = new Date();
    // Reset minutes/seconds to match Open-Meteo's hourly timestamp format
    now.setMinutes(0, 0, 0);
    
    const formattedData = [];
    const startIndex = hourlyData.time.findIndex(timeStr => new Date(timeStr) >= now);

    if (startIndex === -1) {
        throw new Error("Could not find current time in forecast data.");
    }

    // Extract exactly 36 hours
    for (let i = startIndex; i < startIndex + 36; i++) {
        if (i < hourlyData.time.length) {
            formattedData.push({
                time: hourlyData.time[i],
                temperature: hourlyData.temperature_2m[i],
                precipitation: hourlyData.precipitation[i],
                windSpeed: hourlyData.wind_speed_10m[i],
                windDirection: hourlyData.wind_direction_10m[i]
            });
        }
    }

    return formattedData;
}
