import React, { useState, useEffect, Suspense } from "react";
import { UnitProvider } from "./context/UnitContext";
import WeatherBackground from "./components/WeatherBackground";
import WeatherParticles from "./components/WeatherParticles";
import SearchBar from "./components/SearchBar";
import HeroCard from "./components/HeroCard";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import WeatherDetails from "./components/WeatherDetails";
import WeatherAlerts from "./components/WeatherAlerts";
import AirQualityCard from "./components/AirQualityCard";
import AQIForecast from "./components/AQIForecast";
import UVIndexCard from "./components/UVIndexCard";
import WindCompass from "./components/WindCompass";
const WeatherCharts = React.lazy(() => import("./components/WeatherCharts"));
import WeatherMap from "./components/WeatherMap";
import MoonPhase from "./components/MoonPhase";
import SunPosition from "./components/SunPosition";
import PollenCount from "./components/PollenCount";
import FireIndex from "./components/FireIndex";
import EarthquakeAlerts from "./components/EarthquakeAlerts";
import WeatherHistory from "./components/WeatherHistory";
import TravelAdvisory from "./components/TravelAdvisory";
import HealthIndex from "./components/HealthIndex";
import SportsIndex from "./components/SportsIndex";
import AgricultureIndex from "./components/AgricultureIndex";
import PhotographyIndex from "./components/PhotographyIndex";
import WeatherJournal from "./components/WeatherJournal";
import SeasonalCalendar from "./components/SeasonalCalendar";
import WeatherQuiz from "./components/WeatherQuiz";
import WeatherNotifications from "./components/WeatherNotifications";
import EnergyCost from "./components/EnergyCost";
import AllergyCalendar from "./components/AllergyCalendar";
import WeatherNews from "./components/WeatherNews";
import CarbonFootprint from "./components/CarbonFootprint";
import MultiCityDashboard from "./components/MultiCityDashboard";
import WeatherTimer from "./components/WeatherTimer";
import ARWeather from "./components/ARWeather";
import SkeletonLoader from "./components/SkeletonLoader";
import ThemeSwitcher from "./components/ThemeSwitcher";
import UnitToggle from "./components/UnitToggle";
import ShareWeather from "./components/ShareWeather";
import CityCompare from "./components/CityCompare";
import SearchHistory from "./components/SearchHistory";
import SleepQualityIndex from "./components/SleepQualityIndex";
import PetWeather from "./components/PetWeather";
import CommutePlanner from "./components/CommutePlanner";
import WeatherPlaylist from "./components/WeatherPlaylist";
import WeatherRecipe from "./components/WeatherRecipe";
import FlightDelayPredictor from "./components/FlightDelayPredictor";
import GardenPlanner from "./components/GardenPlanner";
import WorkoutScheduler from "./components/WorkoutScheduler";
import MoodTracker from "./components/MoodTracker";
import DewPoint from "./components/DewPoint";
import WindChillHeatIndex from "./components/WindChillHeatIndex";
import VisibilityForecast from "./components/VisibilityForecast";
import LightningTracker from "./components/LightningTracker";
import HailRisk from "./components/HailRisk";
import UVHourlyForecast from "./components/UVHourlyForecast";
import SurfWaveReport from "./components/SurfWaveReport";
import WeatherStories from "./components/WeatherStories";
import MonthlyHeatmap from "./components/MonthlyHeatmap";
import WeatherShareCard from "./components/WeatherShareCard";
import WeatherSounds from "./components/WeatherSounds";
import UnitConverter from "./components/UnitConverter";
import WeatherFacts from "./components/WeatherFacts";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import { useWeather } from "./hooks/useWeather";

