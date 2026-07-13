import { useMemo } from "react";
import { TbFlower } from "react-icons/tb";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

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

const getPollenTypes = (risk, month) => {
  const tree = month >= 2 && month <= 5 ? Math.min(risk + 10, 100) : Math.max(risk - 20, 0);
  const grass = month >= 4 && month <= 8 ? Math.min(risk + 5, 100) : Math.max(risk - 15, 0);
  const weed = month >= 8 && month <= 10 ? Math.min(risk + 8, 100) : Math.max(risk - 25, 0);
  return [
    { name: "Tree", value: tree, color: "#4ade80" },
    { name: "Grass", value: grass, color: "#facc15" },
    { name: "Weed", value: weed, color: "#f97316" },
  ];
};

const PollenCount = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const currentMonth = new Date().getMonth() + 1;
    const risk = getPollenRisk(weather.temp, weather.humidity, weather.windSpeed, weather.main, currentMonth);
    const category = getPollenCategory(risk);
    const types = getPollenTypes(risk, currentMonth);
    return { risk, category, types };
  }, [weather]);

  if (!weather || !data) return null;

  const { risk, category, types } = data;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">Pollen Count</h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: category.color }}>
          {category.label}
        </span>
      </div>

      {/* ring + advice */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={category.color} strokeWidth="2.5" strokeDasharray={`${risk}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <TbFlower className="text-sm mb-0.5" style={{ color: category.color }} />
            <span className="text-white text-xl font-bold leading-none">{risk}</span>
            <span className="text-white/30 text-[8px]">/100</span>
          </div>
        </div>
        <div>
          <p className="text-white text-sm font-medium mb-1">{category.advice}</p>
        </div>
      </div>

      {/* pollen type breakdown */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {types.map((t) => (
          <div key={t.name} className="glass rounded-lg p-2.5 text-center">
            <div className="w-full h-1.5 rounded-full bg-white/10 mb-2 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.value}%`, backgroundColor: t.color }} />
            </div>
            <p className="text-white text-xs font-medium">{t.value}</p>
            <p className="text-white/30 text-[10px]">{t.name}</p>
          </div>
        ))}
      </div>

      {/* tip */}
      {risk >= 50 && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-orange-400/[0.06]">
          <FiAlertTriangle className="text-orange-400/50 text-xs shrink-0 mt-0.5" />
          <p className="text-orange-300/50 text-[11px] leading-relaxed">Wear a mask outdoors. Shower after being outside to remove pollen.</p>
        </div>
      )}
      {risk < 25 && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-green-400/[0.06]">
          <FiInfo className="text-green-400/50 text-xs shrink-0 mt-0.5" />
          <p className="text-green-300/50 text-[11px] leading-relaxed">Great day for outdoor activities. No allergy concerns.</p>
        </div>
      )}
    </div>
  );
};

export default PollenCount;
