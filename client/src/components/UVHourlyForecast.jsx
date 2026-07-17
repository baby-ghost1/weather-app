import { useMemo } from "react";
import { FiSun } from "react-icons/fi";

const getUVLevel = (v) => {
  if (v <= 2) return { label: "Low", color: "#00e400", advice: "No protection needed" };
  if (v <= 5) return { label: "Moderate", color: "#ffff00", advice: "Wear sunscreen & sunglasses" };
  if (v <= 7) return { label: "High", color: "#ff9800", advice: "Seek shade. Wear SPF 30+." };
  if (v <= 10) return { label: "Very High", color: "#ff0000", advice: "Avoid midday sun. SPF 50+." };
  return { label: "Extreme", color: "#9c27b0", advice: "Stay indoors 10 AM - 4 PM" };
};

const UVHourlyForecast = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const current = weather.uv || 0;
    const hours = [];
    for (let i = 0; i < 8; i++) {
      const h = i * 3;
      const estUv = Math.max(0, current * Math.sin(((h + 6) / 18) * Math.PI));
      let lvl, col;
      if (estUv <= 2) { lvl = "Low"; col = "#00e400"; }
      else if (estUv <= 5) { lvl = "Moderate"; col = "#ffff00"; }
      else if (estUv <= 7) { lvl = "High"; col = "#ff7e00"; }
      else if (estUv <= 10) { lvl = "Very High"; col = "#ff0000"; }
      else { lvl = "Extreme"; col = "#7e0023"; }
      hours.push({ hour: h, uv: Math.round(estUv * 10) / 10, level: lvl, color: col });
    }
    return { current, hours };
  }, [weather]);

  if (!weather) return null;
  if (!data) return null;

  const { current, hours } = data;
  const currentUV = getUVLevel(current);
  const score = Math.max(0, Math.min(100, Math.round(100 - current * 10)));

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiSun className="text-white" /> UV Index Hourly
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: currentUV.color }}>{currentUV.label}</span>
      </div>

      {/* ring + advice */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={currentUV.color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FiSun className="text-xs mb-0.5" style={{ color: currentUV.color }} />
            <span className="text-white text-xl font-bold leading-none">{current}</span>
            <span className="text-white/30 text-[8px]">UV</span>
          </div>
        </div>
        <p className="text-white/40 text-[11px] leading-relaxed">{currentUV.advice}</p>
      </div>

      {/* glow badge for current UV */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4" style={{ backgroundColor: `${currentUV.color}12`, boxShadow: `0 0 20px ${currentUV.color}15` }}>
        <FiSun className="text-sm shrink-0" style={{ color: currentUV.color }} />
        <span className="text-[11px] font-medium" style={{ color: currentUV.color }}>Current UV: {current}</span>
        <span className="text-white/40 text-[11px] ml-auto">{currentUV.label}</span>
      </div>

      {/* hourly bars */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {hours.map((h, i) => (
          <div key={i} className="flex flex-col items-center min-w-[42px] flex-1 p-2 rounded-lg bg-white/5">
            <span className="text-[10px] text-white/30 mb-1">{String(h.hour).padStart(2, "0")}:00</span>
            <div className="w-full rounded-full mb-1.5 transition-all duration-500" style={{ height: `${Math.max(h.uv * 5, 4)}px`, backgroundColor: h.color, boxShadow: `0 0 6px ${h.color}30` }} />
            <span className="text-[11px] font-medium" style={{ color: h.color }}>{h.uv}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UVHourlyForecast;
