import { useMemo } from "react";
import { FiSunrise, FiDroplet, FiRepeat, FiClock, FiSun, FiCheck } from "react-icons/fi";
import { TbPlant, TbLeaf, TbSnowflake, TbFlower, TbBug, TbPlant2 } from "react-icons/tb";

const iconMap = {
  "Ideal for planting & transplanting": <TbPlant className="text-white" />,
  "Skip watering - natural irrigation": <FiDroplet className="text-white" />,
  "Good day for composting": <FiRepeat className="text-white" />,
  "Water deeply in early morning": <FiDroplet className="text-white" />,
  "Mulch around plants to retain moisture": <TbLeaf className="text-white" />,
  "Harvest early morning or evening": <FiClock className="text-white" />,
  "Secure tall plants & stakes": <TbLeaf className="text-white" />,
  "Provide shade for delicate plants": <FiSun className="text-white" />,
  "Cover frost-sensitive plants": <TbSnowflake className="text-white" />,
  "Spring sowing season active": <TbFlower className="text-white" />,
  "Monitor for pests & diseases": <TbBug className="text-white" />,
  "Harvest season - collect seeds": <TbPlant2 className="text-white" />,
  "Regular garden maintenance": <FiCheck className="text-white" />,
};

const getGardenAdvice = (temp, humidity, windSpeed, clouds, main, month) => {
  const tips = [];
  if (temp >= 18 && temp <= 30 && humidity >= 40 && humidity <= 70) {
    tips.push({ type: "good", message: "Excellent conditions for planting and garden work." });
  }
  if (main === "Rain" || main === "Drizzle") {
    tips.push({ type: "info", message: "Rain expected. Hold off on watering plants today." });
  }
  if (humidity < 30) {
    tips.push({ type: "warning", message: "Low humidity. Increase watering frequency for plants." });
  }
  if (temp > 35) {
    tips.push({ type: "warning", message: "Extreme heat. Provide shade for sensitive plants." });
  }
  if (windSpeed > 15) {
    tips.push({ type: "warning", message: "Strong winds. Protect young plants and stakes." });
  }
  if (clouds < 30 && temp > 25) {
    tips.push({ type: "info", message: "High sunlight. Ensure adequate soil moisture." });
  }
  if (temp < 10) {
    tips.push({ type: "warning", message: "Cold temperatures. Bring sensitive plants indoors." });
  }
  if (month >= 2 && month <= 4) {
    tips.push({ type: "info", message: "Spring season. Good time for planting and pruning." });
  } else if (month >= 5 && month <= 7) {
    tips.push({ type: "info", message: "Summer season. Focus on watering and pest control." });
  } else if (month >= 8 && month <= 9) {
    tips.push({ type: "info", message: "Monsoon season. Ensure proper drainage for plants." });
  }
  if (tips.length === 0) {
    tips.push({ type: "info", message: "Average gardening conditions. Proceed with routine maintenance." });
  }
  return tips;
};

const getGardenScore = (temp, humidity, windSpeed, clouds, main) => {
  let score = 70;
  if (temp >= 18 && temp <= 30) score += 15;
  else if (temp >= 10 && temp <= 35) score += 5;
  if (humidity >= 40 && humidity <= 70) score += 10;
  else if (humidity < 30 || humidity > 80) score -= 10;
  if (windSpeed > 15) score -= 10;
  if (main === "Rain" || main === "Drizzle") score += 5;
  if (temp > 35) score -= 15;
  if (temp < 10) score -= 15;
  if (clouds < 30 && temp > 25) score += 5;
  return Math.max(0, Math.min(100, score));
};

const getGardenCategory = (score) => {
  if (score >= 80) return { label: "Ideal", color: "#00e400" };
  if (score >= 60) return { label: "Good", color: "#8BC34A" };
  if (score >= 40) return { label: "Fair", color: "#ffff00" };
  if (score >= 20) return { label: "Poor", color: "#ff7e00" };
  return { label: "Avoid", color: "#ff0000" };
};

const tipColor = (type) => {
  if (type === "good") return "bg-green-400/10 text-green-300";
  if (type === "warning") return "bg-orange-400/10 text-orange-300";
  return "bg-blue-400/10 text-blue-300";
};

const GardenPlanner = ({ weather }) => {
  const tasks = useMemo(() => {
    if (!weather) return [];
    const currentMonth = new Date().getMonth() + 1;
    return getGardenAdvice(weather.temp, weather.humidity, weather.windSpeed, weather.clouds || 0, weather.main, currentMonth);
  }, [weather]);

  const score = useMemo(() => {
    if (!weather) return null;
    return getGardenScore(weather.temp, weather.humidity, weather.windSpeed, weather.clouds || 0, weather.main);
  }, [weather]);

  if (!weather) return null;

  const category = score !== null ? getGardenCategory(score) : null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiSunrise className="text-white" /> Garden Planner
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
        <div className="grid grid-cols-3 gap-2 flex-1">
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-xs font-medium">{weather.temp}°</p>
            <p className="text-white/30 text-[10px]">Temp</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-xs font-medium">{weather.humidity}%</p>
            <p className="text-white/30 text-[10px]">Humidity</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-xs font-medium">{weather.clouds || 0}%</p>
            <p className="text-white/30 text-[10px]">Clouds</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tasks.map((t, i) => (
          <div key={t.message} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] ${tipColor(t.type)}`}>
            <span className="text-sm">{iconMap[t.message] || <FiCheck className="text-white" />}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GardenPlanner;
