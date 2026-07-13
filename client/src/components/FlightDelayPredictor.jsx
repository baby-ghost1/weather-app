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
  if (windSpeed > 15) reasons.push(`Strong winds (${windSpeed} km/h)`);
  if (visibility < 3000) reasons.push(`Low visibility (${(visibility / 1000).toFixed(1)} km)`);
  if (main === "Thunderstorm") reasons.push("Thunderstorm activity");
  else if (main === "Snow") reasons.push("Snowfall");
  else if (main === "Rain") reasons.push("Rain");
  if (clouds > 90) reasons.push("Heavy cloud cover");
  if (pressure < 1000) reasons.push("Low pressure system");
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiAirplay className="text-white" /> Flight Delay Risk
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: cat.color }}>{cat.label}</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl"><FaPlane className="text-white" /></span>
        <div>
          <p className="text-white text-lg font-medium">{risk}% risk</p>
          <p className="text-white/40 text-xs">{cat.advice}</p>
        </div>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${risk}%`, backgroundColor: cat.color }} />
      </div>

      {reasons.length > 0 && (
        <div className="space-y-1">
          <p className="text-white/30 text-[11px] uppercase">Risk factors:</p>
          {reasons.map((r, i) => (
            <p key={i} className="text-white/50 text-[11px]">• {r}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightDelayPredictor;
