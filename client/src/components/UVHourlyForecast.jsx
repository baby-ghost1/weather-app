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

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiSun className="text-white" /> UV Index Hourly
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: currentUV.color }}>{currentUV.label}</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl"><FiSun className="text-white" /></span>
        <div>
          <p className="text-white text-2xl font-medium">{current}</p>
          <p className="text-white/40 text-xs">{currentUV.advice}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {hours.map((h, i) => (
          <div key={i} className="flex flex-col items-center min-w-[40px] p-1.5 rounded-lg bg-white/5">
            <span className="text-[11px] text-white/30">{String(h.hour).padStart(2, "0")}:00</span>
            <div className="w-full h-1 rounded-full my-1" style={{ backgroundColor: h.color }} />
            <span className="text-[11px] font-medium" style={{ color: h.color }}>{h.uv}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UVHourlyForecast;
