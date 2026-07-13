import { useMemo } from "react";
import { TbFlower } from "react-icons/tb";

const getPollenRisk = (temp, humidity, windSpeed, main, month) => {
  let risk = 0;
  if (temp >= 15 && temp <= 30) risk += 15;
  else if (temp >= 10 && temp <= 35) risk += 8;
  if (humidity >= 40 && humidity <= 70) risk += 10;
  else if (humidity >= 30 && humidity <= 80) risk += 5;
  if (windSpeed < 10) risk += 10;
  else if (windSpeed < 20) risk += 5;
  if (main === "Clear") risk += 15;
  if (main === "Clouds") risk += 10;
  if (["Rain", "Drizzle"].includes(main)) risk -= 20;
  if (month >= 2 && month <= 5) risk += 20;
  else if (month >= 6 && month <= 8) risk += 15;
  else if (month >= 9 && month <= 10) risk += 10;
  return Math.max(0, Math.min(100, risk));
};

const getPollenCategory = (risk) => {
  if (risk >= 75) return { label: "Very High", color: "#7e0023", advice: "Avoid outdoor activities. Keep windows closed." };
  if (risk >= 50) return { label: "High", color: "#ff0000", advice: "Limit outdoor time. Take allergy medication." };
  if (risk >= 25) return { label: "Moderate", color: "#ff7e00", advice: "Some allergens present. Monitor symptoms." };
  return { label: "Low", color: "#00e400", advice: "Low pollen count. Safe for outdoor activities." };
};

const PollenCount = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const currentMonth = new Date().getMonth() + 1;
    const risk = getPollenRisk(weather.temp, weather.humidity, weather.windSpeed, weather.main, currentMonth);
    const { label, color, advice } = getPollenCategory(risk);
    return { risk, label, color, advice };
  }, [weather]);

  if (!weather || !data) return null;

  const { risk, label, color, advice } = data;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">Pollen Count</h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: color }}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl"><TbFlower size={32} className="text-white" /></div>
        <div>
          <p className="text-white text-lg font-medium">{risk}/100</p>
          <p className="text-white/40 text-xs">{advice}</p>
        </div>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${risk}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

export default PollenCount;
