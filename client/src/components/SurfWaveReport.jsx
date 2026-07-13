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

const SurfWaveReport = ({ weather }) => {
  const surf = useMemo(() => {
    if (!weather) return null;
    return getSurfInfo(weather.windSpeed, weather.windDeg, weather.main, weather.temp);
  }, [weather]);

  if (!weather) return null;
  if (!surf) return null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiNavigation className="text-white" /> Surf & Wave Report
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-white/40 text-[11px] mb-1">Wave Height</p>
          <p className="text-white text-xl font-medium">{surf.waveHeight}m</p>
          <p className="text-blue-300 text-[11px]">{surf.windType} winds</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-white/40 text-[11px] mb-1">Water Temp</p>
          <p className="text-white text-xl font-medium">{surf.waterTemp}°</p>
          <p className="text-cyan-300 text-[11px]">Estimated</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 mb-2">
        <span className={`text-[11px] px-1.5 py-0.5 rounded ${surf.surfable ? "bg-green-400/20 text-green-300" : "bg-red-400/20 text-red-300"}`}>
          {surf.condition}
        </span>
        <span className="text-white/40 text-[11px]">
          {surf.surfable ? "Good conditions for surfing" : "Not ideal — check back later"}
        </span>
      </div>

      <p className="text-white/30 text-[11px]">Best time: {surf.bestTime}</p>
    </div>
  );
};

export default SurfWaveReport;
