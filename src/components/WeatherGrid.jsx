import React from 'react';
import WeatherCard from './WeatherCard';

export default function WeatherGrid({ weatherData }) {
    if (!weatherData || weatherData.length === 0) return null;

    // Group the data by calendar date
    const groupedData = {};
    
    // Helper to format date strings like "Heute, 13. Mai"
    const getDayLabel = (dateStr) => {
        const dateObj = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const options = { day: 'numeric', month: 'long' };
        const dateFormatted = dateObj.toLocaleDateString('de-DE', options);
        
        if (dateObj.toDateString() === today.toDateString()) {
            return `Heute, ${dateFormatted}`;
        } else if (dateObj.toDateString() === tomorrow.toDateString()) {
            return `Morgen, ${dateFormatted}`;
        } else {
            const weekday = dateObj.toLocaleDateString('de-DE', { weekday: 'long' });
            return `${weekday}, ${dateFormatted}`;
        }
    };

    weatherData.forEach(hourData => {
        // Use the date part of the ISO string (e.g., "2026-05-13") as the key
        const dateKey = hourData.time.split('T')[0];
        if (!groupedData[dateKey]) {
            groupedData[dateKey] = [];
        }
        groupedData[dateKey].push(hourData);
    });

    return (
        <div className="weather-grid-container">
            {Object.keys(groupedData).map(dateKey => (
                <div key={dateKey} className="day-group">
                    <h3 className="day-divider">{getDayLabel(groupedData[dateKey][0].time)}</h3>
                    <div className="weather-grid">
                        {groupedData[dateKey].map((hourData, index) => (
                            <WeatherCard key={index} data={hourData} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
