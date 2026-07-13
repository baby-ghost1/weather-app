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

const GardenPlanner = ({ weather }) => {
  const tasks = useMemo(() => {
    if (!weather) return [];
    const currentMonth = new Date().getMonth() + 1;
    return getGardenAdvice(weather.temp, weather.humidity, weather.windSpeed, weather.clouds || 0, weather.main, currentMonth);
  }, [weather]);

  if (!weather) return null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiSunrise className="text-white" /> Garden Planner
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.temp}°</p>
          <p className="text-white/30 text-[11px]">Temp</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.humidity}%</p>
          <p className="text-white/30 text-[11px]">Humidity</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.clouds || 0}%</p>
          <p className="text-white/30 text-[11px]">Clouds</p>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
            <span className="text-sm">{iconMap[t.message] || <FiCheck className="text-white" />}</span>
            <span className={`text-xs ${t.type === "good" ? "text-green-300" : t.type === "warning" ? "text-orange-300" : "text-white/60"}`}>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GardenPlanner;
