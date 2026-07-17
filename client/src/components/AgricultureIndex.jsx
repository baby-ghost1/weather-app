import { useMemo } from "react";
import { FiSunrise, FiDroplet, FiWind, FiSun, FiCloud, FiThermometer, FiCheck } from "react-icons/fi";
import { TbSnowflake, TbFlame, TbPlant, TbMushroom, TbPlant2 } from "react-icons/tb";
import { WiRain } from "react-icons/wi";

const iconMap = {
  "Frost risk! Protect sensitive crops.": TbSnowflake,
  "Heat stress on crops. Increase irrigation.": TbFlame,
  "Ideal growing conditions.": TbPlant,
  "Natural irrigation. Reduce manual watering.": WiRain,
  "Low humidity. Increase irrigation frequency.": FiDroplet,
  "High humidity. Watch for fungal diseases.": TbMushroom,
  "Strong winds. Secure crops and structures.": FiWind,
  "Full sun. Good for photosynthesis.": FiSun,
  "Overcast. Reduced sunlight for crops.": FiCloud,
  "Monsoon season. Ensure proper drainage.": FiDroplet,
  "Rabi season. Prepare for wheat/sowing.": TbPlant2,
  "Summer crops. Monitor water requirements.": FiThermometer,
  "Normal farming conditions.": FiCheck,
};

const getScore = (weather) => {
  let score = 70;
  if (weather.temp >= 18 && weather.temp <= 32 && weather.humidity >= 40 && weather.humidity <= 70) score += 15;
  if (weather.temp < 5 || weather.temp > 40) score -= 20;
  else if (weather.temp < 10 || weather.temp > 35) score -= 10;
  if (weather.humidity < 30 || weather.humidity > 80) score -= 10;
  if (weather.windSpeed > 20) score -= 10;
  if (["Rain", "Thunderstorm"].includes(weather.main)) score -= 5;
  if (weather.clouds < 30) score += 5;
  return Math.max(0, Math.min(100, score));
};

const getSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return { label: "Kharif", color: "#4ade80", sub: "Monsoon crops" };
  if (month >= 11 || month <= 2) return { label: "Rabi", color: "#60a5fa", sub: "Winter crops" };
  return { label: "Summer", color: "#f97316", sub: "Zaid season" };
};

const getSoilMoisture = (humidity, rain, main) => {
  let m = 50;
  if (main === "Rain") m += 30;
  else if (humidity > 70) m += 15;
  else if (humidity < 30) m -= 20;
  if (rain > 0) m += 10;
  m = Math.max(0, Math.min(100, m));
  if (m >= 70) return { value: m, label: "Moist", color: "#60a5fa" };
  if (m >= 40) return { value: m, label: "Adequate", color: "#4ade80" };
  return { value: m, label: "Dry", color: "#f97316" };
};

const getIrrigation = (temp, humidity, main, soilMoisture) => {
  if (main === "Rain") return { label: "Skip today", detail: "Rain provides natural irrigation", color: "#60a5fa" };
  if (soilMoisture.value >= 70) return { label: "Not needed", detail: "Soil moisture is sufficient", color: "#4ade80" };
  if (temp > 35 && humidity < 40) return { label: "Urgent", detail: "Water early morning or late evening", color: "#ef4444" };
  if (temp > 30 || humidity < 50) return { label: "Recommended", detail: "Water in the morning", color: "#f97316" };
  return { label: "Optional", detail: "Check soil before watering", color: "#4ade80" };
};

const getSunlight = (clouds) => {
  if (clouds < 20) return { label: "Full Sun", pct: 95, color: "#fbbf24" };
  if (clouds < 50) return { label: "Partial Sun", pct: 70, color: "#fcd34d" };
  if (clouds < 80) return { label: "Mostly Cloudy", pct: 40, color: "#94a3b8" };
  return { label: "Overcast", pct: 15, color: "#64748b" };
};

