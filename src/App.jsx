import React, { useState, useEffect } from 'react';
import { fetchWeatherForecast } from './api/weatherService';
import { searchCity } from './api/geocodingService';
import WeatherGrid from './components/WeatherGrid';
import { Search } from 'lucide-react';
import './index.css';

function App() {
    const [weatherData, setWeatherData] = useState([]);
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Default location updated per user request
    const [location, setLocation] = useState({
        lat: 53.10,
        lon: 8.00,
        name: "Bad Zwischenahn"
    });
    
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchWeatherForecast(location.lat, location.lon);
                setWeatherData(data.hourlyData);
                setMetadata(data.metadata);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Fehler beim Laden der Wetterdaten. Bitte versuche es später erneut.");
                setLoading(false);
            }
        }

        loadData();
    }, [location]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const result = await searchCity(searchInput);
            if (result) {
                setLocation({
                    lat: result.lat,
                    lon: result.lon,
                    name: `${result.name}${result.admin1 ? ', ' + result.admin1 : ''}`
                });
                setSearchInput(""); // Clear input on success
            } else {
                setError(`Stadt "${searchInput}" wurde nicht gefunden.`);
                setLoading(false);
            }
        } catch (err) {
            setError("Fehler bei der Ortssuche. Bitte versuche es später erneut.");
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1>TrainingWeather</h1>
                
                {/* Search Bar */}
                <form className="search-form" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        placeholder="Stadt suchen..." 
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        <Search size={18} />
                    </button>
                </form>
            </header>

            <main className="dashboard-container">
                <div className="dashboard-header">
                    <h2 className="location-title">{location.name}</h2>
                </div>

                {loading && <div className="loading-state">Lade Wetterdaten...</div>}
                
                {error && <div className="error-state">{error}</div>}
                
                {!loading && !error && <WeatherGrid weatherData={weatherData} />}

                {metadata && !loading && !error && (
                    <footer className="dashboard-footer">
                        <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Datenstand:</div>
                        <div>* RUC Nowcasting: Lauf von {metadata.lastUpdatedRuc} Uhr (Nächstes Update ca. {metadata.nextUpdateRuc} Uhr)</div>
                        <div>* ICON-D2 Basis: Lauf von {metadata.lastUpdatedIcon} Uhr (Nächstes Update ca. {metadata.nextUpdateIcon} Uhr)</div>
                    </footer>
                )}
            </main>
        </div>
    );
}

export default App;
