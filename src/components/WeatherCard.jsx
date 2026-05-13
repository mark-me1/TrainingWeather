import React from 'react';
import { Droplets, Wind, ArrowUp, AlertTriangle, CheckCircle } from 'lucide-react';
import './WeatherCard.css';

export default function WeatherCard({ data }) {
    // Format time (e.g., "14" or "14:00")
    const dateObj = new Date(data.time);
    const timeString = dateObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    
    // Determine condition (Optimal vs Warning)
    let conditionClass = '';
    
    // Logic: 
    // Optimal: Precipitation == 0 AND Wind Speed < 20
    // Warning: Precipitation > 1 OR Wind Speed > 40
    if (data.precipitation > 1 || data.windSpeed > 40) {
        conditionClass = 'warning';
    } else if (data.precipitation === 0 && data.windSpeed < 20) {
        conditionClass = 'optimal';
    }

    // Wind direction arrow rotation
    const arrowRotation = data.windDirection + 180;

    return (
        <div className={`dense-card ${conditionClass}`}>
            <div className="dense-time">
                {timeString}
            </div>
            <div className="dense-temp">
                {Math.round(data.temperature)}°
            </div>
            <div className="dense-metrics">
                <div className="dense-metric">
                    <Droplets className="dense-icon" />
                    <span>{data.precipitation.toFixed(1)}</span>
                </div>
                <div className="dense-metric">
                    <Wind className="dense-icon" />
                    <span>{Math.round(data.windSpeed)}</span>
                    <ArrowUp 
                        className="dense-icon-arrow" 
                        style={{ transform: `rotate(${arrowRotation}deg)` }} 
                    />
                </div>
            </div>
        </div>
    );
}