const getAdvice = (weather) => {
  if (!weather) return [];
  const { temp, humidity, windSpeed, clouds, main } = weather;
  const month = new Date().getMonth() + 1;
  const tips = [];

  if (temp < 5) tips.push({ text: "Frost risk! Protect sensitive crops.", type: "warning" });
  if (temp > 40) tips.push({ text: "Heat stress on crops. Increase irrigation.", type: "warning" });
  if (temp >= 15 && temp <= 35 && humidity >= 40 && humidity <= 70) tips.push({ text: "Ideal growing conditions.", type: "good" });
  if (main === "Rain") tips.push({ text: "Natural irrigation. Reduce manual watering.", type: "info" });
  if (humidity < 30) tips.push({ text: "Low humidity. Increase irrigation frequency.", type: "caution" });
  if (humidity > 80) tips.push({ text: "High humidity. Watch for fungal diseases.", type: "warning" });
  if (windSpeed > 20) tips.push({ text: "Strong winds. Secure crops and structures.", type: "warning" });
  if (clouds < 30) tips.push({ text: "Full sun. Good for photosynthesis.", type: "good" });
  if (clouds > 70) tips.push({ text: "Overcast. Reduced sunlight for crops.", type: "info" });
  if (month >= 6 && month <= 9) tips.push({ text: "Monsoon season. Ensure proper drainage.", type: "info" });
  if (month >= 10 && month <= 12) tips.push({ text: "Rabi season. Prepare for wheat/sowing.", type: "good" });
  if (month >= 3 && month <= 5) tips.push({ text: "Summer crops. Monitor water requirements.", type: "caution" });
  if (tips.length === 0) tips.push({ text: "Normal farming conditions.", type: "good" });

  return tips;
};

const colorMap = { good: "bg-green-400/10 text-green-300", warning: "bg-orange-400/10 text-orange-300", caution: "bg-yellow-400/10 text-yellow-300", info: "bg-blue-400/10 text-blue-300" };

const AgricultureIndex = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const score = getScore(weather);
    const season = getSeason();
    const tips = getAdvice(weather);
    const soil = getSoilMoisture(weather.humidity, weather.rain || 0, weather.main);
    const irrigation = getIrrigation(weather.temp, weather.humidity, weather.main, soil);
    const sunlight = getSunlight(weather.clouds || 0);
    return { score, season, tips, soil, irrigation, sunlight };
  }, [weather]);

  if (!weather || !data) return null;

  const { score, season, tips, soil, irrigation, sunlight } = data;
  const scoreColor = score >= 70 ? "#4ade80" : score >= 40 ? "#fbbf24" : "#f97316";

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiSunrise className="text-white" /> Agriculture
        </h3>
        <span className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ backgroundColor: `${season.color}20`, color: season.color }}>
          {season.label} — {season.sub}
        </span>
      </div>

      {/* score ring + conditions */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={scoreColor} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-xl font-bold leading-none">{score}</span>
            <span className="text-white/30 text-[9px] mt-0.5">/100</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-2">
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-sm font-medium">{weather.temp}°</p>
            <p className="text-white/30 text-[10px]">Temp</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-sm font-medium">{weather.humidity}%</p>
            <p className="text-white/30 text-[10px]">Humidity</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-sm font-medium">{weather.clouds || 0}%</p>
            <p className="text-white/30 text-[10px]">Clouds</p>
          </div>
        </div>
      </div>

      {/* soil + irrigation + sunlight */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="glass rounded-lg p-2.5 text-center">
          <FiDroplet className="mx-auto mb-1" style={{ color: soil.color }} />
          <p className="text-white text-xs font-medium">{soil.label}</p>
          <p className="text-white/30 text-[10px]">Soil Moisture</p>
          <div className="w-full h-1 rounded-full bg-white/10 mt-1.5 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${soil.value}%`, backgroundColor: soil.color }} />
          </div>
        </div>
        <div className="glass rounded-lg p-2.5 text-center">
          <FiThermometer className="mx-auto mb-1" style={{ color: irrigation.color }} />
          <p className="text-white text-xs font-medium">{irrigation.label}</p>
          <p className="text-white/30 text-[10px]">Irrigation</p>
          <p className="text-white/20 text-[9px] mt-1 leading-tight">{irrigation.detail}</p>
        </div>
        <div className="glass rounded-lg p-2.5 text-center">
          <FiSun className="mx-auto mb-1" style={{ color: sunlight.color }} />
          <p className="text-white text-xs font-medium">{sunlight.label}</p>
          <p className="text-white/30 text-[10px]">Sunlight</p>
          <div className="w-full h-1 rounded-full bg-white/10 mt-1.5 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${sunlight.pct}%`, backgroundColor: sunlight.color }} />
          </div>
        </div>
      </div>

      {/* tips */}
      <div className="space-y-1.5">
        {tips.map((tip, i) => {
          const Icon = iconMap[tip.text] || FiCheck;
          return (
            <div key={tip.text} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${colorMap[tip.type]}`}>
              <Icon size={14} />
              <span className="text-[11px]">{tip.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgricultureIndex;
