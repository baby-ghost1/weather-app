import { useMemo } from "react";
import { FiCamera, FiSunrise, FiSunset, FiSun, FiMoon, FiStar } from "react-icons/fi";
import { formatTime } from "../utils/format";

const getLightCondition = (sunrise, sunset) => {
  const now = Date.now() / 1000;
  const daylight = sunset - sunrise;
  const elapsed = now - sunrise;
  const progress = daylight > 0 ? elapsed / daylight : 0;
  const goldenDuration = 0.1;

  if (progress < 0 || progress > 1) return { label: "Night", color: "#64748b", icon: "🌙" };
  if (progress < goldenDuration) return { label: "Golden Hour", color: "#fbbf24", icon: "🌅" };
  if (progress < goldenDuration + 0.05) return { label: "Blue Hour", color: "#60a5fa", icon: "🌌" };
  if (progress > 0.9 - goldenDuration) return { label: "Golden Hour", color: "#fbbf24", icon: "🌇" };
  if (progress > 0.95) return { label: "Blue Hour", color: "#60a5fa", icon: "🌌" };
  if (progress > 0.4 && progress < 0.6) return { label: "Harsh Light", color: "#ef4444", icon: "☀️" };
  return { label: "Soft Light", color: "#fcd34d", icon: "🌤️" };
};

const getPhotographyAdvice = (clouds, main) => {
  if (clouds > 70) return { rating: 85, tip: "Overcast — great for soft, diffused light and portraits." };
  if (clouds > 40) return { rating: 90, tip: "Partial clouds — dramatic skies possible." };
  return { rating: 70, tip: "Clear sky — harsh light, use ND filters. Best at golden hour." };
};

const PhotographyIndex = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather?.sunrise || !weather?.sunset) return null;
    const now = Date.now() / 1000;
    const sunrise = weather.sunrise;
    const sunset = weather.sunset;
    const daylight = sunset - sunrise;
    const goldenHourDuration = daylight * 0.1;
    const blueHourDuration = daylight * 0.05;

    const goldenHourMorning = sunrise + blueHourDuration;
    const blueHourMorning = sunrise;
    const solarNoon = (sunrise + sunset) / 2;
    const goldenHourEvening = sunset - goldenHourDuration;
    const blueHourEvening = sunset - blueHourDuration;

    const times = {
      goldenHourMorning: goldenHourMorning * 1000,
      blueHourMorning: blueHourMorning * 1000,
      solarNoon: solarNoon * 1000,
      goldenHourEvening: goldenHourEvening * 1000,
      blueHourEvening: blueHourEvening * 1000,
    };

    const light = getLightCondition(sunrise, sunset);
    const advice = getPhotographyAdvice(weather.clouds || 0, weather.main);
    const dayProgress = daylight > 0 ? Math.max(0, Math.min(1, (now - sunrise) / daylight)) : 0;

    const upcoming = Object.entries(times)
      .filter(([, t]) => t > now * 1000)
      .sort(([, a], [, b]) => a - b);
    const bestShot = upcoming.length > 0 ? upcoming[0] : null;

    return { times, light, advice: advice.tip, rating: advice.rating, dayProgress, bestShot };
  }, [weather]);

  if (!weather?.sunrise || !weather?.sunset) return null;
  if (!data) return null;

  const nowMs = Date.now();

  const getTimeStatus = (time) => {
    const diff = time - nowMs;
    if (diff > 0 && diff < 60 * 60 * 1000) return { label: "Starting Soon", color: "#ff9800" };
    if (diff > 0) return { label: `In ${Math.round(diff / 60000)} min`, color: "#4caf50" };
    return { label: "Passed", color: "#666" };
  };

  const { times, light, advice, rating, dayProgress, bestShot } = data;

  const shots = [
    { name: "Golden Hour (AM)", time: times.goldenHourMorning, icon: FiSunrise, color: "#fbbf24" },
    { name: "Blue Hour (AM)", time: times.blueHourMorning, icon: FiSunset, color: "#60a5fa" },
    { name: "Solar Noon", time: times.solarNoon, icon: FiSun, color: "#ef4444" },
    { name: "Golden Hour (PM)", time: times.goldenHourEvening, icon: FiSunset, color: "#fbbf24" },
    { name: "Blue Hour (PM)", time: times.blueHourEvening, icon: FiMoon, color: "#60a5fa" },
  ];

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiCamera className="text-white" /> Photography
        </h3>
        <span className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ backgroundColor: `${light.color}20`, color: light.color }}>
          {light.icon} {light.label}
        </span>
      </div>

      {/* rating + best shot */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray={`${rating}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FiStar className="text-yellow-400 text-xs mb-0.5" />
            <span className="text-white text-lg font-bold leading-none">{rating}</span>
          </div>
        </div>
        <div>
          <p className="text-white/60 text-xs font-medium mb-1">Best shot now</p>
          {bestShot ? (
            <p className="text-white text-sm font-medium">{bestShot[0].replace(/([A-Z])/g, " $1").trim()}</p>
          ) : (
            <p className="text-white/40 text-xs">All windows passed</p>
          )}
        </div>
      </div>

      {/* day progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[10px] text-white/25 mb-1">
          <span>Sunrise</span>
          <span>Sunset</span>
        </div>
        <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="absolute h-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-orange-500 transition-all duration-1000" style={{ width: `${dayProgress * 100}%` }} />
          <div className="absolute w-2.5 h-2.5 bg-white rounded-full shadow -mt-[3px] transition-all duration-1000" style={{ left: `calc(${dayProgress * 100}% - 5px)` }} />
        </div>
      </div>

      {/* shots list */}
      <div className="space-y-1.5 mb-3">
        {shots.map((shot) => {
          const status = getTimeStatus(shot.time);
          const isNear = (shot.time - nowMs) > 0 && (shot.time - nowMs) < 60 * 60 * 1000;
          const Icon = shot.icon;
          return (
            <div key={shot.name} className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${isNear ? "bg-white/[0.08]" : ""}`}>
              <Icon size={16} style={{ color: shot.color }} />
              <div className="flex-1">
                <p className="text-white/60 text-[11px]">{shot.name}</p>
                <p className="text-white text-xs font-medium">{formatTime(shot.time)}</p>
              </div>
              <span className="text-[10px] font-medium" style={{ color: status.color }}>{status.label}</span>
            </div>
          );
        })}
      </div>

      {/* tip */}
      <div className="p-2.5 glass rounded-lg">
        <p className="text-white/40 text-[11px] text-center">{advice}</p>
      </div>
    </div>
  );
};

export default PhotographyIndex;
