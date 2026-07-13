import { useMemo } from "react";
import { FiSun } from "react-icons/fi";
import { formatTime } from "../utils/format";

const SunPosition = ({ weather }) => {
  const sunData = useMemo(() => {
    if (!weather?.sunrise || !weather?.sunset) return null;
    const now = Date.now() / 1000;
    const sunrise = weather.sunrise;
    const sunset = weather.sunset;
    const isDaytime = now >= sunrise && now <= sunset;
    const daylight = sunset - sunrise;
    const elapsed = now - sunrise;
    const progress = daylight > 0 ? Math.max(0, Math.min(1, elapsed / daylight)) : 0;
    const solarNoon = (sunrise + sunset) / 2;
    const hoursUntilNoon = (solarNoon - now) / 3600;
    return { isDaytime, progress, solarNoon, hoursUntilNoon };
  }, [weather]);

  if (!sunData) return null;

  const formatHours = (h) => {
    const abs = Math.abs(h);
    const hrs = Math.floor(abs);
    const mins = Math.round((abs - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiSun className="text-white" /> Sun Position
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sunData.isDaytime ? "bg-yellow-400/20 text-yellow-300" : "bg-blue-400/20 text-blue-300"}`}>
          {sunData.isDaytime ? <><FiSun className="text-white" /> Daytime</> : "🌙 Nighttime"}
        </span>
      </div>

      <div className="relative w-full h-32 mb-4">
        <svg viewBox="0 0 300 120" className="w-full h-full">
          <path d="M 20 100 Q 150 -20 280 100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />

          <line x1="20" y1="100" x2="280" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {sunData.isDaytime && (
            <circle
              cx={20 + sunData.progress * 260}
              cy={100 - Math.sin(sunData.progress * Math.PI) * 90}
              r="12"
              fill="#fbbf24"
              className="transition-all duration-1000"
            >
              <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
          )}

          {!sunData.isDaytime && (
            <circle
              cx={sunData.progress < 0.5 ? 20 + sunData.progress * 260 : 20 + sunData.progress * 260}
              cy="110"
              r="10"
              fill="#94a3b8"
              opacity="0.5"
            />
          )}

          <text x="20" y="115" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">↑</text>
          <text x="280" y="115" fill="rgba(255,255,255,0.3)" fontSize="8" textAnchor="middle">↓</text>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass rounded-lg p-2">
          <p className="text-yellow-300 text-[11px]">Sunrise</p>
          <p className="text-white text-xs font-medium">{formatTime(weather.sunrise)}</p>
        </div>
        <div className="glass rounded-lg p-2">
          <p className="text-white/40 text-[11px]">Solar Noon</p>
          <p className="text-white text-xs font-medium">{formatTime((weather.sunrise + weather.sunset) / 2)}</p>
        </div>
        <div className="glass rounded-lg p-2">
          <p className="text-orange-400 text-[11px]">Sunset</p>
          <p className="text-white text-xs font-medium">{formatTime(weather.sunset)}</p>
        </div>
      </div>

      {sunData.isDaytime && (
        <p className="text-white/30 text-[11px] text-center mt-2">
          {sunData.hoursUntilNoon > 0
            ? `${formatHours(sunData.hoursUntilNoon)} until solar noon`
            : `Solar noon passed ${formatHours(-sunData.hoursUntilNoon)} ago`}
        </p>
      )}
    </div>
  );
};

export default SunPosition;
