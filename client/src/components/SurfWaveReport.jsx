import { useMemo } from "react";
import { FiNavigation } from "react-icons/fi";

const getSurfInfo = (windSpeed, windDeg, main, temp) => {
  const waveHeight = Math.min(windSpeed * 0.3 + 0.5, 5);
  const shoreDir = windDeg || 180;
  const onshore = Math.abs(shoreDir - 270) < 90;
  const surfable = windSpeed > 8 && main !== "Thunderstorm" && waveHeight > 0.5;
  const waterTemp = Math.max(10, Math.min(30, temp * 0.85 + 4));
  const windType = onshore ? "Onshore" : "Offshore";
  const condition = surfable ? (waveHeight > 2 ? "Great" : "Good") : "Poor";
  return {
    waveHeight: Math.round(waveHeight * 10) / 10,
    windType,
    surfable,
    waterTemp: Math.round(waterTemp),
    condition,
    bestTime: "Early morning or late evening",
  };
};

const getSurfScore = (windSpeed, main, waveHeight, surfable) => {
  let score = 50;
  if (surfable) {
    score += 20;
    if (waveHeight > 2) score += 15;
    else if (waveHeight > 1) score += 10;
  }
  if (main === "Thunderstorm") score -= 30;
  if (windSpeed > 25) score -= 15;
  if (windSpeed > 8 && windSpeed < 20) score += 5;
  return Math.max(0, Math.min(100, score));
};

const getSurfCategory = (score) => {
  if (score >= 80) return { label: "Excellent", color: "#00e400" };
  if (score >= 60) return { label: "Good", color: "#8BC34A" };
  if (score >= 40) return { label: "Fair", color: "#ffff00" };
  if (score >= 20) return { label: "Poor", color: "#ff7e00" };
  return { label: "Flat", color: "#ff0000" };
};

const waveBars = (height) => {
  const maxBars = 5;
  const filled = Math.min(maxBars, Math.ceil(height));
  return Array.from({ length: maxBars }, (_, i) => i < filled);
};

const SurfWaveReport = ({ weather }) => {
  const surf = useMemo(() => {
    if (!weather) return null;
    return getSurfInfo(weather.windSpeed, weather.windDeg, weather.main, weather.temp);
  }, [weather]);

  const score = useMemo(() => {
    if (!weather) return null;
    const waveHeight = Math.min(weather.windSpeed * 0.3 + 0.5, 5);
    const surfable = weather.windSpeed > 8 && weather.main !== "Thunderstorm" && waveHeight > 0.5;
    return getSurfScore(weather.windSpeed, weather.main, waveHeight, surfable);
  }, [weather]);

  if (!weather) return null;
  if (!surf) return null;

  const category = score !== null ? getSurfCategory(score) : null;
  const bars = waveBars(surf.waveHeight);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiNavigation className="text-white" /> Surf & Wave Report
        </h3>
        {category && (
          <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: category.color }}>
            {category.label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        {score !== null && (
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
              <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={category.color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-xl font-bold leading-none">{score}</span>
              <span className="text-white/30 text-[9px] mt-0.5">/100</span>
            </div>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-end gap-2 mb-2">
            {bars.map((filled, i) => (
              <div
                key={i}
                className="w-5 rounded transition-all duration-500"
                style={{
                  height: `${(i + 1) * 6 + 4}px`,
                  backgroundColor: filled ? "#38bdf8" : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
            <span className="text-white text-sm font-medium ml-1">{surf.waveHeight}m</span>
          </div>
          <p className="text-blue-300 text-[11px]">{surf.windType} winds</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.04]">
          <div className="w-8 h-8 rounded-lg bg-blue-400/15 flex items-center justify-center">
            <FiNavigation size={14} className="text-blue-300" />
          </div>
          <div>
            <p className="text-white text-xs font-medium">{surf.waterTemp}°</p>
            <p className="text-white/30 text-[10px]">Water Temp</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.04]">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${surf.surfable ? "bg-green-400/15" : "bg-red-400/15"}`}>
            <span className="text-xs">{surf.surfable ? "🏄" : "🚫"}</span>
          </div>
          <div>
            <p className="text-white text-xs font-medium">{surf.condition}</p>
            <p className="text-white/30 text-[10px]">Conditions</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-2.5 glass rounded-lg">
        <span className="text-white/40 text-[11px]">Best time</span>
        <span className="text-white text-[11px] font-medium">{surf.bestTime}</span>
      </div>
    </div>
  );
};

export default SurfWaveReport;
