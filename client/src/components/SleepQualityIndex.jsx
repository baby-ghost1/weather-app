import { useMemo } from "react";
import { FiMoon, FiSmile, FiMeh, FiFrown } from "react-icons/fi";
import { TbBed } from "react-icons/tb";

const getSleepCategory = (score) => {
  if (score >= 80) return { label: "Excellent", color: "#00e400", icon: <TbBed size={28} className="text-white" />, tip: "Perfect sleeping conditions. Keep windows slightly open." };
  if (score >= 60) return { label: "Good", color: "#8BC34A", icon: <FiSmile size={28} className="text-white" />, tip: "Good sleep expected. Use light bedding." };
  if (score >= 40) return { label: "Fair", color: "#ffff00", icon: <FiMeh size={28} className="text-white" />, tip: "Use fan/AC for optimal temperature." };
  return { label: "Poor", color: "#ff7e00", icon: <FiFrown size={28} className="text-white" />, tip: "Difficult sleeping conditions. Use AC and earplugs." };
};

const getSleepScore = (temp, humidity, windSpeed, main, hour) => {
  let score = 70;
  if (temp >= 15 && temp <= 30) score += 10;
  else if (temp >= 18 && temp <= 26) score += 5;
  if (temp < 15 || temp > 30) score -= 10;
  if (humidity >= 30 && humidity <= 70) score += 5;
  else if (humidity >= 40 && humidity <= 60) score += 3;
  if (humidity < 30 || humidity > 70) score -= 5;
  if (windSpeed > 15) score -= 8;
  if (main === "Rain" || main === "Drizzle") score += 10;
  if (main === "Thunderstorm") score -= 25;
  if (hour >= 21 || hour <= 5) score += 5;
  return Math.max(0, Math.min(100, score));
};

const SleepQualityIndex = ({ weather }) => {
  const score = useMemo(() => {
    if (!weather) return null;
    const currentHour = new Date().getHours();
    return getSleepScore(weather.temp, weather.humidity, weather.windSpeed, weather.main, currentHour);
  }, [weather]);

  if (!weather) return null;
  if (score === null) return null;

  const cat = getSleepCategory(score);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiMoon className="text-white" /> Sleep Quality
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: cat.color }}>{cat.label}</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{cat.icon}</span>
        <div>
          <p className="text-white text-lg font-medium">{score}/100</p>
          <p className="text-white/40 text-xs">{cat.tip}</p>
        </div>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: cat.color }} />
      </div>
    </div>
  );
};

export default SleepQualityIndex;