const WeatherApp = () => {
  const { weather, forecast, loading, unitLoading, error, setError, fetchByCity, fetchByCoords } = useWeather();
  const [hasGeolocated, setHasGeolocated] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favOpen, setFavOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("weather_favorites");
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      localStorage.removeItem("weather_favorites");
    }
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
    fetchByCoords(23.02, 72.57);
  }, []);

  const handleSearch = (city, lat, lon) => {
    if (lat != null && lon != null) {
      fetchByCoords(lat, lon);
    } else {
      fetchByCity(city);
    }
  };
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
    <>
    <div className="min-h-screen w-full relative">
      <WeatherBackground weatherMain={weather?.main} />

      {weather && <WeatherParticles weatherMain={weather.main} />}

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
            <ThemeSwitcher />
            {weather && <MultiCityDashboard currentWeather={weather} />}
            {weather && <WeatherMap weather={weather} />}
            {weather && <CityCompare currentWeather={weather} />}
            {weather && <ShareWeather weather={weather} />}
          </div>
        </header>

        <div className="max-w-2xl w-full mx-auto mb-10 animate-slide-up">
          <SearchBar onSearch={handleSearch} onLocation={handleLocation} loading={loading} />
        </div>

        {weather && !loading && <WeatherAlerts weather={weather} />}

        {unitLoading && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-4 py-2 flex items-center gap-2 animate-fade-in">
            <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white/60 text-xs">Updating units...</span>
          </div>
        )}

        {error && (
          <div className="max-w-2xl w-full mx-auto mb-6 animate-slide-down">
            <div className="glass rounded-2xl px-5 py-4 flex items-center justify-between border border-red-400/30">
              <p className="text-red-200 text-sm">{error}</p>
              <button onClick={() => setError("")} className="text-red-300/60 hover:text-red-200 text-lg font-bold transition-colors">×</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="max-w-5xl w-full mx-auto space-y-8">
            <SkeletonLoader type="card" />
            <SkeletonLoader type="forecast" />
            <SkeletonLoader type="details" />
          </div>
        )}

        {weather && !loading && (
          <main className="flex-1 flex flex-col gap-8 max-w-5xl w-full mx-auto">
            <HeroCard
              weather={weather}
              isFavorite={isFavorite}
              onToggleFavorite={isFavorite ? (e) => removeFavorite(weather.city, e) : addFavorite}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {weather && <WeatherNotifications weather={weather} />}
              {weather && <WeatherTimer weather={weather} />}
              {weather && <ARWeather weather={weather} />}
            </div>

            {forecast.hourly?.length > 0 && <HourlyForecast hourly={forecast.hourly} />}

            {forecast.daily?.length > 0 && <DailyForecast daily={forecast.daily} />}

            {forecast.hourly?.length > 0 && (
              <Suspense fallback={<div className="w-full glass rounded-2xl p-5 h-52 flex items-center justify-center"><span className="text-white/40 text-xs">Loading charts...</span></div>}>
                <WeatherCharts hourly={forecast.hourly} />
              </Suspense>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AirQualityCard lat={weather.lat} lon={weather.lon} />
              <UVIndexCard lat={weather.lat} lon={weather.lon} sunrise={weather.sunrise} sunset={weather.sunset} />
              <WindCompass speed={weather.windSpeed} deg={weather.windDeg} gust={weather.windGust} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SunPosition weather={weather} />
              <AQIForecast lat={weather.lat} lon={weather.lon} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HealthIndex weather={weather} />
              <SportsIndex weather={weather} />
              <AgricultureIndex weather={weather} />
              <PhotographyIndex weather={weather} />
              <EnergyCost weather={weather} />
              <CarbonFootprint weather={weather} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PollenCount weather={weather} />
              <FireIndex weather={weather} />
              <AllergyCalendar />
              <WeatherNews weather={weather} forecast={forecast} />
            </div>

            <EarthquakeAlerts lat={weather.lat} lon={weather.lon} />

            <TravelAdvisory weather={weather} />

            <WeatherDetails weather={weather} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MoonPhase />
              <SeasonalCalendar />
            </div>

            <WeatherHistory weather={weather} />

            <WeatherJournal weather={weather} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SleepQualityIndex weather={weather} />
              <PetWeather weather={weather} />
              <CommutePlanner weather={weather} />
              <GardenPlanner weather={weather} />
              <WorkoutScheduler weather={weather} />
              <MoodTracker weather={weather} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DewPoint weather={weather} />
              <WindChillHeatIndex weather={weather} />
              <VisibilityForecast weather={weather} />
              <LightningTracker weather={weather} />
              <HailRisk weather={weather} />
              <UVHourlyForecast weather={weather} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SurfWaveReport weather={weather} />
              <WeatherShareCard weather={weather} />
              <MonthlyHeatmap weather={weather} />
            </div>

            <WeatherStories weather={weather} />

            <WeatherSounds weather={weather} />

            <WeatherQuiz />

            <WeatherFacts />

            <UnitConverter />
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
          <Footer />
        </footer>
      </div>

    </div>

    <ScrollToTop />
    </>
  );
};

const App = () => (
  <UnitProvider>
    <WeatherApp />
  </UnitProvider>
);

export default App;
