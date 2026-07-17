import { useState, useEffect } from "react";
import { FiBook, FiPlus, FiTrash2, FiSun, FiCloud } from "react-icons/fi";
import { WiDaySunny, WiRain, WiDayRain, WiFog, WiThunderstorm } from "react-icons/wi";
import { TbSnowflake } from "react-icons/tb";

const moodIconMap = {
  Clear: <WiDaySunny size={20} className="text-white" />,
  Clouds: <FiCloud size={16} className="text-white" />,
  Rain: <WiRain size={20} className="text-white" />,
  Snow: <TbSnowflake size={18} className="text-white" />,
  Thunderstorm: <WiThunderstorm size={20} className="text-white" />,
  Drizzle: <WiDayRain size={20} className="text-white" />,
  Haze: <WiFog size={20} className="text-white" />,
  Mist: <WiFog size={20} className="text-white" />,
};

const getMoodIcon = (main) => moodIconMap[main] || <FiSun size={16} className="text-white" />;

const WeatherJournal = ({ weather }) => {
  const [entries, setEntries] = useState([]);
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("weather_journal");
    if (stored) {
      try { setEntries(JSON.parse(stored)); } catch {}
    }
  }, []);

  const saveEntries = (newEntries) => {
    setEntries(newEntries);
    localStorage.setItem("weather_journal", JSON.stringify(newEntries));
  };

  const addEntry = () => {
    if (!note.trim() || !weather) return;
    const entry = {
      id: Date.now(),
      city: weather.city,
      temp: weather.temp,
      main: weather.main,
      description: weather.description,
      note: note.trim(),
      date: new Date().toISOString(),
    };
    saveEntries([entry, ...entries].slice(0, 30));
    setNote("");
  };

  const deleteEntry = (id) => {
    saveEntries(entries.filter((e) => e.id !== id));
  };

  return (
    <div className="animate-slide-up">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-full px-4 py-2 text-white/50 hover:text-white text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        <FiBook className="text-white" /><span>Weather Journal ({entries.length})</span>
      </button>

      {isOpen && (
        <div className="mt-3 glass rounded-2xl p-5 animate-slide-down">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEntry()}
              placeholder="How's the weather today?"
              className="flex-1 bg-white/10 text-white placeholder:text-white/30 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-white/20"
            />
            <button onClick={addEntry} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl transition-colors">
              <FiPlus className="text-white" />
            </button>
          </div>

          {entries.length === 0 ? (
            <p className="text-white/30 text-xs text-center py-4">No journal entries yet. Start writing!</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {entries.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl group">
                  <span className="text-lg mt-0.5">{getMoodIcon(entry.main)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/80 text-xs font-medium">{entry.city}</span>
                      <span className="text-white/30 text-[11px]">{entry.temp}°</span>
                      <span className="text-white/20 text-[11px]">
                        {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">{entry.note}</p>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all mt-1"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherJournal;
