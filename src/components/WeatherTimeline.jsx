import React from 'react';
import WeatherCard from './WeatherCard';

export default function WeatherTimeline({ weatherData }) {
    if (!weatherData || weatherData.length === 0) return null;

    return (
        <div className="timeline-wrapper">
            <div className="weather-timeline">
                {weatherData.map((hourData, index) => (
                    <WeatherCard key={index} data={hourData} />
                ))}
            </div>
        </div>
    );
}
