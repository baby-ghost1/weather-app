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
  const color = score >= 80 ? "#00e400" : score >= 60 ? "#ffff00" : score >= 40 ? "#ff7e00" : "#ff0000";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Poor";

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiMapPin className="text-white" /> Travel Advisory
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: color }}>
          {label} ({score}/100)
        </span>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>

      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-center gap-2">
            {tip.good ? (
              <FiCheck className="text-green-400 text-xs shrink-0" />
            ) : (
              <FiX className="text-orange-400 text-xs shrink-0" />
            )}
            <span className="text-white/60 text-xs">{tip.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-sm font-medium">{weather.temp}°</p>
          <p className="text-white/30 text-[11px]">Temperature</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-sm font-medium">{weather.humidity}%</p>
          <p className="text-white/30 text-[11px]">Humidity</p>
        </div>
      </div>
    </div>
  );
};

export default TravelAdvisory;
