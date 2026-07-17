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

const getFactors = (temp, humidity, windSpeed, main, hour) => {
  const factors = [];

  if (temp >= 18 && temp <= 26) factors.push({ label: "Ideal Temp", value: "+10", color: "#4ade80" });
  else if (temp >= 15 && temp <= 30) factors.push({ label: "Good Temp", value: "+5", color: "#86efac" });
  else if (temp < 15 || temp > 30) factors.push({ label: "Bad Temp", value: "-10", color: "#ef4444" });
  else factors.push({ label: "Temp", value: "0", color: "#94a3b8" });

  if (humidity >= 40 && humidity <= 60) factors.push({ label: "Ideal Humidity", value: "+3", color: "#4ade80" });
  else if (humidity >= 30 && humidity <= 70) factors.push({ label: "Good Humidity", value: "+5", color: "#86efac" });
  else if (humidity < 30 || humidity > 70) factors.push({ label: "Bad Humidity", value: "-5", color: "#ef4444" });
  else factors.push({ label: "Humidity", value: "0", color: "#94a3b8" });

  if (windSpeed > 15) factors.push({ label: "Strong Wind", value: "-8", color: "#ef4444" });
  else factors.push({ label: "Wind", value: "OK", color: "#4ade80" });

  if (main === "Thunderstorm") factors.push({ label: "Storm", value: "-25", color: "#ef4444" });
  else if (main === "Rain" || main === "Drizzle") factors.push({ label: "Rain", value: "+10", color: "#60a5fa" });
  else factors.push({ label: "Sky", value: "OK", color: "#4ade80" });

  if (hour >= 21 || hour <= 5) factors.push({ label: "Night", value: "+5", color: "#818cf8" });
  else factors.push({ label: "Day", value: "0", color: "#94a3b8" });

  return factors;
};

const SleepQualityIndex = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const currentHour = new Date().getHours();
    const score = getSleepScore(weather.temp, weather.humidity, weather.windSpeed, weather.main, currentHour);
    const factors = getFactors(weather.temp, weather.humidity, weather.windSpeed, weather.main, currentHour);
    return { score, factors };
  }, [weather]);

  if (!weather) return null;
  if (!data) return null;

  const { score, factors } = data;
  const cat = getSleepCategory(score);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiMoon className="text-white" /> Sleep Quality
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: cat.color }}>{cat.label}</span>
      </div>

      {/* score ring + tip */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={cat.color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {cat.icon}
            <span className="text-white text-xl font-bold leading-none mt-1">{score}</span>
            <span className="text-white/30 text-[9px]">/100</span>
          </div>
        </div>
        <p className="text-white/40 text-xs leading-relaxed">{cat.tip}</p>
      </div>

      {/* factor breakdown */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.04]">
            <span className="text-[10px] font-bold" style={{ color: f.color }}>{f.value}</span>
            <span className="text-white/40 text-[10px]">{f.label}</span>
          </div>
        ))}
      </div>

      {/* weather conditions */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.temp}°</p>
          <p className="text-white/30 text-[10px]">Temp</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.humidity}%</p>
          <p className="text-white/30 text-[10px]">Humidity</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.windSpeed}</p>
          <p className="text-white/30 text-[10px]">Wind</p>
        </div>
      </div>
    </div>
  );
};

export default SleepQualityIndex;
