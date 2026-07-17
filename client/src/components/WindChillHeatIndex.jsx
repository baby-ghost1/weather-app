import { useMemo } from "react";
import { FiThermometer } from "react-icons/fi";

const calcWindChill = (temp, windSpeed) => {
  if (temp > 10 || windSpeed < 4.8) return null;
  const v = windSpeed * 3.6;
  return Math.round(13.12 + 0.6215 * temp - 11.37 * Math.pow(v, 0.16) + 0.3965 * temp * Math.pow(v, 0.16));
};

const calcHeatIndex = (temp, humidity) => {
  if (temp < 27 || humidity < 40) return null;
  const hi = -8.784695 + 1.61139411 * temp + 2.338549 * humidity
    - 0.14611605 * temp * humidity - 0.00650035 * temp * temp
    - 0.05046068 * humidity * humidity + 0.00122874 * temp * temp * humidity
    + 0.00085282 * temp * humidity * humidity - 0.00000199 * temp * temp * humidity * humidity;
  return Math.round(hi);
};

const WindChillHeatIndex = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;

    const windChill = calcWindChill(weather.temp, weather.windSpeed);
    const heatIndex = calcHeatIndex(weather.temp, weather.humidity);

    if (!windChill && !heatIndex) return null;

    const wcCategory = windChill ? (windChill < -10 ? "Dangerous" : windChill < 0 ? "Cold" : "Cool") : null;
    const hiCategory = heatIndex ? (heatIndex > 45 ? "Dangerous" : heatIndex > 40 ? "Extreme" : heatIndex > 35 ? "Very Hot" : "Hot") : null;

    const wcColor = windChill ? (windChill < -10 ? "#ef4444" : windChill < 0 ? "#3b82f6" : "#60a5fa") : null;
    const hiColor = heatIndex ? (heatIndex > 45 ? "#ef4444" : heatIndex > 40 ? "#f97316" : heatIndex > 35 ? "#f59e0b" : "#fbbf24") : null;

    const activeTemp = windChill ?? heatIndex;
    const score = Math.max(0, Math.min(100, Math.round(100 - Math.abs(activeTemp - 22) * 3)));
    const color = windChill ? "#60a5fa" : "#f97316";
    const tip = windChill
      ? "Wind makes it feel colder than actual temperature"
      : "Humidity makes it feel hotter than actual temperature";

    return { windChill, heatIndex, wcCategory, hiCategory, wcColor, hiColor, score, color, tip };
  }, [weather]);

  if (!weather) return null;
  if (!data) return null;

  const { windChill, heatIndex, wcCategory, hiCategory, wcColor, hiColor, score, color, tip } = data;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiThermometer className="text-white" /> Feels Like
        </h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: `${color}15`, color }}>
          Comfort: {score}
        </span>
      </div>

      {/* ring + tip */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FiThermometer className="text-xs mb-0.5" style={{ color }} />
            <span className="text-white text-xl font-bold leading-none">{weather.temp}°</span>
            <span className="text-white/30 text-[8px]">actual</span>
          </div>
        </div>
        <p className="text-white/40 text-[11px] leading-relaxed">{tip}</p>
      </div>

      {/* grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {windChill && (
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-white/40 text-[11px] mb-1">Wind Chill</p>
            <p className="text-white text-xl font-medium">{windChill}°</p>
            <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${wcColor}15`, color: wcColor }}>{wcCategory}</span>
          </div>
        )}
        {heatIndex && (
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-white/40 text-[11px] mb-1">Heat Index</p>
            <p className="text-white text-xl font-medium">{heatIndex}°</p>
            <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${hiColor}15`, color: hiColor }}>{hiCategory}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WindChillHeatIndex;
