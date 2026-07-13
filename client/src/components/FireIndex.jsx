import { useMemo } from "react";
import { FiAlertTriangle, FiCheck, FiXOctagon, FiShield } from "react-icons/fi";

const getFireRisk = (weather) => {
  if (!weather) return { risk: 0, factors: [] };
  let risk = 0;
  const factors = [];

  if (weather.temp > 35) { risk += 30; factors.push({ label: "Extreme Heat", value: `+${Math.round((weather.temp - 35) * 2)}`, color: "#ef4444" }); }
  else if (weather.temp > 30) { risk += 20; factors.push({ label: "High Temp", value: "+20", color: "#f97316" }); }
  else { factors.push({ label: "Temperature", value: "OK", color: "#4ade80" }); }

  if (weather.humidity < 30) { risk += 20; factors.push({ label: "Low Humidity", value: "+20", color: "#f97316" }); }
  else if (weather.humidity < 40) { risk += 10; factors.push({ label: "Dry Air", value: "+10", color: "#fbbf24" }); }
  else { factors.push({ label: "Humidity", value: "OK", color: "#4ade80" }); }

  if (weather.windSpeed > 20) { risk += 15; factors.push({ label: "Strong Wind", value: "+15", color: "#ef4444" }); }
  else if (weather.windSpeed > 10) { risk += 5; factors.push({ label: "Wind", value: "+5", color: "#fbbf24" }); }
  else { factors.push({ label: "Wind", value: "OK", color: "#4ade80" }); }

  if (weather.main === "Thunderstorm") { risk += 25; factors.push({ label: "Lightning", value: "+25", color: "#ef4444" }); }

  return { risk: Math.min(100, risk), factors };
};

const getFireCategory = (risk) => {
  if (risk <= 20) return { label: "Low", color: "#4ade80", advice: "Minimal fire risk. Standard precautions apply." };
  if (risk <= 40) return { label: "Moderate", color: "#fbbf24", advice: "Be cautious with open flames and campfires." };
  if (risk <= 60) return { label: "High", color: "#f97316", advice: "Avoid outdoor burning. Keep fire extinguisher ready." };
  if (risk <= 80) return { label: "Very High", color: "#ef4444", advice: "Extreme fire danger! No outdoor fires allowed." };
  return { label: "Extreme", color: "#7e0023", advice: "DANGER! Evacuate if told. Highest fire alert level." };
};

const getSafetyChecklist = (risk) => {
  const base = ["Keep fire extinguisher accessible", "Clear dry vegetation near structures"];
  if (risk > 40) base.push("Avoid outdoor burning entirely");
  if (risk > 60) base.push("Report smoke or fire immediately");
  if (risk > 80) base.push("Prepare evacuation plan");
  return base;
};

const FireIndex = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const { risk, factors } = getFireRisk(weather);
    const category = getFireCategory(risk);
    const checklist = getSafetyChecklist(risk);
    return { risk, category, factors, checklist };
  }, [weather]);

  if (!weather || !data) return null;

  const { risk, category, factors, checklist } = data;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">Fire Risk</h3>
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
            {risk > 40 ? <FiAlertTriangle className="text-xs mb-0.5" style={{ color: category.color }} /> : <FiCheck className="text-xs mb-0.5" style={{ color: category.color }} />}
            <span className="text-white text-xl font-bold leading-none">{risk}</span>
            <span className="text-white/30 text-[8px]">/100</span>
          </div>
        </div>
        <p className="text-white/40 text-[11px] leading-relaxed">{category.advice}</p>
      </div>

      {/* factor breakdown */}
      <div className="flex gap-2 mb-4">
        {factors.map((f) => (
          <div key={f.label} className="flex-1 glass rounded-lg p-2 text-center">
            <p className="text-xs font-medium" style={{ color: f.color }}>{f.value}</p>
            <p className="text-white/30 text-[10px]">{f.label}</p>
          </div>
        ))}
      </div>

      {/* 3x1 grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
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

      {/* safety checklist */}
      {risk > 20 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 mb-1">
            <FiShield className="text-white/30 text-[11px]" />
            <span className="text-white/30 text-[10px] uppercase tracking-wider">Safety Checklist</span>
          </div>
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1 rounded bg-white/[0.03]">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-white/40 text-[11px]">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FireIndex;
