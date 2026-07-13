import { useMemo } from "react";
import { FiCalendar } from "react-icons/fi";

const MonthlyHeatmap = ({ weather }) => {
  const months = useMemo(() => {
    if (!weather) return [];
    const currentMonth = new Date().getMonth() + 1;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames.map((name, i) => {
      const estTemp = weather.temp + Math.sin(((i + 1 - currentMonth) / 12) * Math.PI * 2) * 8;
      const estPrecip = 30 + Math.sin(((i + 1 + 2) / 12) * Math.PI * 2) * 40;
      let tempColor = "#00e400";
      if (estTemp > 35) tempColor = "#ff0000";
      else if (estTemp > 30) tempColor = "#ff7e00";
      else if (estTemp > 20) tempColor = "#ffff00";
      else if (estTemp > 10) tempColor = "#60a5fa";
      return {
        name,
        temp: Math.round(estTemp),
        precip: Math.max(0, Math.round(estPrecip)),
        tempColor,
        isCurrent: i + 1 === currentMonth,
      };
    });
  }, [weather]);

  if (!weather) return null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiCalendar className="text-white" /> Monthly Heatmap
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {months.map((m, i) => (
          <div key={i} className={`rounded-lg p-2 text-center transition-all ${m.isCurrent ? "ring-2 ring-white/30 scale-105" : ""}`}>
            <p className={`text-[11px] font-medium mb-1 ${m.isCurrent ? "text-white" : "text-white/40"}`}>{m.name}</p>
            <div className="w-full h-3 rounded-full mb-1" style={{ backgroundColor: m.tempColor, opacity: m.isCurrent ? 1 : 0.5 }} />
            <p className="text-[11px] text-white/50">{m.temp}°</p>
            <p className="text-[11px] text-white/20">💧{m.precip}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyHeatmap;
