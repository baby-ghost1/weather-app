import { useState, useEffect } from "react";
import { FiGrid, FiX, FiPlus } from "react-icons/fi";
import { getWeatherByCity } from "../services/api";
import { useUnit } from "../context/UnitContext";
import WeatherIcon from "./WeatherIcon";

const MAX_CITIES = 6;

const MultiCityDashboard = ({ currentWeather }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { tempUnit } = useUnit();

  useEffect(() => {
    const stored = localStorage.getItem("multicity_cities");
    if (stored) {
      try { setCities(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("multicity_cities", JSON.stringify(cities));
  }, [cities]);

  const addCity = async () => {
    const name = input.trim();
    if (!name) return;
    if (cities.length >= MAX_CITIES) {
      setError(`Maximum ${MAX_CITIES} cities allowed`);
      setInput("");
      return;
    }
    if (cities.find((c) => c.city.toLowerCase() === name.toLowerCase())) {
      setError("City already added");
      setInput("");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await getWeatherByCity(name);
      if (res.success) {
        setCities((prev) => [...prev, res.data]);
        setInput("");
      } else {
        setError("City not found. Try another name.");
      }
    } catch {
      setError("Failed to fetch weather. Try again.");
    }
    setLoading(false);
  };

  const removeCity = (city) => {
    setCities((prev) => prev.filter((c) => c.city !== city));
  };

  if (!currentWeather) return null;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-full px-4 py-2 text-white/50 hover:text-white text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        <FiGrid className="text-white" /><span>Multi-City</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-3xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-medium">Multi-City Dashboard</h3>
              <button onClick={() => setIsOpen(false)} aria-label="Close multi-city dashboard" className="text-white/40 hover:text-white text-2xl">×</button>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && addCity()}
                placeholder={cities.length >= MAX_CITIES ? "Max cities reached" : "Add a city..."}
                disabled={loading || cities.length >= MAX_CITIES}
                className="flex-1 bg-white/10 text-white placeholder:text-white/30 px-4 py-2.5 rounded-xl text-sm outline-none disabled:opacity-50"
              />
              <button onClick={addCity} disabled={loading || cities.length >= MAX_CITIES} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiPlus className="text-white" />
                )}
              </button>
            </div>

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto">
              <div className="glass rounded-xl p-4 text-center relative">
                <span className="text-[11px] text-white/30 absolute top-2 left-3">CURRENT</span>
                <WeatherIcon main={currentWeather.main} size="text-3xl" />
                <p className="text-white text-sm font-medium mt-1">{currentWeather.city}</p>
                <p className="text-white text-xl font-light">{currentWeather.temp}{tempUnit}</p>
                <p className="text-white/40 text-[11px] capitalize">{currentWeather.description}</p>
              </div>

              {cities.map((c) => (
                <div key={c.city} className="glass rounded-xl p-4 text-center relative group">
                  <button onClick={() => removeCity(c.city)} aria-label={`Remove ${c.city}`} className="absolute top-2 right-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <FiX className="text-xs" />
                  </button>
                  <WeatherIcon main={c.main} size="text-3xl" />
                  <p className="text-white text-sm font-medium mt-1">{c.city}</p>
                  <p className="text-white text-xl font-light">{c.temp}{tempUnit}</p>
                  <p className="text-white/40 text-[11px] capitalize">{c.description}</p>
                </div>
              ))}
            </div>

            <p className="text-white/20 text-[11px] text-center mt-3">{cities.length}/{MAX_CITIES} cities added</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiCityDashboard;
