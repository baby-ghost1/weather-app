import { useState, useEffect } from "react";
import { UnitProvider } from "./context/UnitContext";
import WeatherBackground from "./components/WeatherBackground";
import SearchBar from "./components/SearchBar";
import CurrentTime from "./components/CurrentTime";
import WeatherCard from "./components/WeatherCard";
import HourlyForecast from "./components/HourlyForecast";
import WeatherDetails from "./components/WeatherDetails";
import WeatherAlerts from "./components/WeatherAlerts";
import AirQualityCard from "./components/AirQualityCard";
import UVIndexCard from "./components/UVIndexCard";
import WindCompass from "./components/WindCompass";
import UnitToggle from "./components/UnitToggle";
import ShareWeather from "./components/ShareWeather";
import CityCompare from "./components/CityCompare";
import SearchHistory from "./components/SearchHistory";
import Loader from "./components/Loader";
import { useWeather } from "./hooks/useWeather";

const WeatherApp = () => {
  const { weather, forecast, loading, error, setError, fetchByCity, fetchByCoords } = useWeather();
  const [hasGeolocated, setHasGeolocated] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favOpen, setFavOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("weather_favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const saveFavorites = (favs) => {
    setFavorites(favs);
    localStorage.setItem("weather_favorites", JSON.stringify(favs));
  };

  const addFavorite = () => {
    if (!weather || favorites.some((f) => f.city === weather.city)) return;
    saveFavorites([...favorites, { city: weather.city, country: weather.country }]);
  };

  const removeFavorite = (city, e) => {
    e.stopPropagation();
    saveFavorites(favorites.filter((f) => f.city !== city));
  };

  const isFavorite = weather && favorites.some((f) => f.city === weather.city);

  useEffect(() => {
    if (hasGeolocated) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { fetchByCoords(pos.coords.latitude, pos.coords.longitude); setHasGeolocated(true); },
        () => setHasGeolocated(true),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setHasGeolocated(true);
    }
  }, []);

  const handleSearch = (city) => fetchByCity(city);
  const handleLocation = () => {
    if (!("geolocation" in navigator)) { setError("Geolocation is not supported by your browser."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        const msgs = { 1: "Location permission denied. You can still search manually.", 2: "Position unavailable. Try again or use the search box.", 3: "Location request timed out. Try again." };
        setError(msgs[err.code] || "Error getting location.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <WeatherBackground weatherMain={weather?.main} />

      <div className="relative z-10 min-h-screen flex flex-col px-6 sm:px-12 md:px-20 lg:px-32 py-8">
        <header className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
              <span className="text-xl">⛅</span>
            </div>
            <h1 className="text-white text-xl font-medium tracking-tight">WeatherFlow</h1>
          </div>
          <div className="flex items-center gap-2">
            <UnitToggle />
            {weather && <ShareWeather weather={weather} />}
            {weather && <CityCompare currentWeather={weather} />}
          </div>
        </header>

        <div className="max-w-2xl w-full mx-auto mb-6 animate-slide-up">
          <SearchBar onSearch={handleSearch} onLocation={handleLocation} loading={loading} />
        </div>

        {weather && !loading && <WeatherAlerts weather={weather} />}

        {error && (
          <div className="max-w-2xl w-full mx-auto mb-6 animate-slide-down">
            <div className="glass rounded-2xl px-5 py-4 flex items-center justify-between border border-red-400/30">
              <p className="text-red-200 text-sm">{error}</p>
              <button onClick={() => setError("")} className="text-red-300/60 hover:text-red-200 text-lg font-bold transition-colors">×</button>
            </div>
          </div>
        )}

        {loading && <Loader />}

        {weather && !loading && (
          <main className="flex-1 flex flex-col gap-8 max-w-5xl w-full mx-auto">
            <div className="flex flex-col items-center gap-6">
              <CurrentTime />
              <WeatherCard weather={weather} />
            </div>

            <div className="flex justify-center">
              <button onClick={isFavorite ? (e) => removeFavorite(weather.city, e) : addFavorite}
                className="glass rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <span className={isFavorite ? "text-yellow-400" : "text-white/40"}>{isFavorite ? "★" : "☆"}</span>
                <span className="text-white/70">{isFavorite ? "Saved to Favorites" : "Save to Favorites"}</span>
              </button>
            </div>

            <HourlyForecast forecast={forecast} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AirQualityCard lat={weather.lat} lon={weather.lon} />
              <UVIndexCard lat={weather.lat} lon={weather.lon} />
              <WindCompass speed={weather.windSpeed} deg={weather.windDeg} />
            </div>

            <WeatherDetails weather={weather} />
          </main>
        )}

        {!weather && !loading && !error && (
          <main className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="text-8xl mb-6 animate-float">🌤</div>
            <h2 className="text-white text-3xl font-light mb-3">What's the weather like?</h2>
            <p className="text-white/40 text-sm max-w-sm">Search for a city or use your current location to get started</p>
            <div className="mt-6 flex items-center gap-2 text-white/20 text-xs">
              <kbd className="glass rounded px-2 py-1">/</kbd><span>to search</span>
              <span className="mx-1">·</span>
              <kbd className="glass rounded px-2 py-1">Esc</kbd><span>to close</span>
            </div>
          </main>
        )}

        <footer className="mt-auto pt-8 flex flex-col items-center gap-3">
          {favorites.length > 0 && (
            <div className="relative">
              <button onClick={() => setFavOpen(!favOpen)} className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs transition-colors">
                <span className="text-yellow-400">★</span><span>Favorites ({favorites.length})</span>
              </button>
              {favOpen && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 glass-strong rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down">
                  <div className="px-4 py-3 border-b border-white/10"><span className="text-white/80 font-medium text-sm">Favorite Cities</span></div>
                  <div className="max-h-48 overflow-y-auto">
                    {favorites.map((fav) => (
                      <div key={fav.city} onClick={() => { handleSearch(fav.city); setFavOpen(false); }}
                        className="flex items-center justify-between px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-b-0">
                        <span className="text-white text-sm">{fav.city}, {fav.country}</span>
                        <button onClick={(e) => removeFavorite(fav.city, e)} className="text-white/20 hover:text-red-400 transition-colors text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <SearchHistory onSelectCity={handleSearch} />
        </footer>
      </div>
    </div>
  );
};

const App = () => (
  <UnitProvider>
    <WeatherApp />
  </UnitProvider>
);

export default App;
