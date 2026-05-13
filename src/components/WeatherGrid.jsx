import React from 'react';
import WeatherCard from './WeatherCard';

export default function WeatherGrid({ weatherData }) {
    if (!weatherData || weatherData.length === 0) return null;

    return (
        <div className="weather-grid">
            {weatherData.map((hourData, index) => (
                <WeatherCard key={index} data={hourData} />
            ))}
        </div>
    );
}
