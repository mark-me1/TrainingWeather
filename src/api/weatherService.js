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
    url.searchParams.append('models', 'icon_d2,icon_d2_ruc'); // Explicitly calling ICON-D2 and RUC
    url.searchParams.append('timezone', 'auto');
    url.searchParams.append('forecast_days', '3');

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const initTimeIcon = calculateIconD2InitTime();
        const initTimeRuc = calculateIconD2RucInitTime();
        
        const formatTime = (dateObj) => {
            return dateObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        };

        const metadata = {
            lastUpdatedIcon: formatTime(initTimeIcon),
            lastUpdatedRuc: formatTime(initTimeRuc)
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
 * Calculates the exact deterministic initialization time of the ICON-D2 model.
 */
function calculateIconD2InitTime() {
    const now = new Date();
    // Use current UTC time minus 2 hours (delay offset)
    now.setUTCHours(now.getUTCHours() - 2);
    
    // Round down to nearest multiple of 3 (0, 3, 6, 9, 12, 15, 18, 21)
    const initHour = Math.floor(now.getUTCHours() / 3) * 3;
    
    // Create new Date for exact initialization time
    const initTime = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        initHour,
        0,
        0,
        0
    ));
    
    return initTime;
}

/**
 * Calculates the exact deterministic initialization time of the ICON-D2-RUC model.
 */
function calculateIconD2RucInitTime() {
    const now = new Date();
    // Use current UTC time minus 1 hour (delay offset)
    now.setUTCHours(now.getUTCHours() - 1);
    
    // Round down to nearest full hour
    const initTime = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        0,
        0,
        0
    ));
    
    return initTime;
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
            const hasRuc = hourlyData.temperature_2m_icon_d2_ruc && 
                           hourlyData.temperature_2m_icon_d2_ruc[i] !== null && 
                           hourlyData.temperature_2m_icon_d2_ruc[i] !== undefined;

            formattedData.push({
                time: hourlyData.time[i],
                temperature: hasRuc ? hourlyData.temperature_2m_icon_d2_ruc[i] : hourlyData.temperature_2m_icon_d2[i],
                precipitation: hasRuc ? hourlyData.precipitation_icon_d2_ruc[i] : hourlyData.precipitation_icon_d2[i],
                windSpeed: hasRuc ? hourlyData.wind_speed_10m_icon_d2_ruc[i] : hourlyData.wind_speed_10m_icon_d2[i],
                windDirection: hasRuc ? hourlyData.wind_direction_10m_icon_d2_ruc[i] : hourlyData.wind_direction_10m_icon_d2[i],
                isRuc: hasRuc
            });
        }
    }

    return formattedData;
}
