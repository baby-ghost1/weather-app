import { useState, useEffect, useRef } from "react";
import { FiClock, FiCheck, FiBell } from "react-icons/fi";
import { WiRain, WiThunderstorm } from "react-icons/wi";
import { TbFlame, TbSnowflake } from "react-icons/tb";

const presetTimers = [
  { label: "Rain", condition: "Rain", icon: <WiRain size={18} className="text-blue-300" />, desc: "When rain starts" },
  { label: "Storm", condition: "Thunderstorm", icon: <WiThunderstorm size={18} className="text-yellow-300" />, desc: "Thunderstorm alert" },
  { label: "Heat", condition: "hot", icon: <TbFlame size={16} className="text-orange-300" />, desc: "Above 38°C" },
  { label: "Cold", condition: "cold", icon: <TbSnowflake size={16} className="text-cyan-300" />, desc: "Below 5°C" },
];

const WeatherTimer = ({ weather }) => {
  const [activeTimers, setActiveTimers] = useState([]);
  const timersRef = useRef([]);

  useEffect(() => {
    timersRef.current = activeTimers;
  }, [activeTimers]);

  useEffect(() => {
    if (!weather) return;
    const check = () => {
      const currentTimers = timersRef.current;
      if (currentTimers.length === 0) return;
      currentTimers.forEach((timer) => {
        let triggered = false;
        if (timer.condition === "Rain" && weather.main === "Rain") triggered = true;
        if (timer.condition === "Thunderstorm" && weather.main === "Thunderstorm") triggered = true;
        if (timer.condition === "hot" && weather.temp >= 38) triggered = true;
        if (timer.condition === "cold" && weather.temp <= 5) triggered = true;
        if (triggered && !timer.fired) {
          timer.fired = true;
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("WeatherFlow Timer", { body: `${timer.label}: ${weather.city} - ${weather.temp}°C, ${weather.description}` });
          }
        }
      });
    };
    const interval = setInterval(check, 60000);
    check();
    return () => clearInterval(interval);
  }, [weather]);

  const toggleTimer = (preset) => {
    const exists = activeTimers.find((t) => t.condition === preset.condition);
    if (exists) {
      setActiveTimers(activeTimers.filter((t) => t.condition !== preset.condition));
    } else {
      setActiveTimers([...activeTimers, { ...preset, fired: false }]);
    }
  };

  return (
    <div className="glass rounded-2xl p-4 hover-lift animate-scale-in min-w-[220px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiClock className="text-white" /> Weather Timer
        </h3>
        {activeTimers.length > 0 && (
          <span className="bg-green-400/20 text-green-400 text-[11px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            {activeTimers.length}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {presetTimers.map((preset) => {
          const isActive = activeTimers.find((t) => t.condition === preset.condition);
          return (
            <button
              key={preset.condition}
              onClick={() => toggleTimer(preset)}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all text-left ${
                isActive
                  ? "bg-green-400/10 border border-green-400/30"
                  : "bg-white/5 hover:bg-white/8 border border-transparent"
              }`}
            >
              <span className="shrink-0">{preset.icon}</span>
              <div className="min-w-0">
                <p className={`text-[11px] font-medium ${isActive ? "text-green-300" : "text-white/60"}`}>{preset.label}</p>
                <p className="text-white/25 text-[10px] truncate">{preset.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {activeTimers.length > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5 text-white/25 text-[10px]">
          <FiBell className="text-[10px]" />
          Checking every minute
        </div>
      )}
    </div>
  );
};

export default WeatherTimer;
