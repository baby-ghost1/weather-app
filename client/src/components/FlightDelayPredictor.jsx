import { useMemo } from "react";
import { FiAirplay } from "react-icons/fi";
import { FaPlane } from "react-icons/fa";

const getFlightRisk = (windSpeed, visibility, clouds, pressure, main) => {
  let risk = 0;
  if (windSpeed > 25) risk += 25;
  else if (windSpeed > 15) risk += 10;
  if (visibility < 1000) risk += 25;
  else if (visibility < 3000) risk += 10;
  if (main === "Thunderstorm") risk += 40;
  else if (main === "Snow") risk += 25;
  else if (main === "Rain") risk += 10;
  if (clouds > 90) risk += 10;
  if (pressure < 1000) risk += 10;
  return Math.min(100, risk);
};

const getFlightCategory = (risk) => {
  if (risk <= 20) return { label: "Low", color: "#00e400", advice: "Flights likely on schedule." };
  if (risk <= 40) return { label: "Moderate", color: "#ffff00", advice: "Minor delays possible. Check status." };
  if (risk <= 60) return { label: "High", color: "#ff7e00", advice: "Delays likely. Stay updated." };
  return { label: "Very High", color: "#ff0000", advice: "Major disruptions expected. Reconsider travel." };
};

const getFlightReasons = (windSpeed, visibility, clouds, pressure, main) => {
  const reasons = [];
  if (windSpeed > 15) reasons.push({ text: `Strong winds (${windSpeed} km/h)`, color: "bg-cyan-400/10 text-cyan-300" });
  if (visibility < 3000) reasons.push({ text: `Low visibility (${(visibility / 1000).toFixed(1)} km)`, color: "bg-purple-400/10 text-purple-300" });
  if (main === "Thunderstorm") reasons.push({ text: "Thunderstorm activity", color: "bg-red-400/10 text-red-300" });
  else if (main === "Snow") reasons.push({ text: "Snowfall", color: "bg-blue-400/10 text-blue-300" });
  else if (main === "Rain") reasons.push({ text: "Rain", color: "bg-blue-400/10 text-blue-300" });
  if (clouds > 90) reasons.push({ text: "Heavy cloud cover", color: "bg-gray-400/10 text-gray-300" });
  if (pressure < 1000) reasons.push({ text: "Low pressure system", color: "bg-orange-400/10 text-orange-300" });
  return reasons;
};

const FlightDelayPredictor = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const risk = getFlightRisk(weather.windSpeed, weather.visibility, weather.clouds || 0, weather.pressure, weather.main);
    const reasons = getFlightReasons(weather.windSpeed, weather.visibility, weather.clouds || 0, weather.pressure, weather.main);
    return { risk, reasons };
  }, [weather]);

  if (!weather) return null;
  if (!data) return null;

  const { risk, reasons } = data;
  const cat = getFlightCategory(risk);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiAirplay className="text-white" /> Flight Delay Risk
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: cat.color }}>{cat.label}</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={cat.color} strokeWidth="2.5" strokeDasharray={`${risk}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-xl font-bold leading-none">{risk}%</span>
            <span className="text-white/30 text-[9px] mt-0.5">risk</span>
          </div>
        </div>
        <div>
          <FaPlane className="text-white/20 text-2xl mb-1" />
          <p className="text-white/40 text-[11px] leading-relaxed">{cat.advice}</p>
        </div>
      </div>

      {reasons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {reasons.map((r, i) => (
            <span key={i} className={`text-[10px] px-2 py-1 rounded-full ${r.color}`}>
              {r.text}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {weather.windSpeed !== undefined && (
          <div className="bg-white/[0.04] rounded-lg p-2 text-center">
            <p className="text-white text-xs font-medium">{weather.windSpeed}</p>
            <p className="text-white/30 text-[10px]">Wind km/h</p>
          </div>
        )}
        {weather.visibility !== undefined && (
          <div className="bg-white/[0.04] rounded-lg p-2 text-center">
            <p className="text-white text-xs font-medium">{(weather.visibility / 1000).toFixed(1)}</p>
            <p className="text-white/30 text-[10px]">Vis km</p>
          </div>
        )}
        {weather.pressure !== undefined && (
          <div className="bg-white/[0.04] rounded-lg p-2 text-center">
            <p className="text-white text-xs font-medium">{weather.pressure}</p>
            <p className="text-white/30 text-[10px]">hPa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightDelayPredictor;
