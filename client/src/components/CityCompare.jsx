import { useState } from "react";
import { FiGitBranch, FiDroplet, FiWind } from "react-icons/fi";
import { getWeatherByCity, getAirQuality } from "../services/api";
import { useUnit } from "../context/UnitContext";
import WeatherIcon from "./WeatherIcon";

const CityCompare = ({ currentWeather }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [currentAqi, setCurrentAqi] = useState(null);
  const [compareAqi, setCompareAqi] = useState(null);
  const { units, tempUnit, speedUnit } = useUnit();

  if (!currentWeather) return null;

  const openCompare = async () => {
    setIsOpen(true);
    try {
      const res = await getAirQuality(currentWeather.lat, currentWeather.lon);
      if (res.success) setCurrentAqi(res.data);
    } catch {}
  };

  const handleCompare = async () => {
    if (!city.trim()) return;
    try {
      const weatherRes = await getWeatherByCity(city, units);
      if (weatherRes.success) {
        setData(weatherRes.data);
        try {
          const aqRes = await getAirQuality(weatherRes.data.lat, weatherRes.data.lon);
          if (aqRes.success) setCompareAqi(aqRes.data);
        } catch {}
      }
    } catch {
      setData(null);
      setCompareAqi(null);
    }
  };

  const close = () => { setIsOpen(false); setData(null); setCurrentAqi(null); setCompareAqi(null); setCity(""); };

  const WeatherBox = ({ title, w, aqi }) => (
    <div className="glass rounded-2xl p-5 text-center">
      <p className="text-white/50 text-xs mb-2">{title}</p>
      <WeatherIcon main={w.main} />
      <p className="text-white text-xl font-medium mt-2">{w.city}</p>
      <p className="text-white text-3xl font-light mt-2">{w.temp}{tempUnit}</p>
      <div className="mt-3 space-y-1 text-sm">
        <p className="text-white/50"><FiDroplet className="text-white" /> {w.humidity}%</p>
        <p className="text-white/50"><FiWind className="text-white" /> {w.windSpeed} {speedUnit}</p>
        <p className="text-white/50 capitalize">{w.description}</p>
        {aqi && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-xs font-medium px-2 py-0.5 rounded inline-block text-black" style={{ backgroundColor: aqi.color }}>
              AQI {aqi.aqi} · {aqi.level}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button onClick={openCompare} className="glass rounded-full px-4 py-2 text-white/50 hover:text-white text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2">
        <FiGitBranch className="text-white" /><span>Compare</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="glass-strong rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-medium">Compare Weather & AQI</h3>
              <button onClick={close} aria-label="Close city compare" className="text-white/40 hover:text-white text-2xl">×</button>
            </div>

            <div className="flex gap-3 mb-6">
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                placeholder="Enter city to compare..." className="flex-1 bg-white/10 text-white placeholder:text-white/30 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-white/20" />
              <button onClick={handleCompare} className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors font-medium">Compare</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <WeatherBox title="Current Location" w={currentWeather} aqi={currentAqi} />
              {data ? <WeatherBox title="Comparison" w={data} aqi={compareAqi} /> : (
                <div className="glass rounded-2xl p-5 flex items-center justify-center">
                  <p className="text-white/30 text-sm">Search a city to compare</p>
                </div>
              )}
            </div>

            {data && (
              <div className="mt-4 glass rounded-xl p-4 animate-fade-in">
                <h4 className="text-white/50 text-xs mb-2">Difference</h4>
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-white text-lg">{(currentWeather.temp - data.temp) > 0 ? "+" : ""}{currentWeather.temp - data.temp}{tempUnit}</p>
                    <p className="text-white/40 text-xs">Temperature</p>
                  </div>
                  <div>
                    <p className="text-white text-lg">{(currentWeather.humidity - data.humidity) > 0 ? "+" : ""}{currentWeather.humidity - data.humidity}%</p>
                    <p className="text-white/40 text-xs">Humidity</p>
                  </div>
                  <div>
                    <p className="text-white text-lg">{(currentWeather.windSpeed - data.windSpeed).toFixed(1)}</p>
                    <p className="text-white/40 text-xs">Wind Speed</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityCompare;
