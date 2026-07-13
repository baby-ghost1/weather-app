import { useMemo } from "react";
import { FiSunrise, FiDroplet, FiWind, FiSun, FiCloud, FiThermometer, FiCheck } from "react-icons/fi";
import { TbSnowflake, TbFlame, TbPlant, TbMushroom, TbPlant2 } from "react-icons/tb";
import { WiRain } from "react-icons/wi";

const iconMap = {
  "Frost risk! Protect sensitive crops.": <TbSnowflake className="text-white" />,
  "Heat stress on crops. Increase irrigation.": <TbFlame className="text-white" />,
  "Ideal growing conditions.": <TbPlant className="text-white" />,
  "Natural irrigation. Reduce manual watering.": <WiRain className="text-white" />,
  "Low humidity. Increase irrigation frequency.": <FiDroplet className="text-white" />,
  "High humidity. Watch for fungal diseases.": <TbMushroom className="text-white" />,
  "Strong winds. Secure crops and structures.": <FiWind className="text-white" />,
  "Full sun. Good for photosynthesis.": <FiSun className="text-white" />,
  "Overcast. Reduced sunlight for crops.": <FiCloud className="text-white" />,
  "Monsoon season. Ensure proper drainage.": <FiDroplet className="text-white" />,
  "Rabi season. Prepare for wheat/sowing.": <TbPlant2 className="text-white" />,
  "Summer crops. Monitor water requirements.": <FiThermometer className="text-white" />,
  "Normal farming conditions.": <FiCheck className="text-white" />,
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

const AgricultureIndex = ({ weather }) => {
  const tips = useMemo(() => getAdvice(weather), [weather]);
  const colorMap = { good: "text-green-400", warning: "text-orange-400", caution: "text-yellow-400", info: "text-blue-400" };

  if (!weather) return null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiSunrise className="text-white" /> Agriculture
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-sm font-medium">{weather.temp}°</p>
          <p className="text-white/30 text-[11px]">Temp</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-sm font-medium">{weather.humidity}%</p>
          <p className="text-white/30 text-[11px]">Humidity</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-sm font-medium">{weather.clouds || 0}%</p>
          <p className="text-white/30 text-[11px]">Clouds</p>
        </div>
      </div>

      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-sm">{iconMap[tip.text] || <FiCheck className="text-white" />}</span>
            <span className={`text-xs ${colorMap[tip.type]}`}>{tip.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgricultureIndex;
