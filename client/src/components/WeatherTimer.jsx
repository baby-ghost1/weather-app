import { useState, useEffect, useRef } from "react";
import { FiClock, FiBell, FiX, FiCheck } from "react-icons/fi";
import { WiRain, WiThunderstorm } from "react-icons/wi";
import { TbFlame, TbSnowflake } from "react-icons/tb";

const presetTimers = [
  { label: "Rain Alert", condition: "Rain", icon: <WiRain size={24} className="text-white" />, desc: "Alert when rain starts" },
  { label: "Storm Warning", condition: "Thunderstorm", icon: <WiThunderstorm size={24} className="text-white" />, desc: "Alert for thunderstorms" },
  { label: "Heat Alert", condition: "hot", icon: <TbFlame size={22} className="text-white" />, desc: "Alert above 38°C" },
  { label: "Cold Alert", condition: "cold", icon: <TbSnowflake size={22} className="text-white" />, desc: "Alert below 5°C" },
];

const WeatherTimer = ({ weather }) => {
  const [activeTimers, setActiveTimers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
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
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-full px-4 py-2 text-white/50 hover:text-white text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        <FiClock className="text-white" /><span>Weather Timer</span>
        {activeTimers.length > 0 && (
          <span className="bg-green-400/20 text-green-400 text-[11px] px-1.5 py-0.5 rounded-full">{activeTimers.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-strong rounded-3xl p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-medium">Weather Timers</h3>
              <button onClick={() => setIsOpen(false)} aria-label="Close timer" className="text-white/40 hover:text-white text-2xl">×</button>
            </div>

            <p className="text-white/30 text-xs mb-4">Set alerts for specific weather conditions. You'll be notified when triggered.</p>

            <div className="space-y-2">
              {presetTimers.map((preset) => {
                const isActive = activeTimers.find((t) => t.condition === preset.condition);
                return (
                  <button
                    key={preset.condition}
                    onClick={() => toggleTimer(preset)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive ? "bg-green-400/10 border border-green-400/30" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xl">{preset.icon}</span>
                    <div className="text-left flex-1">
                      <p className="text-white text-sm">{preset.label}</p>
                      <p className="text-white/30 text-[11px]">{preset.desc}</p>
                    </div>
                    {isActive ? (
                      <FiCheck className="text-green-400" />
                    ) : (
                      <FiBell className="text-white/20" />
                    )}
                  </button>
                );
              })}
            </div>

            {activeTimers.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-white/30 text-[11px]">{activeTimers.length} active timer(s) • Checking every minute</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherTimer;
