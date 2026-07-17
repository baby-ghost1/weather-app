import { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { useUnit } from "../context/UnitContext";

const getDayName = (date) => {
  const today = new Date();
  const d = new Date(date);
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const WeatherHistory = ({ weather }) => {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { tempUnit } = useUnit();

  useEffect(() => {
    const stored = localStorage.getItem("weather_search_history");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed.slice(0, 7));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!weather) return;
    const stored = localStorage.getItem("weather_search_history");
    let parsed = [];
    try { parsed = stored ? JSON.parse(stored) : []; } catch { parsed = []; }

    const today = new Date().toDateString();
    const existing = parsed.findIndex(
      (h) => h.city === weather.city && new Date(h.date).toDateString() === today
    );

    const entry = {
      city: weather.city,
      country: weather.country,
      temp: weather.temp,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      description: weather.description,
      main: weather.main,
      date: new Date().toISOString(),
    };

    if (existing >= 0) {
      parsed[existing] = entry;
    } else {
      parsed.unshift(entry);
    }

    parsed = parsed.slice(0, 7);
    localStorage.setItem("weather_search_history", JSON.stringify(parsed));
    setHistory(parsed);
  }, [weather]);

  if (history.length === 0) return null;

  return (
    <div className="animate-slide-up">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-full px-4 py-2 text-white/50 hover:text-white text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        <FiClock className="text-white" /><span>Recent Searches</span>
      </button>

      {isOpen && (
        <div className="mt-3 glass rounded-2xl p-4 animate-slide-down">
          <h4 className="text-white/50 text-xs font-medium mb-3 uppercase tracking-wider">Recent Weather Lookups</h4>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={h.city + h.date} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div>
                  <p className="text-white text-sm">{h.city}, {h.country}</p>
                  <p className="text-white/30 text-[11px]">{getDayName(h.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">{h.temp}{tempUnit}</p>
                  <p className="text-white/30 text-[11px] capitalize">{h.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherHistory;
