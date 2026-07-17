import { useMemo } from "react";
import { FiMapPin, FiCheck, FiX } from "react-icons/fi";

const getTravelScore = (temp, humidity, windSpeed, visibility, main) => {
  let score = 80;
  if (temp <= 5 || temp >= 40) score -= 20;
  else if (temp <= 10 || temp >= 35) score -= 10;
  else if (temp <= 15 || temp >= 30) score -= 5;
  if (humidity >= 85) score -= 10;
  else if (humidity >= 70) score -= 5;
  if (windSpeed > 20) score -= 15;
  else if (windSpeed > 10) score -= 5;
  if (visibility < 1000) score -= 20;
  else if (visibility < 5000) score -= 8;
  if (main === "Thunderstorm") score -= 25;
  else if (["Rain", "Drizzle", "Snow"].includes(main)) score -= 10;
  return Math.max(0, Math.min(100, score));
};

const getTravelAdvice = (score, main, temp) => {
  const tips = [];
  if (score >= 80) {
    tips.push({ text: "Perfect weather for travel.", good: true });
    tips.push({ text: "Ideal conditions for outdoor plans.", good: true });
  } else if (score >= 60) {
    tips.push({ text: "Generally favorable for travel.", good: true });
    tips.push({ text: "Pack for mild conditions.", good: true });
  } else if (score >= 40) {
    tips.push({ text: "Travel possible with caution.", good: false });
    tips.push({ text: "Check local weather updates.", good: false });
  } else {
    tips.push({ text: "Travel conditions are poor.", good: false });
    tips.push({ text: "Consider postponing non-essential travel.", good: false });
  }
  return tips;
};

const scoreColor = (s) => s >= 80 ? "#00e400" : s >= 60 ? "#ffff00" : s >= 40 ? "#ff7e00" : "#ff0000";
const scoreLabel = (s) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : s >= 40 ? "Fair" : "Poor";

const TravelAdvisory = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const score = getTravelScore(weather.temp, weather.humidity, weather.windSpeed, weather.visibility, weather.main);
    const tips = getTravelAdvice(score, weather.main, weather.temp);
    return { score, tips };
  }, [weather]);

  if (!weather) return null;
  if (!data) return null;

  const { score, tips } = data;
  const color = scoreColor(score);
  const label = scoreLabel(score);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiMapPin className="text-white" /> Travel Advisory
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: color }}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-xl font-bold leading-none">{score}</span>
            <span className="text-white/30 text-[9px] mt-0.5">/100</span>
          </div>
        </div>
        <div>
          <p className="text-white text-sm font-medium">{label} for travel</p>
          <p className="text-white/40 text-[11px] leading-relaxed mt-0.5">
            {weather.temp}°C, {weather.humidity}% humidity
          </p>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        {tips.map((tip, i) => (
          <div key={tip.text} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg ${tip.good ? "bg-green-400/10" : "bg-orange-400/10"}`}>
            {tip.good ? (
              <FiCheck className="text-green-300 text-xs shrink-0" />
            ) : (
              <FiX className="text-orange-300 text-xs shrink-0" />
            )}
            <span className={`text-xs ${tip.good ? "text-green-300" : "text-orange-300"}`}>{tip.text}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/[0.04] rounded-lg p-2.5 text-center">
          <p className="text-white text-sm font-medium">{weather.temp}°</p>
          <p className="text-white/30 text-[10px]">Temperature</p>
        </div>
        <div className="bg-white/[0.04] rounded-lg p-2.5 text-center">
          <p className="text-white text-sm font-medium">{weather.humidity}%</p>
          <p className="text-white/30 text-[10px]">Humidity</p>
        </div>
      </div>
    </div>
  );
};

export default TravelAdvisory;
